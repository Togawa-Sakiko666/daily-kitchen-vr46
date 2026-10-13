import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,dirname,extname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes,createHmac,timingSafeEqual} from 'node:crypto';
import {ai,cfg} from './provider.mjs';
import {recipes} from './recipes.mjs';
import {makeVisionRequest,parseVisionResponse,validateImages} from './api/api-entry.js';
const root=dirname(fileURLToPath(import.meta.url));
const production=cfg.NODE_ENV==='production';
export function createServer(){
 if(!cfg.LOGIN_USERNAME||!cfg.LOGIN_PASSWORD||cfg.LOGIN_PASSWORD.length<12||!cfg.SESSION_SECRET||cfg.SESSION_SECRET.length<32)throw Error('请设置 LOGIN_USERNAME、至少12位 LOGIN_PASSWORD、至少32位 SESSION_SECRET。');
 const origin=cfg.APP_ORIGIN||(cfg.RENDER_EXTERNAL_HOSTNAME?'https://'+cfg.RENDER_EXTERNAL_HOSTNAME:'http://localhost:'+(cfg.PORT||3210));
 if(new URL(origin).origin!==origin||production&&!origin.startsWith('https://'))throw Error('APP_ORIGIN 必须是完整网站源地址，生产环境必须使用 HTTPS，末尾不要斜杠。');
 const sessions=new Map(), attempts=new Map();let loginCalls=[],calls=[],active=false;
 const sign=v=>createHmac('sha256',cfg.SESSION_SECRET).update(v).digest('hex');
 const equal=(a,b)=>{const x=Buffer.from(sign(a)),y=Buffer.from(sign(b));return timingSafeEqual(x,y);};
 const cookie=v=>'kitchen_session='+v+'; HttpOnly; SameSite=Strict; Path=/; Max-Age='+ (v?43200:0)+(production?'; Secure':'');
 function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));}
 async function body(req,limit=8100000){let n=0;const chunks=[];for await(const c of req){n+=c.length;if(n>limit)throw Error('上传内容过大');chunks.push(c);}try{return JSON.parse(Buffer.concat(chunks).toString());}catch{throw Error('JSON 格式无效');}}
 return http.createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
  try{
   const path=new URL(req.url,'http://localhost').pathname;
   if(path==='/healthz'&&req.method==='GET')return json(res,200,{ok:true});
   if(req.method==='POST'){
    if(req.headers.origin!==origin)return json(res,403,{error:'请求来源无效，请从配置的网站地址访问。'});
    if(!req.headers['content-type']?.startsWith('application/json'))return json(res,415,{error:'需要 JSON 格式'});
   }
   const now=Date.now();for(const [k,v] of sessions)if(v<now)sessions.delete(k);for(const [k,v]of attempts)if(v.until<now)attempts.delete(k);
   if(path==='/api/login'&&req.method==='POST'){
    // Use the socket address; never trust attacker-supplied forwarded headers.
    const ip=req.socket.remoteAddress;loginCalls=loginCalls.filter(t=>now-t<60000);
    if(loginCalls.length>=30||(attempts.get(ip)?.count||0)>=8)return json(res,429,{error:'登录尝试过多，请15分钟后重试。'});
    loginCalls.push(now);const d=await body(req,4096);const a=attempts.get(ip)||{count:0,until:now+900000};a.count++;attempts.set(ip,a);
    if(typeof d.username!=='string'||typeof d.password!=='string'||!equal(d.username,cfg.LOGIN_USERNAME)||!equal(d.password,cfg.LOGIN_PASSWORD))return json(res,401,{error:'账号或密码不正确'});
    if(sessions.size>=1000)return json(res,429,{error:'会话过多，请稍后再试'});
    attempts.delete(ip);const token=randomBytes(32).toString('hex');sessions.set(token,now+43200000);res.setHeader('Set-Cookie',cookie(token));return json(res,200,{ok:true});
   }
   const token=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('kitchen_session='))?.slice(16);
   const logged=!!token&&sessions.has(token);
   if(path==='/login'||path==='/login.js'){
    if(req.method!=='GET'){res.writeHead(405);return res.end();}
    if(path==='/login'&&logged){res.writeHead(302,{Location:'/'});return res.end();}
    const file=path==='/login'?'login.html':'login.js';res.setHeader('Content-Type',path==='/login'?'text/html; charset=utf-8':'text/javascript; charset=utf-8');return res.end(await readFile(resolve(root,'public',file)));
   }
   if(!logged){if(path.startsWith('/api/'))return json(res,401,{error:'登录已过期，请重新登录。'});res.writeHead(302,{Location:'/login'});return res.end();}
   if(path==='/api/logout'&&req.method==='POST'){sessions.delete(token);res.setHeader('Set-Cookie',cookie(''));return json(res,200,{ok:true});}
   if(req.method==='GET'&&path==='/api/identify')return json(res,200,{ready:!!cfg.OPENAI_API_KEY});
   if(req.method==='POST'&&['/api/identify','/api/recipes'].includes(path)){
    calls=calls.filter(t=>now-t<60000);if(active||calls.length>=6)return json(res,429,{error:'正在处理或请求过于频繁，请稍后再试。'});
    let data;try{data=await body(req);if(path==='/api/identify')validateImages(data);else{if(!data||typeof data!=='object')throw Error('菜谱格式无效');}}catch(e){return json(res,400,{error:e.message});}
    active=true;calls.push(now);try{return json(res,200,path==='/api/identify'?parseVisionResponse(await ai(makeVisionRequest(validateImages(data),cfg.OPENAI_VISION_MODEL||'gpt-4.1-mini'))):await recipes(data));}catch(e){return json(res,502,{error:e.name==='TimeoutError'?'AI 请求超时，请稍后重试。':e.message==='fetch failed'?'无法连接 AI 服务，请稍后重试。':e.message});}finally{active=false;}
   }
   if(path.startsWith('/api/'))return json(res,404,{error:'接口不存在'});
   if(req.method!=='GET'){res.writeHead(405);return res.end();}
   const base=resolve(root,'dist');const file=resolve(base,'.'+decodeURIComponent(path==='/'?'/index.html':path));const rel=relative(base,file);
   if(rel.startsWith('..')||rel.includes(':')||rel.split(/[\\/]/).some(s=>s.startsWith('.'))){res.writeHead(404);return res.end();}
   const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
   try{const bytes=await readFile(file);res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(bytes);}catch{res.writeHead(404);res.end('Not found');}
  }catch{json(res,400,{error:'请求无效'});}
 });
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const server=createServer();server.listen(Number(cfg.PORT)||3210,'0.0.0.0',()=>console.log('Kitchen server ready'));server.on('error',()=>{console.error('服务器启动失败');process.exitCode=1;});}catch(e){console.error(e.message);process.exitCode=1;}
}

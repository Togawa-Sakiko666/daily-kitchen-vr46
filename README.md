# VR46 料理助手 · GitHub + Render 云端版

保留原来的 React VR46 界面、食材目录与自定义食材、优先食材、配餐设置、收藏、烹饪模式、计时器、自动保存、手动保存和导入导出。照片先识别再人工核对；本地配餐规则决定食材、份量、调料，服务器逐菜请求 OpenAI Responses API 编写详细做法。关闭 AI 选项可直接使用本地菜谱。

## 数据和登录

- 单个私人账号，账号密码在服务器环境变量配置。无公开注册或多人数据隔离。
- 登录会话有效12小时；HttpOnly、SameSite Cookie，生产环境 Secure；退出立即撤销。重启服务需要重新登录。
- 食材、收藏及菜谱仍在当前浏览器的 `kitchen-v1` 存储；不会因为 Render 重启而删除，但清理浏览器数据会删除。不同设备、不同域名不会自动同步。登录不加密设备上已有的本地记录，共用设备请使用各自浏览器配置。
- 从旧本地版迁移：旧页面导出 JSON → 新云端地址登录 → 导入 JSON。建议先备份新旧两边。
- 照片只在识图请求期间使用，不保存到本项目服务器；照片会发送给 OpenAI。AI 请求设置 `store:false`，不等于提供商零保留承诺。
- 个人单实例服务有登录限流、AI 每分钟6次和单个在途请求限制。暂不适合多人 SaaS。

## 一步一步部署

### 1. 准备 GitHub 仓库

解压交付的 ZIP。打开 `Daily-Kitchen-Cloud`，确认根目录有 `package.json`、`server.mjs`、`render.yaml`、`source`、`public` 和 `tests`。

在 GitHub 登录，点击右上角 `+` → `New repository`，取名 `daily-kitchen-vr46`，建议选 Private，点击 Create repository。

简单上传方法：仓库页面 `uploading an existing file` / `Add file` → `Upload files`，上传 **Daily-Kitchen-Cloud 里面的内容**，不要再套一层父目录。包括 `source/package-lock.json`。不要上传 `node_modules`、`.env`、`.env.local`、真实密钥或个人备份；网页上传可能不显示隐藏文件，请确认 `.gitignore` 存在。`dist`、`api` 为可重建编译产物，不需要上传。文件较多时推荐下面 Git 方法。

安装 Git 后，在这个项目根目录打开终端：

```powershell
git init
git add .
git status
git commit -m "Prepare VR46 kitchen for Render"
git branch -M main
git remote add origin https://github.com/你的用户名/daily-kitchen-vr46.git
git push -u origin main
```

提交前 `git status` 应不包含 `.env*`（空白的 `.env.example` 可以提交）、`node_modules` 和个人备份。本交付不包含真实密钥。

### 2. 在 Render 新建 Web Service

登录 Render，点击 `New` → `Web Service`，连接 GitHub 并授权访问刚建的仓库，选择它。不要选择 Static Site。

填写：

| 设置 | 值 |
| --- | --- |
| Language / Runtime | Node |
| Branch | main |
| Root Directory | 留空 |
| Build Command | `npm run build && npm run typecheck && npm test` |
| Start Command | `npm start` |
| Health Check Path | `/healthz` |

选适合你的服务套餐。仓库也包含 `render.yaml`，熟悉 Blueprint 后可用它创建服务；第一次建议按上述 Web Service 流程设置。

### 3. 只在 Render 填写环境变量

展开创建页面的 Environment / Advanced，或进入服务的 Environment 页面添加：

| 名称 | 填写内容 |
| --- | --- |
| `NODE_VERSION` | `22.22.0` |
| `NODE_ENV` | `production` |
| `OPENAI_API_KEY` | 你已有的完整 key，只粘贴在 Render |
| `LOGIN_USERNAME` | 你选的登录账号 |
| `LOGIN_PASSWORD` | 你选的强密码，至少12字符 |
| `SESSION_SECRET` | 随机字符串，至少32字符；可用 Render Generate 功能 |
| `OPENAI_VISION_MODEL` | `gpt-4.1-mini`，或账户可用的支持图片和结构化输出的模型 |
| `OPENAI_RECIPE_MODEL` | `gpt-4.1-mini`，或账户可用的支持结构化输出的模型 |

`APP_ORIGIN` 使用默认 Render 地址时可不填，服务器自动读取 `RENDER_EXTERNAL_HOSTNAME`。使用自定义域名时设置为完整地址，例如 `https://kitchen.example.com`，末尾不要 `/`、不要路径。它用于防止其他网站伪造请求。登录提示“请求来源无效”时先检查这一项。

不用设置 PORT，Render 会自动提供。不要把密钥放入 GitHub 文件、README、前端变量或 `VITE_*`。不要把登录密码与 API key 设为相同值。

### 4. 部署并验证

点击 Create Web Service / Deploy，等待日志显示构建成功和 `Kitchen server ready`。点击 Render 给出的 HTTPS 地址，应显示 VR46 登录页。

1. 用配置的账号密码登录；打开新无痕窗口，应仍需登录。
2. 添加鸡蛋、熟米饭、蔬菜；关闭 AI 生成，检查食材管理、收藏、保存、刷新恢复和导出。
3. 勾选 AI，先仅选一餐生成；确认具体步骤。此步会产生你账户的 API 调用。
4. 上传清晰的 JPG/PNG 食材或包装照片，识别后人工核对再加入。
5. 点击退出；页面返回登录页，旧会话不能调用 AI。
6. 导入旧站导出的 JSON；确认食材、收藏和菜谱恢复。不要在无痕模式保存长期记录。

已保存菜谱再次查看不会调用 AI；生成和换一道会调用 AI。模型权限、余额、识别质量和做法质量须在你实际账户下确认。

### 5. 后续更新

修改源码并推送 main 后，Render 默认自动重建部署。更换密钥或密码只在 Render Environment 更新并重新部署。重部署会清除会话，需要重新登录，本地记录仍保留。

## 本地开发与测试

安装 Node.js >=22.13，复制 `.env.example` 为 `.env.local` 并自行设置环境变量；这个文件被 Git 忽略。服务器不主动读取文件，Node 的 env-file 功能仅用于本地启动：

```powershell
npm run build
npm run typecheck
npm test
node --env-file=.env.local server.mjs
```

浏览器访问 `http://localhost:3210`。本地 `APP_ORIGIN=http://localhost:3210`，不要设置 `NODE_ENV=production`。生产必须使用 HTTPS。

## 文件说明

- `source/`：原界面和食材、配餐、收藏与存储源码，加退出和会话过期处理。
- `server.mjs`：登录保护、来源校验、限流、受保护静态文件与 API。
- `provider.mjs`：只读取服务器环境变量的 OpenAI 客户端。
- `recipes.mjs`：逐菜调用、步骤返回校验、保留原食材调料与营养。
- `tests/cloud.test.mjs`：本地 HTTP 集成及模拟 AI 测试。

部署官方文档：[Render Node 服务](https://render.com/docs/deploy-node-express-app)、[Blueprint](https://render.com/docs/blueprint-spec)。AI 接口依据：[OpenAI 图片输入](https://developers.openai.com/api/docs/guides/images-vision)、[结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)。

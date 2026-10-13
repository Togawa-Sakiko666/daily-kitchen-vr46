export default function StepText({text}:{text:string}){
 const split=text.indexOf('｜');if(split<0)return <p>{text}</p>;
 const body=text.slice(split+1);return <div className="recipe-step-text"><h5>{text.slice(0,split)}</h5>{body.split(/(?<=。)/).filter(Boolean).map((line,i)=><p key={i}>{line}</p>)}</div>;
}

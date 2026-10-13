export default function RacingMark(){
 return <div className="racing-mark" aria-label="46，日月赛车主题">
  <svg className="celestial-lines" viewBox="0 0 300 210" fill="none" aria-hidden="true">
   <g className="sun-lines" stroke="currentColor" strokeWidth="1"><circle cx="89" cy="98" r="47"/><circle cx="89" cy="98" r="37"/>{Array.from({length:16},(_,i)=><path key={i} d="M89 38 93 24 89 12 85 24Z" transform={`rotate(${i*22.5} 89 98)`}/>)}</g>
   <path className="moon-lines" d="M239 25a78 78 0 1 0 0 151c-42-8-58-38-58-75 0-35 18-64 58-76Z" strokeWidth="1.5"/>
   <path d="m257 68 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" stroke="currentColor"/>
  </svg>
  <span className="racing-mark-code">PERSONAL / RACING EDITION</span><strong>46</strong><span className="racing-mark-caption">SOLE <i/> LUNA</span>
 </div>;
}

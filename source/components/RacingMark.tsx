export default function RacingMark(){
 return <div className="racing-mark" aria-label="46，日月赛车主题">
  <svg className="celestial-lines" viewBox="0 0 300 210" fill="none" aria-hidden="true">
   <g className="sun-lines" stroke="currentColor" strokeWidth="3"><circle cx="88" cy="95" r="43"/>{Array.from({length:8},(_,i)=><path key={i} d="M83 39 88 15 93 39Z" fill="currentColor" stroke="none" transform={`rotate(${i*45} 88 95)`}/>)}</g>
   <path className="moon-lines" d="M207 24a75 75 0 1 1-1 143 76 76 0 0 0 1-143Z" fill="currentColor"/>
  </svg>
  <span className="racing-mark-code">PERSONAL / RACING EDITION</span><strong>46</strong><span className="racing-mark-caption">SOLE / LUNA</span>
 </div>;
}

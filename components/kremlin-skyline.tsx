/** Stylized fictional backdrop, not an official insignia or health claim. */
export function KremlinSkyline({x=0,y=0,scale=1,opacity=.42}:{x?:number;y?:number;scale?:number;opacity?:number}){return <g className="kremlin-skyline" transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity} aria-hidden="true">
 <path d="M0 97h18V85h13v12h17V85h13v12h17V85h13v12h17V85h13v12h17V85h13v12h17V85h13v12h17V85h13v12h19v51H0Z" fill="#a44e3b"/>
 <path d="M0 121h230m-216 12h24m20 0h24m20 0h24m20 0h24m20 0h24" stroke="#d48b64" strokeWidth="3"/>
 <g fill="#a44e3b" stroke="#794b39" strokeWidth="2"><path d="M33 148V71h38v77Z"/><path d="M158 148V65h42v83Z"/><path d="M92 148V51h45v97Z"/></g>
 <g fill="#4f6650" stroke="#465740" strokeWidth="2"><path d="m29 72 23-48 23 48Z"/><path d="m154 66 25-51 25 51Z"/><path d="m88 52 27-45 26 45Z"/></g>
 <path d="M115 9V-6m-5 2 10 0" stroke="#9b6842" strokeWidth="2"/>
 <path d="m115-13 2 5 6 0-5 4 2 6-5-4-5 4 2-6-5-4h6Z" fill="#a44e3b"/>
 <circle cx="115" cy="67" r="11" fill="#e3c88f" stroke="#77513a" strokeWidth="3"/><path d="M115 59v8l5 3" fill="none" stroke="#514c37" strokeWidth="2"/>
 <g fill="#624736"><path d="M107 148v-27q8-15 16 0v27Z"/><path d="M47 84h10v18H47zm127-6h10v18h-10Z"/></g>
</g>}

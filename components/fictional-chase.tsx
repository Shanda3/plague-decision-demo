"use client";
import { useState } from 'react';
import {KremlinSkyline} from './kremlin-skyline';
import { FICTIONAL_SCENES } from '../lib/fictional-scenes';
import type { FictionalSceneId } from '../lib/fictional-scenes';

/** Original satirical portrait: deliberately bald scalp, close-set pale eyes,
 * long straight nose, cheek folds and thin downturned lips. No photo or agency asset. */
export function PutinHead() {
  return <g>
    <path d="M21 46C15 6 35-7 64 1c28 3 40 22 32 57l-7 33-15 18-29-1-21-22Z" fill="#e3b393" stroke="#584638" strokeWidth="2"/>
    <path className="bald-scalp-highlight" d="M27 32C25 13 41 5 59 7c16 1 24 9 27 21-19-13-42-13-59 4Z" fill="#f1caac"/>
    <path d="M28 40C27 16 41 8 59 8c25 1 31 15 30 36l-9-13-40-2Z" fill="#ecc2a5"/>
    <path d="M22 53c-12-6-13 13-5 22l10 5m69-25c10-4 10 14 1 21l-6 1" fill="#dca987" stroke="#725542" strokeWidth="1.5"/>
    <path d="m22 60-4 7 5 5m72-9 1 8-4 2" fill="none" stroke="#b57e60" strokeWidth="1.5"/>
    <path d="M30 65c-6 18 2 29 16 34L61 104 79 95c9-8 12-18 9-28l-9 11-16 8-24-8Z" fill="#d9a88a"/>
    <path d="M33 48q10-6 21-1m13 0q11-3 19 3" fill="none" stroke="#8d715c" strokeWidth="3.4" strokeLinecap="round"/>
    <path d="M32 55q11-3 22 1-10 3-22-1m34 1q10-3 19 1-8 3-19-1" fill="#f0dcc9" stroke="#8a6851" strokeWidth="1.3"/>
    <ellipse cx="45" cy="55" rx="2.8" ry="1.8" fill="#658591"/><ellipse cx="75" cy="57" rx="2.6" ry="1.7" fill="#658591"/>
    <circle cx="45" cy="55" r="1.2" fill="#273239"/><circle cx="75" cy="57" r="1.2" fill="#273239"/>
    <path d="M32 61q12 4 23 0m12 2q10 3 18-1m-50-22 14-1m19 1 12 1" fill="none" stroke="#b68a6c" strokeWidth="1.2"/>
    <path d="m60 48-5 25 7 4 8-3-3-7" fill="#dca889" stroke="#ad7f62" strokeWidth="1.3"/>
    <path d="m56 73 4-1m5 2 4-1" stroke="#86614a" strokeWidth="1.5"/>
    <path d="M47 85q16-4 28 1-13 6-28-1" fill="#b58470"/><path d="m47 85 28 1" stroke="#775544" strokeWidth="1.5"/>
    <path d="m42 74-6 12m41-11 5 13m-30 9q10 4 18 0M41 28q19-4 35 1m-33 5q16-3 30 0" fill="none" stroke="#bc9073" strokeWidth="1.1"/>
    <path d="M44 104 43 119 73 123 73 107" fill="#dbaa8b" stroke="#86654d" strokeWidth="1.4"/>
  </g>;
}
function HumanLeg({ back = false, hazmat = false }: { back?: boolean; hazmat?: boolean }) {
  const cloth = hazmat ? (back ? '#aa8e31' : '#d4b43f') : (back ? '#303c34' : '#475448');
  return <g transform="translate(77 131)"><g className={`human-thigh ${back ? 'back-limb' : ''}`}><path d="M-8 0 8 0 9 42 4 48-7 43Z" fill={cloth} stroke="#333a2c" strokeWidth="1.6"/><g transform="translate(0 44)"><g className={`human-shin ${back ? 'back-limb' : ''}`}><path d="M-7-3 8-2 6 44-5 45Z" fill={cloth} stroke="#333a2c" strokeWidth="1.5"/><g transform="translate(0 43)"><g className="human-foot"><path d="m-6-3 12 1 15 6 3 7H-9Z" fill="#242a24"/><path d="M-9 11H24" stroke="#7d816b" strokeWidth="2"/></g></g></g></g></g></g>;
}
function HumanArm({ back = false, hazmat = false }: { back?: boolean; hazmat?: boolean }) {
  const cloth = hazmat ? (back ? '#aa8e31' : '#d4b43f') : (back ? '#c8cab7' : '#f4f0de');
  return <g transform="translate(82 80)"><g className={`human-upper-arm ${back ? 'back-limb' : ''}`}><path d="M-6 0 7 0 6 33-7 35Z" fill={cloth} stroke="#343a2b" strokeWidth="1.5"/><g transform="translate(0 33)"><g className={`human-forearm ${back ? 'back-limb' : ''}`}><path d="M-6-2 6-2 5 27-4 28Z" fill={cloth} stroke="#44432e" strokeWidth="1.5"/><ellipse cx="0" cy="30" rx="6" ry="8" fill={hazmat ? '#384739' : '#b8c39a'}/></g></g></g></g>;
}
export function RunningHuman({ hazmat = false, variant = '' }: { hazmat?: boolean; variant?: string }) {
  return <g className={`human ${variant}`}><ellipse className="contact-shadow" cx="80" cy="227" rx="35" ry="5" fill="#333923" opacity=".18"/><g className="human-flight"><HumanLeg back hazmat={hazmat}/><HumanArm back hazmat={hazmat}/><HumanLeg hazmat={hazmat}/><g className="human-torso"><path d={hazmat?'M62 69c9-8 23-8 34 1l-4 34-6 33-24-4-4-32Z':'M62 69c9-8 23-8 34 1l-4 35 7 42-20-4-4-15-5 16-21-4 9-40Z'} fill={hazmat ? '#e0c055' : '#f4f0de'} stroke="#303929" strokeWidth="2"/>{hazmat ? <><path d="M60 65C44 33 53 9 79 8c26-1 42 24 28 55L96 78 65 76Z" fill="#e0c055" stroke="#303929" strokeWidth="2.5"/><path d="M65 28q21-9 36 2l-2 24-30 3Z" fill="#5c7061" stroke="#354132" strokeWidth="3"/><path d="m72 32 20-1" stroke="#c8d6ba" strokeWidth="3"/><circle cx="86" cy="61" r="8" fill="#394737"/><path d="M79 79v43" stroke="#8c783a" strokeWidth="2"/><path d="M62 91h10v7H62Z" fill="#f2e5b5"/></> : <><path className="runner-lab-coat" d="m66 70 10 19 8-20m-8 20-2 39m10-31 9 1-1 10-9-1" fill="none" stroke="#89927c" strokeWidth="1.7"/><path d="m75 67 2-15 18 0-2 18" fill="#aab78c"/><path d="M66 18c12-16 37-12 42 5l1 24-13 18-25-6-9-20Z" fill="#bbc69c" stroke="#3d3d2b" strokeWidth="2"/><path d="M64 37C54 4 92-1 106 18l-1 11-19-10-20 19Z" fill="#343a2d"/><path d="m105 33 10 9-9 5" fill="#bbc69c" stroke="#68523a" strokeWidth="1.5"/><path d="m93 29 10 1m-9 23 9-2" stroke="#3d3a2b" strokeWidth="2"/><circle cx="100" cy="35" r="2" fill="#282f25"/><path d="m92 40 10 2m-12 12q7-6 13-1" fill="none" stroke="#7d8c68" strokeWidth="2"/><path className="runner-sweat" d="M67 42q-6 8 0 9 6-1 0-9m-8-17q-5 7 0 8 5-1 0-8" fill="#8cbbb8" stroke="#537e7b" strokeWidth="1"/></>}</g><HumanArm hazmat={hazmat}/></g></g>;
}
function HorseLeg({ front = false, far = false }: { front?: boolean; far?: boolean }) {
  return <g transform={`translate(${front ? 217 : 55} 149)`}><g className={`horse-upper ${front ? 'foreleg' : 'hindleg'} ${far ? 'far-leg' : ''}`}><path d={front ? 'M-11-10 12-5 7 52-5 54-11 16Z' : 'M-17-8 15-9 15 15 5 49-7 51-18 22Z'} fill={far ? '#68503a' : '#8e6846'} stroke="#483c2c" strokeWidth="2"/><g transform="translate(0 51)"><g className={`horse-lower ${front ? 'foreleg' : 'hindleg'} ${far ? 'far-leg' : ''}`}><path d="M-6-5 7-5 5 47-4 49-7 34Z" fill={far ? '#6a513b' : '#a27a53'} stroke="#483c2c" strokeWidth="1.8"/><path d="m-6 44 13-1 7 12-20 2-3-4Z" fill="#2b2e27"/></g></g></g></g>;
}
export function MountedPutin() {
  return <g className="horse-and-rider"><ellipse className="horse-shadow" cx="145" cy="259" rx="128" ry="8" fill="#363a28" opacity=".16"/><g className="horse-suspension"><HorseLeg far/><HorseLeg front far/><path className="rider-occluded-far-leg" d="M140 96q22 0 29 26l-12 41 13 13 9 7h-31l-8-11 8-38-19-22Z" fill="#303a2d" stroke="#263024" strokeWidth="2"/><path className="horse-tail" d="M38 116C-6 94-14 123-35 116c13 20 34 24 53 7L42 144Z" fill="#45382a"/><path d="M38 108C80 77 180 82 223 105l10 46c-34 33-117 40-176 13-28-13-40-37-19-56Z" fill="#9f7750" stroke="#4a3f2d" strokeWidth="3"/><path d="M52 116q81-34 152-7m-144 43q70 28 138 6" fill="none" stroke="#b99064" strokeWidth="7" opacity=".6"/><g className="mounted-upper"><g className="horse-neck"><path d="M194 124c19-39 13-74 49-96l41 5-5 36-22 13-26 65Z" fill="#9f7750" stroke="#4a3f2d" strokeWidth="3"/><path d="M211 107c-4-41 1-64 30-82l10 8c-21 18-20 32-24 47Z" fill="#483a28"/><path d="M244 28 251 1 260 26m8 0L282 4l-1 29" fill="#94704b" stroke="#4a3f2d" strokeWidth="2"/><path d="M251 27c18-8 40 8 41 23l35 23-5 24-31 2-18-19-29-15Z" fill="#b38a60" stroke="#4a3f2d" strokeWidth="3"/><path d="m291 70 35 4-4 23-28-2" fill="#d2ac7d"/><path d="m302 84 9 1" stroke="#4a4030" strokeWidth="4"/><circle cx="277" cy="46" r="4" fill="#292f25"/><path d="m268 38 15 1" stroke="#624c33" strokeWidth="3"/><path d="M251 29 256 67 291 88m-2-22 2 22 35-8" fill="none" stroke="#453a2b" strokeWidth="4"/></g><path d="M96 92q48-20 88 0l-2 18-92 3Z" fill="#4c4132"/><path d="M105 106v50" stroke="#5c4730" strokeWidth="6"/><g className="rider">
      <path className="rider-far-arm" d="M157 27c17-6 23 8 24 23l13 6 1 13-25-5c-9-2-14-13-17-23Z" fill="#cc9974" stroke="#785238" strokeWidth="2"/>
      <path className="rider-muscular-torso" d="M127 20c-7 4-13-2-21 3-14 6-18 22-11 34l16 7 9 20 2 12 38 1 3-16 7-22c11-3 14-13 10-23-5-12-16-15-28-12l-8-4Z" fill="#dfad85" stroke="#765037" strokeWidth="2.3"/>
      <path d="M114 31c-12 1-17 12-12 19 8 8 22 9 32 2l-2-17-18-4m24 4 2 17c11 8 24 3 28-5 4-9-4-15-13-16Z" fill="#ebbb94"/>
      <path d="M109 52q12 9 27 1m5 1q14 5 24-5m-29-19 2 29m-18 4 14 1m8 0 13-1m-32 11 12 1m8 0 10-1m-28 11 10 1m8 0 8-1m-15-22 1 25" fill="none" stroke="#b77d58" strokeWidth="2" strokeLinecap="round"/>
      <path className="rider-near-arm" d="M108 29c-12-3-20 9-17 22 1 9 10 17 21 21l26 1 1-12-24-5c4-10 5-23-6-27Z" fill="#e1ac82" stroke="#765037" strokeWidth="2.2"/>
      <path d="M99 35q11 4 9 16m-10 5 11 6m8 2 17 3" fill="none" stroke="#bd825a" strokeWidth="2" strokeLinecap="round"/>
      <path className="rider-seated-pelvis" d="M119 87q21 8 43 1l9 17-22 15-30-8c-8-8-10-17 0-25Z" fill="#3e4a3b" stroke="#28372c" strokeWidth="2.5"/>
      <path className="rider-near-thigh" d="M137 98c10-1 18 3 27 9l23 17c5 5 3 12-3 16-6 4-12 2-18-3l-32-24Z" fill="#465440" stroke="#29392c" strokeWidth="2.5"/>
      <path className="rider-near-calf" d="M170 132c7-4 16-1 17 5l-12 37-15-2 7-31Z" fill="#465440" stroke="#29392c" strokeWidth="2.3"/>
      <path className="rider-near-boot" d="m161 158 19 3-7 16 18 5c6 2 10 5 10 9h-40l-5-7Z" fill="#30382d" stroke="#222c22" strokeWidth="2"/>
      <path d="M161 190h40m-22-65-9 10m-37-32 14 9" fill="none" stroke="#6b7354" strokeWidth="2"/>
      <path d="M177 126 166 176q-6 15 8 16h17" fill="none" stroke="#9b8457" strokeWidth="2"/>
      <path className="rider-reins" d="M146 66Q219 104 291 88M201 65Q247 94 291 88" fill="none" stroke="#4b402d" strokeWidth="2.4" strokeLinecap="round"/>
      <g className="rider-rein-hands" stroke="#765037" strokeWidth="1.7" strokeLinejoin="round">
       <g className="rider-far-hand" transform="translate(191 57)">
        <path d="M0 1 7-1q5-1 7 3l3 5-2 8-14-1-3-5Z" fill="#cc9974"/>
        <path d="m5 2 1 7m4-7 1 8m-9 2 10 1M0 3l7 3q4 1 3 4L1 8" fill="none" stroke="#9c6a4b" strokeWidth="1.2" strokeLinecap="round"/>
       </g>
       <g className="rider-near-hand" transform="translate(136 58)">
        <path d="M0 3 9-2q5-1 8 3l3 6-2 9-15 1-5-6Z" fill="#e5b68f"/>
        <path d="m8 1 2 7m3-6 2 7m-10 3 11 1M0 5l8-2 5 4q2 3-1 5L6 9 1 10" fill="none" stroke="#aa7652" strokeWidth="1.3" strokeLinecap="round"/>
       </g>
      </g>
      <g transform="translate(111 -38) scale(.52)"><PutinHead/></g>
    </g></g><HorseLeg/><HorseLeg front/></g></g>;
}
export function ChaseArtwork() {
  return <svg xmlns="http://www.w3.org/2000/svg" className="chase-artwork" viewBox="0 0 1100 365" role="img" aria-label="Political satire: a recognizable caricature of shirtless Vladimir Putin rides a galloping horse while two fictional hazmat workers and a pale, sweaty fleeing person in a lab coat run with articulated arms and legs."><defs><pattern id="ground-dashes" width="95" height="30" patternUnits="userSpaceOnUse"><path d="M4 14h28m21 7h13" stroke="#a89c73" strokeWidth="2"/></pattern></defs><rect width="1100" height="365" fill="#e6d9b7"/><circle cx="657" cy="110" r="97" fill="#b63c29" opacity=".78"/><g className="distant-skyline" fill="#7a825e" opacity=".22"><path d="M0 237V145h60v-18h40v110h30v-78h57v-34h40v112h70v-54h35v-76h44v130h32v-62h62v62h70v-92h54v92h34v-132h45v132h32v-52h67v52h57v-105h48v105h35v-66h67v66h32v-98h73v98h93V365H0Z"/></g><KremlinSkyline x={100} y={120} scale={.85} opacity={.32}/><KremlinSkyline x={720} y={171} scale={.55} opacity={.22}/><g className="scene-clouds" fill="#f7eed7" opacity=".35"><ellipse cx="220" cy="53" rx="140" ry="13"/><ellipse cx="890" cy="31" rx="180" ry="10"/></g><path d="M0 314H1100" stroke="#656a47" strokeWidth="3"/><rect className="moving-ground" y="320" width="1200" height="45" fill="url(#ground-dashes)"/><g transform="translate(30 89)"><RunningHuman hazmat/></g><g transform="translate(205 89)"><RunningHuman hazmat variant="second-runner"/></g><g transform="translate(390 56)"><MountedPutin/></g><g transform="translate(855 89)"><RunningHuman variant="escaping-runner"/></g><g className="chase-dust" fill="#a58d64" opacity=".35"><ellipse cx="140" cy="310" rx="35" ry="7"/><ellipse cx="310" cy="315" rx="39" ry="8"/><ellipse cx="478" cy="308" rx="50" ry="8"/><ellipse cx="910" cy="311" rx="29" ry="6"/></g><text x="545" y="348" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#655b40">PUTIN (CARICATURE) · FICTIONAL HAZMAT CREW</text></svg>;
}
export function FictionalChase({ scene, opening = false }: { scene: FictionalSceneId | null; opening?: boolean }) {
  const [paused, setPaused] = useState(false);
  if (!scene) return null;
  const story = FICTIONAL_SCENES[scene];
  return <section id="bureau-scene" className="bureau-scene" aria-labelledby="scene-title" data-scene-motion={paused ? 'off' : 'on'}><div className="scene-heading"><div><span className="eyebrow">{opening ? "Fictional Bureau dialogue · satire" : "Bureau verdict (parody)"}</span><h2 id="scene-title">{opening ? "There is no plague in Russia. Everything is under control." : story.label}</h2></div>{story.chase && <button className="scene-pause" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Resume chase' : 'Pause chase'}</button>}</div>{story.chase ? <div className="chase-stage"><ChaseArtwork/></div> : <div className="googling-scene" role="img" aria-label="A fictional horse is taking its lunch break. This joke is unrelated to care guidance."><div className="search-joke">horse.exe is taking a lunch break <span>×</span></div><div className="grass" aria-hidden="true">❧ ❧ ❧</div><p>Please do not feed the bureaucracy.</p></div>}<p className="scene-caption">{opening ? 'Please step away from the window. The horse needs parking.' : story.chase ? 'Your results are in. Please step away from the window.' : story.caption}</p></section>;
}

"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { AlertTriangle, ArrowLeft, ClipboardList, HeartPulse, ShieldCheck } from "lucide-react";

const urgentSigns = ["Trouble breathing, severe chest pain, or blue/grey lips","Fainting, a new seizure, confusion, or sudden weakness on one side","Severe bleeding, a serious injury, or thoughts of harming yourself or someone else"];
const practitioners = [
  {name:"Dr Emil Mgwami",role:"Medical Doctor (MD)",phone:"+255623555127"},
  {name:"Richard Kinyaha",role:"Dentist",phone:"+255620607399"},
  {name:"Moses Masika",role:"Medical Laboratory Professional",phone:"+255734717630"},
  {name:"Mussa Kihayile",role:"Registered Nurse (RN)",phone:"+255778652916"},
  {name:"Sudi Zaidi",role:"Dentist (DDS)",phone:"+255679279037"},
  {name:"Rashid",role:"Medical Doctor (MD)",phone:"+255622269916"},
];

export default function ClinicalAssistantPage() {
  const [name,setName]=useState(""); const [age,setAge]=useState(""); const [location,setLocation]=useState("");
  const [symptoms,setSymptoms]=useState(""); const [duration,setDuration]=useState(""); const [concerns,setConcerns]=useState("");
  const [showSummary,setShowSummary]=useState(false); const [guidance,setGuidance]=useState(""); const [followUp,setFollowUp]=useState(""); const [conversation,setConversation]=useState<string[]>([]); const [error,setError]=useState(""); const [isLoading,setIsLoading]=useState(false);
  function createSummary(event: FormEvent<HTMLFormElement>){event.preventDefault();setShowSummary(true);setGuidance("");setError("");}
  async function getGuidance(message = ""){
    setIsLoading(true);setError("");
    try{
      const conversationContext=[guidance ? "AI initial guidance: "+guidance : "",...conversation.slice(-6)].filter(Boolean).join("\n");
      const response=await fetch("/api/clinical-assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({age,location,symptoms,duration,concerns:message ? concerns+"\n\nConversation so far:\n"+conversationContext+"\n\nPatient follow-up question: "+message : concerns})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error||"THE AI SERVICE COULD NOT RESPOND RIGHT NOW.");
      const answer=data.guidance||"NO GUIDANCE WAS RETURNED. PLEASE SPEAK WITH A QUALIFIED CLINICIAN.";
      if(message){setConversation(items=>[...items,"You: "+message,"AI: "+answer]);setFollowUp("");}else{setGuidance(answer);setConversation([]);}
    }catch(e){setError(e instanceof Error?e.message:"SOMETHING WENT WRONG. PLEASE TRY AGAIN LATER.");}finally{setIsLoading(false);}
  }
  const input="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100";
  function formatGuidance(text:string){return text.replace(/\*/g,"").split("\n").filter(Boolean).map((line,index)=>{const important=/^(IMPORTANT|NEXT STEP|URGENT HELP):/i.test(line.trim());return <p key={index} className={important?"font-extrabold underline decoration-2 decoration-cyan-500 underline-offset-4":"font-medium"}>{line}</p>;});}
  return <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6"><div className="mx-auto max-w-4xl">
    <Link href="/" className="inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-cyan-700"><ArrowLeft className="h-4 w-4"/>BACK TO JUSTCOSTA</Link>
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-10">
      <div className="flex gap-5"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><HeartPulse className="h-7 w-7"/></div><div><p className="font-bold uppercase tracking-[.18em] text-cyan-700">PATIENT HEALTH VISIT HELPER</p><h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Prepare for your healthcare visit.</h1><p className="mt-3 text-slate-600">Organise your particulars, symptoms and questions before speaking with a qualified healthcare professional.</p></div></div>
      <div className="mt-8 rounded-2xl border-2 border-red-300 bg-red-50 p-5"><div className="flex gap-3"><AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-red-700"/><div><h2 className="font-extrabold uppercase text-red-900">GET URGENT HELP NOW IF YOU HAVE:</h2><ul className="mt-3 space-y-2 font-semibold text-red-900">{urgentSigns.map(x=><li key={x}>• {x}</li>)}</ul><p className="mt-3 font-extrabold text-red-900">GO TO THE NEAREST EMERGENCY DEPARTMENT OR CONTACT YOUR LOCAL EMERGENCY SERVICE.</p></div></div></div>
      <form onSubmit={createSummary} className="mt-8 space-y-5"><div><h2 className="text-xl font-extrabold uppercase">Patient particulars</h2><p className="mt-1 font-semibold text-slate-600">YOUR NAME STAYS ON THIS PAGE AND IS NOT SENT TO THE AI.</p></div>
        <div className="grid gap-5 sm:grid-cols-2"><label className="font-bold">PATIENT NAME<input value={name} onChange={e=>setName(e.target.value)} placeholder="Optional" className={input}/></label><label className="font-bold">AGE<input value={age} onChange={e=>setAge(e.target.value)} type="number" min="0" max="130" required className={input}/></label></div>
        <label className="font-bold">LOCATION<input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Region, district, or ward (optional)" className={input}/></label>
        <div className="border-t border-slate-200 pt-5"><h2 className="text-xl font-extrabold uppercase">Your visit notes</h2><p className="font-semibold text-slate-600">YOUR NOTES ARE NOT STORED BY THIS WEBSITE.</p></div>
        <label className="font-bold">WHAT SYMPTOMS OR CONCERNS WOULD YOU LIKE TO DISCUSS?<textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)} required rows={4} className={input}/></label>
        <label className="font-bold">WHEN DID THIS BEGIN, AND HAS IT CHANGED?<textarea value={duration} onChange={e=>setDuration(e.target.value)} required rows={3} className={input}/></label>
        <label className="font-bold">WHAT QUESTIONS OR WORRIES DO YOU HAVE?<textarea value={concerns} onChange={e=>setConcerns(e.target.value)} rows={3} className={input}/></label>
        <button className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-5 py-3 font-extrabold text-white hover:bg-cyan-800"><ClipboardList className="h-5 w-5"/>CREATE MY VISIT SUMMARY</button>
      </form>
      {showSummary&&<section className="mt-8 rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-6"><h2 className="text-xl font-extrabold uppercase text-cyan-950">Your visit summary</h2><div className="mt-4 space-y-3">{name&&<p><b>PATIENT NAME:</b> {name}</p>}<p><b>AGE:</b> {age}</p>{location&&<p><b>LOCATION:</b> {location}</p>}<p><b>SYMPTOMS:</b> {symptoms}</p><p><b>WHEN IT BEGAN OR CHANGED:</b> {duration}</p>{concerns&&<p><b>QUESTIONS OR WORRIES:</b> {concerns}</p>}</div><div className="mt-5 flex gap-3 rounded-xl bg-white p-4 font-semibold text-slate-700"><ShieldCheck className="h-5 w-5 shrink-0 text-cyan-700"/><p>IMPORTANT: IF YOU CHOOSE AI GUIDANCE, ONLY YOUR AGE, BROAD LOCATION, SYMPTOMS, TIMING AND CONCERNS ARE SENT TO THE AI SERVICE. YOUR NAME IS NOT SENT.</p></div><button type="button" onClick={()=>getGuidance()} disabled={isLoading} className="mt-5 rounded-xl bg-cyan-700 px-5 py-3 font-extrabold text-white disabled:opacity-60">{isLoading?"GETTING AI GUIDANCE...":"GET AI GUIDANCE"}</button>{error&&<p className="mt-4 font-extrabold text-red-700">{error}</p>}{guidance&&<div className="mt-5 space-y-3 rounded-xl border border-slate-300 bg-white p-5 leading-7">{formatGuidance(guidance)}</div>}</section>}
      {showSummary && <section className="mt-6 rounded-2xl border border-cyan-200 bg-white p-5"><h2 className="font-bold text-cyan-900">CONTINUE THE CONVERSATION</h2><p className="mt-1 text-sm text-slate-600">{guidance ? "Ask a follow-up question. Your name is not sent to the AI." : "FIRST, SELECT GET AI GUIDANCE ABOVE. THEN YOU CAN ASK FOLLOW-UP QUESTIONS HERE."}</p>{guidance && <div className="mt-4 space-y-3">{conversation.map((message,index)=><p key={index} className={message.startsWith("AI:") ? "rounded-lg bg-cyan-50 p-3" : "rounded-lg bg-slate-100 p-3 font-medium"}>{message}</p>)}</div>}<textarea value={followUp} onChange={e=>setFollowUp(e.target.value)} placeholder={guidance ? "Ask another question or add more information" : "Get AI guidance first"} disabled={!guidance} rows={3} className={input}/><div className="mt-3 flex gap-3"><button type="button" disabled={!guidance||!followUp.trim()||isLoading} onClick={()=>getGuidance(followUp.trim())} className="rounded-xl bg-cyan-700 px-4 py-2 font-bold text-white disabled:opacity-50">{isLoading?"SENDING...":"SEND"}</button><button type="button" onClick={()=>{setConversation([]);setFollowUp("");setGuidance("");setShowSummary(false);}} className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700">START NEW CONVERSATION</button></div></section>}
      <section className="mt-8 rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-6"><h2 className="text-xl font-extrabold uppercase text-cyan-950">Speak to a medical practitioner</h2><p className="mt-2 text-slate-700">You may choose a practitioner below and call directly if they are available.</p><p className="mt-2 font-bold text-red-800">FOR URGENT OR LIFE-THREATENING SYMPTOMS, GO TO THE NEAREST EMERGENCY DEPARTMENT OR CONTACT LOCAL EMERGENCY SERVICES. THIS IS NOT AN EMERGENCY CALL SERVICE.</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{practitioners.map(practitioner=><article key={practitioner.phone} className="rounded-xl border border-cyan-200 bg-white p-4"><h3 className="font-extrabold text-slate-950">{practitioner.name}</h3><p className="mt-1 font-semibold text-cyan-800">{practitioner.role}</p><p className="mt-3 text-slate-700">{practitioner.phone}</p><a href={"tel:"+practitioner.phone} className="mt-3 inline-flex rounded-lg bg-cyan-700 px-4 py-2 font-extrabold text-white hover:bg-cyan-800">CALL PRACTITIONER</a></article>)}</div></section>
      <div className="mt-8 flex gap-3 rounded-2xl border-2 border-slate-300 bg-slate-100 p-5 font-semibold text-slate-800"><ShieldCheck className="h-5 w-5 shrink-0 text-cyan-700"/><p><b>IMPORTANT:</b> THIS TOOL SUPPORTS PREPARATION FOR A HEALTHCARE VISIT. IT IS <b>NOT</b> A DIAGNOSIS, TREATMENT PLAN, PRESCRIPTION OR EMERGENCY SERVICE.</p></div>
    </section></div></main>;
}

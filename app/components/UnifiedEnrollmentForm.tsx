"use client";

import { useState, type FormEvent } from "react";

type Mode = "INDIVIDUAL" | "NEW_HOUSEHOLD" | "FAMILY_ADDITION";
type Member = {fullName:string;relationship:string;dateOfBirth:string;payment:string};
const emptyMember = ():Member => ({fullName:"",relationship:"SON",dateOfBirth:"",payment:""});
const modes:{value:Mode; title:string;description:string}[] = [
 {value:"INDIVIDUAL",title:"Individual membership",description:"Apply for yourself"},
 {value:"NEW_HOUSEHOLD",title:"New household",description:"Register a new family household"},
 {value:"FAMILY_ADDITION",title:"Add family members",description:"Request additions to an existing household"},
];
const relationships = ["WIFE","HUSBAND","FATHER","MOTHER","SON","DAUGHTER","OTHER"];
export function UnifiedEnrollmentForm({source="SELF_SERVICE"}:{source?:"SELF_SERVICE"|"STAFF_ASSISTED"}){
 const [mode,setMode]=useState<Mode>("INDIVIDUAL");
 const [family,setFamily]=useState<Member[]>([emptyMember()]);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [reference,setReference]=useState("");
 const [errors,setErrors]=useState<string[]>([]);
 const [step,setStep]=useState(0);
 const updateMember=(index:number,patch:Partial<Member>)=>setFamily(old=>old.map((m,i)=>i===index?{...m,...patch}:m));
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  const f=new FormData(e.currentTarget);
  const payload={...Object.fromEntries(f.entries()),applicationType:mode,applicantAttested:f.get("applicantAttested")==="on",source,familyMembers:mode==="INDIVIDUAL"?[]:family.filter(m=>m.fullName.trim()).map(m=>({fullName:m.fullName.trim(),relationship:m.relationship,dateOfBirth:m.dateOfBirth,proposedPaymentCents:m.payment===""?null:Math.round(Number(m.payment)*100)}))};
  setErrors([]);setMessage("");setBusy(true);
  try{
   const res=await fetch("/api/applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),credentials:"same-origin"});
   const body=await res.json();
   if(!res.ok){setErrors((body.issues??[]).map((i:{path:(string|number)[];message:string})=>`${i.path.join(".")}: ${i.message}`));throw Error(body.error||"Unable to submit application");}
   setReference(body.reference);setMessage("Application received. Save the reference below. Approval is required before membership becomes active.");
  }catch(err){setMessage(err instanceof Error?err.message:"Submission failed");}finally{setBusy(false);}
 }
 const field=(name:string,label:string,required=false,type="text")=><div><label htmlFor={name} className="label">{label}</label><input id={name} name={name} type={type} required={required} disabled={busy||!!reference} /></div>;
 return <div className="max-w-4xl mx-auto space-y-5">
  <div><p className="text-sm font-semibold text-blue-700">GMS · Membership services</p><h1 className="text-3xl font-bold mt-1">Membership & household enrollment</h1><p className="muted mt-2">Submit a membership request or add family members. All applications require Central Administration approval. GV references are not automatically verified or assigned.</p></div>
  {reference?<section className="card space-y-4" role="status"><h2 className="text-2xl font-bold">Application submitted</h2><p>{message}</p><div className="rounded-lg bg-blue-50 p-4"><p className="text-xs font-bold uppercase tracking-wide">Your application reference</p><p className="text-2xl font-bold break-all">{reference}</p></div><button className="btn-outline" onClick={()=>{setReference("");setMessage("");setStep(0);setFamily([emptyMember()]);}}>Start another application</button></section>:<form onSubmit={submit} className="card space-y-6">
   <div className="flex gap-2 text-sm"><span className="font-semibold">Application</span><span className="muted">→</span><span className="font-semibold">Review & submit</span></div>
   <div className={step===0?"space-y-6":"hidden"}>
    <section><h2 className="text-xl font-bold mb-3">Application type</h2><div className="grid md:grid-cols-3 gap-3">{modes.map(m=><label key={m.value} className={`rounded-xl border p-4 cursor-pointer ${mode===m.value?"border-blue-600 bg-blue-50":"border-slate-200"}`}><input type="radio" checked={mode===m.value} onChange={()=>setMode(m.value)} className="!w-auto mr-2"/><span className="font-semibold">{m.title}</span><p className="muted text-xs mt-2">{m.description}</p></label>)}</div></section>
    <section className="space-y-4"><h2 className="text-xl font-bold">Applicant / Head of Household</h2><div className="grid md:grid-cols-2 gap-4">{field("firstName","First / given name",true)}{field("lastName","Last / family name",true)}{field("email","Email address",false,"email")}{field("phone","Contact number",false,"tel")}</div></section>
    <section className="space-y-4"><h2 className="text-xl font-bold">Household details</h2><div className="grid md:grid-cols-2 gap-4">{field("address","Mailing address")}{field("householdLabel","Household / HOH full name")}{field("claimedGV","Existing GV number (if known)")}{field("claimedHOHGV","Existing HOH GV number (if known)")}</div><p className="muted text-xs">For family additions, provide the HOH GV or household reference. These are claims for verification—not automatic GV assignments.</p></section>
    {mode!=="INDIVIDUAL"&&<section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Family members</h2><button type="button" className="btn-outline" disabled={family.length>=30} onClick={()=>setFamily(old=>[...old,emptyMember()])}>+ Add family member</button></div><p className="muted text-xs">Use fictional details while testing. Payment entries are proposed amounts only and are not recorded as received payments.</p>{family.map((m,i)=><div key={i} className="rounded-xl border border-slate-200 p-4 space-y-3"><div className="flex justify-between"><h3 className="font-semibold">Family member {i+1}</h3><button type="button" className="text-sm text-red-700" disabled={family.length===1} onClick={()=>setFamily(old=>old.filter((_,j)=>j!==i))}>Remove</button></div><div className="grid md:grid-cols-2 gap-4"><div><label className="label">Full name</label><input value={m.fullName} onChange={e=>updateMember(i,{fullName:e.target.value})} required={mode==="FAMILY_ADDITION"&&i===0}/></div><div><label className="label">Relationship to HOH</label><select value={m.relationship} onChange={e=>updateMember(i,{relationship:e.target.value})}>{relationships.map(r=><option key={r} value={r}>{r.charAt(0)+r.slice(1).toLowerCase()}</option>)}</select></div><div><label className="label">Date of birth</label><input type="date" value={m.dateOfBirth} onChange={e=>updateMember(i,{dateOfBirth:e.target.value})}/></div><div><label className="label">Proposed payment (USD, optional)</label><input type="number" min="0" step="0.01" value={m.payment} onChange={e=>updateMember(i,{payment:e.target.value})}/></div></div></div>)}</section>}
    <button type="button" className="btn w-full" onClick={()=>setStep(1)}>Review application →</button>
   </div>{step===1&&<><h2 className="text-xl font-bold">Review and consent</h2><p>Application type: <strong>{modes.find(m=>m.value===mode)?.title}</strong></p><p className="muted text-sm">Use Back to check details. Submission does not activate membership or issue a GV number.</p><label className="flex items-start gap-3 text-sm"><input type="checkbox" name="applicantAttested" className="!w-auto mt-1" required/><span>I confirm the information is accurate and authorize Genvai Management System administrators to review it for membership administration.</span></label><div className="flex gap-3"><button type="button" className="btn-outline" onClick={()=>setStep(0)}>← Back</button><button disabled={busy} className="btn flex-1">{busy?"Submitting...":"Submit application"}</button></div></>}
   {message&&<p role="alert" className="p-3 rounded-lg bg-red-50 text-red-800">{message}</p>}{errors.length>0&&<ul className="text-sm text-red-700 list-disc pl-5">{errors.slice(0,6).map((e,i)=><li key={i}>{e}</li>)}</ul>}
  </form>}
 </div>;
}


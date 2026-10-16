import {describe,it,expect} from "vitest";
import {applicationSchema,decisionSchema} from "../lib/validation";
import {evaluateDecision,statusForAction} from "../lib/approval";
describe("application validation",()=>{it("requires attestation",()=>{expect(applicationSchema.safeParse({firstName:"Test",lastName:"Person",applicantAttested:false}).success).toBe(false)});it("accepts application with unknown GV policy",()=>{expect(applicationSchema.safeParse({firstName:"Test",lastName:"Person",applicantAttested:true,claimedGV:"000591"}).success).toBe(true)});it("rejects blank names",()=>{expect(applicationSchema.safeParse({firstName:"",lastName:"Person",applicantAttested:true}).success).toBe(false)})});
describe("approvals",()=>{it("requires independent review",()=>{expect(evaluateDecision({role:"NATIONAL_ADMIN",action:"APPROVE",actorId:"a",submittedById:"a",status:"UNDER_REVIEW"})).toBe("Independent reviewer required")});it("blocks chapter officer approval",()=>{expect(evaluateDecision({role:"CHAPTER_ADMIN",action:"APPROVE",actorId:"a",submittedById:null,status:"UNDER_REVIEW"})).toBe("Approval permission required")});it("disallows direct submitted-to-approved",()=>{expect(evaluateDecision({role:"NATIONAL_ADMIN",action:"APPROVE",actorId:"a",submittedById:null,status:"SUBMITTED"})).toBe("Must be under review before approval")});it("maps review status",()=>expect(statusForAction("REVIEW")).toBe("UNDER_REVIEW"));it("rejects unknown actions",()=>expect(decisionSchema.safeParse({action:"DELETE"}).success).toBe(false))});

describe("unified enrollment",()=>{
 it("accepts household registration with family entries",()=>{
  expect(applicationSchema.safeParse({firstName:"Example",lastName:"Applicant",applicationType:"NEW_HOUSEHOLD",applicantAttested:true,familyMembers:[{fullName:"Example Child",relationship:"DAUGHTER",dateOfBirth:"2020-01-01",proposedPaymentCents:600}]}).success).toBe(true);
 });
 it("requires household reference for family addition",()=>{
  expect(applicationSchema.safeParse({firstName:"Example",lastName:"Applicant",applicationType:"FAMILY_ADDITION",applicantAttested:true,familyMembers:[{fullName:"Example Child",relationship:"SON"}]}).success).toBe(false);
 });
 it("rejects negative proposed payment",()=>{
  expect(applicationSchema.safeParse({firstName:"Example",lastName:"Applicant",applicationType:"NEW_HOUSEHOLD",applicantAttested:true,familyMembers:[{fullName:"Example Child",relationship:"SON",proposedPaymentCents:-1}]}).success).toBe(false);
 });
});

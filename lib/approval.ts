import { Prisma, type Role } from "@prisma/client";
import { canApprove, canReview } from "@/lib/auth";
export function evaluateDecision({role,action,actorId,submittedById,status}:{role:Role;action:string;actorId:string;submittedById:string|null;status:string}) {
 if(!canReview(role))return "Permission denied";
 if((action==="APPROVE"||action==="REJECT")&&!canApprove(role))return "Approval permission required";
 if(submittedById===actorId && (action==="APPROVE"||action==="REJECT"))return "Independent reviewer required";
 if(status==="APPROVED"||status==="REJECTED")return "Application already finalized";
 if(action==="APPROVE" && status!=="UNDER_REVIEW")return "Must be under review before approval";
 return null;
}
export function statusForAction(action:string){return {REVIEW:"UNDER_REVIEW",CORRECTION:"NEEDS_CORRECTION",APPROVE:"APPROVED",REJECT:"REJECTED"}[action] as "UNDER_REVIEW"|"NEEDS_CORRECTION"|"APPROVED"|"REJECTED"|undefined;}

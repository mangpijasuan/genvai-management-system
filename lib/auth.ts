import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";
const secret = () => { const v=process.env.SESSION_SECRET; if(!v || v.length<32) throw Error("SESSION_SECRET must be at least 32 characters"); return new TextEncoder().encode(v); };
export async function setSession(userId:string){const token=await new SignJWT({sub:userId}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("8h").sign(secret());(await cookies()).set("gms_session",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:28800});}
export async function currentUser(){try{const token=(await cookies()).get("gms_session")?.value;if(!token)return null;const {payload}=await jwtVerify(token,secret());if(typeof payload.sub!=="string")return null;return await prisma.user.findUnique({where:{id:payload.sub}});}catch{return null;}}
export const adminRoles:Role[]=["SUPER_ADMIN","NATIONAL_ADMIN","MEMBERSHIP_OFFICER","CHAPTER_ADMIN"];
export const approvalRoles:Role[]=["SUPER_ADMIN","NATIONAL_ADMIN","MEMBERSHIP_OFFICER"];
export function canReview(role:Role){return adminRoles.includes(role);}
export function canApprove(role:Role){return approvalRoles.includes(role);}

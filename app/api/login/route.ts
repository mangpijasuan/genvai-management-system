import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {setSession} from "@/lib/auth";
import {compare} from "bcryptjs";
export async function POST(req:Request){const b=await req.json().catch(()=>({}));if(typeof b.email!=="string"||typeof b.password!=="string")return NextResponse.json({error:"Invalid credentials"},{status:400});const u=await prisma.user.findUnique({where:{email:b.email.toLowerCase()}});if(!u||!(await compare(b.password,u.passwordHash)))return NextResponse.json({error:"Invalid credentials"},{status:401});await setSession(u.id);return NextResponse.json({ok:true});}

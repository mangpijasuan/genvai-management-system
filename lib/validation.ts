import { z } from "zod";
export const applicationSchema = z.object({
 firstName:z.string().trim().min(1).max(100), lastName:z.string().trim().min(1).max(100),
 email:z.union([z.email(),z.literal("")]).optional(),phone:z.string().trim().max(35).optional(),
 address:z.string().trim().max(300).optional(),chapterId:z.string().uuid().optional().or(z.literal("")),
 householdLabel:z.string().trim().max(120).optional(),claimedGV:z.string().trim().max(40).optional(),
 claimedHOHGV:z.string().trim().max(40).optional(),applicantAttested:z.literal(true),
 source:z.enum(["SELF_SERVICE","STAFF_ASSISTED"]).default("SELF_SERVICE")
});
export const decisionSchema=z.object({action:z.enum(["REVIEW","CORRECTION","APPROVE","REJECT"]),note:z.string().trim().max(1000).optional()});

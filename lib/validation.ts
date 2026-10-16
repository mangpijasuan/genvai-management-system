import { z } from "zod";
export const familyMemberSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  relationship: z.enum(["WIFE", "HUSBAND", "FATHER", "MOTHER", "SON", "DAUGHTER", "OTHER"]),
  dateOfBirth: z.union([z.iso.date(), z.literal("")]).optional(),
  proposedPaymentCents: z.number().int().min(0).max(100000000).nullable().optional(),
});
export const applicationSchema = z.object({
  applicationType: z.enum(["INDIVIDUAL", "NEW_HOUSEHOLD", "FAMILY_ADDITION"]).default("INDIVIDUAL"),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.union([z.email(), z.literal("")]).optional(),
  phone: z.string().trim().max(35).optional(),
  address: z.string().trim().max(300).optional(),
  chapterId: z.string().uuid().optional().or(z.literal("")),
  householdLabel: z.string().trim().max(120).optional(),
  claimedGV: z.string().trim().max(40).optional(),
  claimedHOHGV: z.string().trim().max(40).optional(),
  familyMembers: z.array(familyMemberSchema).max(30).default([]),
  applicantAttested: z.literal(true),
  source: z.enum(["SELF_SERVICE", "STAFF_ASSISTED"]).default("SELF_SERVICE"),
}).superRefine((data,ctx) => {
  if (data.applicationType === "FAMILY_ADDITION") {
    if (!data.claimedHOHGV && !data.householdLabel) ctx.addIssue({code:"custom",path:["claimedHOHGV"],message:"HOH GV number or household reference is required for family additions"});
    if (data.familyMembers.length===0) ctx.addIssue({code:"custom",path:["familyMembers"],message:"Add at least one family member"});
  }
});
export const decisionSchema = z.object({action:z.enum(["REVIEW","CORRECTION","APPROVE","REJECT"]),note:z.string().trim().max(1000).optional()});

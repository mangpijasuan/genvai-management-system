import { redirect } from "next/navigation";
import { currentUser, canReview } from "@/lib/auth";
import { UnifiedEnrollmentForm } from "@/app/components/UnifiedEnrollmentForm";

export default async function StaffAssistedEnrollment() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (!canReview(user.role)) return <p>Access denied.</p>;
  return <div className="space-y-4">
    <div className="card"><h2 className="font-bold">Staff-assisted enrollment</h2><p className="muted text-sm">Enter only information authorized by the applicant. Central approval is required.</p></div>
    <UnifiedEnrollmentForm source="STAFF_ASSISTED" />
  </div>;
}

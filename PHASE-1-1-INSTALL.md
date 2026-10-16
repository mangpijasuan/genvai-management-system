# GMS Phase 1.1 — Unified Intake Patch

This patch overlays the existing GMS project; it is **not** a standalone project or replacement database. It was made against the Phase 1 source archive; preserve any later changes by reviewing the diffs first.

## Included
- Shared unified enrollment form for `/apply` (self-service) and `/admin/new` (staff-assisted) with individual, new household, and family-addition modes
- Family-member rows (name, HOH relationship, DOB, proposed payment)
- Submission bug fix: no form reset after an asynchronous event; validated attestation stored correctly
- API validation and persistence of *pending family applicants* (not active Member rows)
- Admin review displays pending family applicants
- Household/family approval deliberately blocked until identity and GV relationship verification is built
- Visible frontend ZIA references replaced with GMS
- Additive Prisma migration for Application.applicationType and FamilyAdditionApplicant

## Install on Mac

1. Back up the project and ensure migration history is already consistent. Save `.env` privately; **never upload it**.
2. From the repository root:

   ```bash
   cd ~/Projects/genvai-management-system
   git status
   git switch -c feature/unified-membership-form
   unzip -o ~/Downloads/GMS-Phase-1-1-Unified-Form-Patch.zip -d .
   git diff --stat
   git diff
   ```

3. **Review** `prisma/schema.prisma` before migrating. This patch was developed against the original Phase 1 schema. If you have made newer schema changes, merge them instead of overwriting them.
4. Preserve both of your earlier restored migration folders `20261014130000_initial` and `20261014182000_application_access`. They are NOT included in this patch.
5. Run:

   ```bash
   npx prisma validate
   npx prisma migrate status
   npx prisma migrate dev
   npx prisma generate
   npm run lint
   npm test
   npm run dev
   ```

6. Only after these succeed, test with fictional data at `http://localhost:3100/apply` (or the port your server displays). Then review at `/admin`.

## Boundaries
- The payment amount is a proposal, **not** a receipt, and is not posted to finance.
- Family additions are submitted and viewable, but not activated until trusted household lookup and multi-member activation is implemented.
- GV/HOH GV references remain unverified, without automatic issuance.
- Local runtime validation and builds have **not** been completed in this container because npm dependencies could not be installed; verify on Mac before merging.
- This patch does not change `app/login/page.tsx`, account secrets, database passwords, or existing migration history.

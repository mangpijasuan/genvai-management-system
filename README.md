# Genvai Management System (GMS) — Phase 1 MVP

Next.js 15 / TypeScript / Tailwind CSS (shadcn/ui-compatible component conventions) / PostgreSQL / Prisma 6.

## What works in this starter
- Public self-service member application, with consent attestation and application reference.
- Staff-assisted entry (login and role check required).
- Administrator dashboard, status queue, application details, review/correction/rejection/approval actions.
- Transactional approval creates an active member; no GV identifiers are auto-issued.
- Historic GV and HOH GV references are stored separately as *unverified application claims*.
- Member/household/identifier/chapter schema, audit records, chapter-limited administrative views.
- Input validation and unit tests for approval constraints.

## Local setup
1. Install Node.js 22+ and Docker Desktop.
2. `cp .env.example .env`; set strong `SESSION_SECRET` (32+ random characters), unique `ADMIN_EMAIL`, and `ADMIN_PASSWORD` (14+ characters).
3. `docker compose up -d`
4. `npm install`
5. `npx prisma generate`
6. `npx prisma migrate dev --name initial`
7. `npm run db:seed`
8. `npm run dev` and open http://localhost:3000
9. Run `npm test`, `npm run lint`, `npm run build`.

**Publishing to GitHub**: `git init && git add . && git commit -m "Bootstrap GMS Phase 1" && gh repo create genvai-management-system --private --source=. --remote=origin --push` (requires logged-in GitHub CLI). Do not commit `.env`.

## Security and production blockers
**This is an MVP starter, not a production-ready app. Do not import real member records or launch publicly yet.** The public submission endpoint needs bot protection and rate limits; auth needs MFA, account reset, session revocation, CSRF hardening, and brute-force protection. Public application status lookup, applicant authentication, and self-service corrections are not yet implemented. Chapter creation and assignment, UI-side household editing, member directory and GV lookup/import, sensitive data encryption, duplicate detection, document upload, financial ledger, Genvai claims, reporting, and migration tools remain future milestones. Implement audit review, backups, incident response, retention, consent/legal review, and access testing before storing sensitive member data. Sample enrollment does not verify identity.

**shadcn/ui note:** the starter uses Tailwind utility classes and shadcn-style design patterns. Radix Slot, class-variance-authority, and tailwind-merge are included as a base, but shadcn-generated components have not been installed yet; use `npx shadcn@latest init` once dependencies are accessible.

**GV policy:** No policy has been assumed. `gv_allocation_mode = UNRESOLVED_MANUAL_REVIEW`; GV identifiers are not allocated on approval. Legacy GV/HOH references must be matched and independently verified after written ZIA policy approval.

## Roadmap
1. Harden identity/security, make chapter administration explicit, add CAPTCHA/rate limiting.
2. Applicant accounts and status/correction portal, duplicate screening, enrollment audit and approval policy.
3. Household lifecycle, member directory, GV reconciliation and import from a verified sanitized XLSX mapping.
4. Genvai death claims and original PDF template support.
5. Finance ledger, benefit disbursement dual controls, analytics, production monitoring and backups.

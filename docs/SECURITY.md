# Security controls and release gates

- Default-deny access in API routes, not just navigation.
- Mandatory independent approval for staff-assisted submissions.
- Require separate identities, strong password policies, MFA, account recovery and audit review before production.
- Rate limit public form and login; bot verification and anti-spam required.
- Do not issue GV numbers before documented allocation policy is approved.
- Validate Chapter scope in all member-related APIs.
- Encrypt sensitive data and store documents outside public storage.
- Add integration and E2E tests using an isolated PostgreSQL database; unit tests alone are insufficient.
- Backup, restore drills, secure deployment, logs and alerting are required prior to live PII.

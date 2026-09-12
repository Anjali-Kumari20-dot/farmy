# Codebase Review Log

Last reviewed: 2026-09-12

## Architecture snapshot

- `frontend/` is a Vite/React single-page app. Farmer and administrator sessions use separate routes, tokens, and API clients.
- `backend/` is an Express/Mongoose API. MongoDB Atlas is the source of truth for farmers, intake submissions, tickets, slots, admins, notifications, and procurement settings.
- Twilio Verify is limited to OTP verification. Administrator messages are delivered as in-app notifications; they are not sent as arbitrary Twilio SMS.

## Resolved in this pass

| Area | Resolution |
| --- | --- |
| Admin access | Added separate admin model, signed admin tokens, current-account role checks, and a dedicated `/admin` UI. Farmer tokens cannot access admin routes. |
| Admin signup | Added a simple separate signup/login flow. The first account becomes super admin, and a unique database marker prevents concurrent first signups from creating more than one. |
| Ticket decisions | Admin decisions update the ticket, intake-form status, audit history, and an in-app farmer notification. |
| Identity corrections | Admins can correct DOB or Aadhaar through a narrow route. Raw Aadhaar is encrypted, never returned, and corrections are labelled `officially_reviewed`, not UIDAI-verified. |
| Slot workflow | Booking requires an accepted ticket; cancellation returns it to accepted so it can be rebooked. Database indexes and conditional ticket transition prevent capacity and double-booking races. |
| Misleading status | Replaced the hard-coded farmer `KYC Verified` label with the actual stored identity status. |

## Verification performed

- Frontend ESLint passes without warnings.
- Frontend production build passes.
- All backend JavaScript files pass `node --check`.
- Live Atlas health check reported `healthy` / `connected`.
- An unauthenticated request to the admin API returned `401` as expected.
- Atlas confirmed the new active-ticket and capacity-reservation indexes were created without duplicate active ticket bookings.

## Open items before a production launch

| Priority | Item | Reason / next action |
| --- | --- | --- |
| High | Replace the weak `JWT_SECRET` currently warned about at startup. | Generate a strong random value in the real `backend/.env`; do not commit it. |
| High | Add a UIDAI-authorized identity-verification integration before describing any profile as government-verified. | Aadhaar format and uniqueness checks are not government verification. |
| High | Replace open admin signup with audited super-admin provisioning/invites before production. | Open signup is intentionally enabled only for the hackathon demo. |
| Medium | Decide on a production notification channel/template for non-OTP SMS. | Twilio Verify is correctly reserved for OTPs; in-app notifications are implemented now. |
| Medium | Add automated integration tests for registration, ticket decisions, booking capacity, and authorization. | Current smoke checks verify the live health/auth boundary but do not replace a regression suite. |
| Deferred | Payment and transaction history. | Explicitly out of scope for the current procurement flow. |

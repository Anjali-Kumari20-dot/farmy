# Current Codebase Review

Reviewed on 2026-09-12. This is a point-in-time review of the current working tree; the older `CODEBASE_INSIGHTS_AND_DESIGN_FLAWS.md` is a historical design document and should not be treated as the current verification record.

## Completed in this pass

| Area | Result |
| --- | --- |
| Authentication | Register, login, password reset, and session restoration use the backend API and JWT bearer tokens. Registration and password reset now require a previously verified OTP. |
| Slot booking | The frontend uses the available-slot, book, list-my-slots, and cancel-slot API endpoints. |
| Produce intake | Added protected `POST /api/procurements` and `GET /api/procurements/mine` endpoints, a validated Mongoose model, and frontend submission through `frontend/src/api/procurements.js`. |
| Sensitive data | The intake model stores bank account numbers with `select: false`; API responses omit them. |
| Browser errors | Intake errors and success states are rendered in the form instead of browser `alert()` dialogs. |
| CORS | Requests from unlisted browser origins are no longer granted CORS access. |
| Twilio | Uses the official Twilio SDK, supports `TWILIO_ACCOUNT_SID` and legacy `TWILIO_SID`, and surfaces provider failures during OTP delivery. |

## Open issues and recommendations

| Severity | Finding | Impact / recommendation |
| --- | --- | --- |
| High | The backend falls back to the known JWT secret `fallback_secret_farmy` when `JWT_SECRET` is absent. | Set a strong `JWT_SECRET` in production and fail startup in production if it is missing. |
| High | Slot capacity is calculated with `countDocuments()` before creation, which is not atomic. | Concurrent booking requests can exceed capacity. Use a transaction with a per-slot counter or an atomic conditional update. |
| Medium | The server can start while MongoDB is unavailable. | API routes now return a clear 503 rather than waiting for Mongoose buffering; fail startup in production or provide a managed `MONGO_URI`. |
| Medium | Slot dates only match `YYYY-MM-DD`; impossible calendar dates are accepted. | Parse and validate the calendar date before booking or querying availability. |
| Medium | There is no automated test suite for API contracts, authentication, or booking concurrency. | Add integration tests with an isolated MongoDB instance before production deployment. |
| Low | `DashboardPage` intentionally suppresses the new React lint rule for async data loaders. | The page still passes lint; a future refactor can extract the API loading into a query hook to remove this exception. |
| Low | The logged-in farmer model has no village field, while the intake form displays a designated village. | Either collect/store a village at registration or remove the placeholder from the form. |

## Verification performed

- `npm run lint` in `frontend` after the changes.
- `npm run build` in `frontend` (passed with the Windows helper-process permission required by Vite).
- `node --check` for the new and modified backend route/model files.

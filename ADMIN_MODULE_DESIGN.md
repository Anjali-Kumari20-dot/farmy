# Administrator Module: Permissions and Operating Model

## Purpose

Administrators operate the procurement workflow; farmers retain access only to their own identity, forms, tickets, and slots. An administrator account is a separate account type and never reuses the farmer login session.

## Roles

| Permission | Super admin | Procurement officer | Support officer |
| --- | :---: | :---: | :---: |
| View tickets and intake forms | Yes | Yes | Yes |
| Change ticket review status | Yes | Yes | No |
| Correct farmer identity data | Yes | Yes | No |
| Send in-app notifications | Yes | Yes | Yes |
| Change slot times/capacity | Yes | No | No |
| Create/deactivate future admins | Planned | No | No |
| View transaction/payment history | Deferred | Deferred | Deferred |

## Identity and login policy

- For this hackathon, administrator signup is intentionally simple: `POST /api/admin/auth/signup` creates a normal admin account with no setup code. The first account becomes super admin; later accounts become procurement officers. A unique database marker prevents concurrent first signups from creating more than one super admin.
- Normal administrator login uses official email and password. Administrator JWTs contain `role: "admin"` and an `accessRole`; they cannot be used on farmer endpoints.
- Required admin profile fields: full name, official email, employee ID, mobile number, department, password, role, and active status.
- Before production, replace open signup with an audited super-admin invitation/provisioning flow.

## Ticket workflow

```text
Farmer submits intake form
  → Ticket status: submitted (pending review)
  → Officer marks under_review, accepted, or rejected with an audit note
  → Accepted ticket becomes eligible for slot booking
  → Booking changes it to slot_booked
  → Operations moves it to scheduled and completed
```

Every status change is appended to `statusHistory`, updates the linked intake form's status, and records an in-app notification for the farmer. A ticket ID is immutable and is the ticket lookup key.

## Admin APIs

| Endpoint | Purpose |
| --- | --- |
| `POST /api/admin/auth/signup` | Register an admin; first account is super admin |
| `POST /api/admin/auth/login` | Admin login |
| `GET /api/admin/auth/me` | Validate admin session |
| `GET /api/admin/tickets` | List up to 100 tickets, with optional status/search filters |
| `GET /api/admin/tickets/:ticketId` | Read a ticket and its farmer-owned form |
| `PATCH /api/admin/tickets/:ticketId/status` | Record a pending/review/accepted/rejected decision |
| `PATCH /api/admin/farmers/:farmerId/identity` | Correct DOB/Aadhaar identity data; raw Aadhaar is encrypted and never returned |
| `GET/PATCH /api/admin/settings/procurement` | Read/update future time slots and capacity |
| `POST /api/admin/farmers/:farmerId/notifications` | Create an in-app notification |

## Guardrails

- Raw Aadhaar is encrypted in the farmer record and never returned by APIs. Its format/uniqueness does not prove UIDAI authentication; an administrator correction is labelled `officially_reviewed`, not `verified`.
- Ticket and slot actions remain scoped to the owning farmer; admins access through explicit admin routes.
- In-app notification delivery is implemented. Custom SMS is intentionally not automated through Twilio Verify because Verify is an OTP product; a production notification SMS provider/template decision is still needed.
- Payment and transaction records remain out of scope.

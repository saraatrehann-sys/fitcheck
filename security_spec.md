# Security Specification for Campus Fit Check

## Data Invariants
1. A submission must have a `userId` that matches the authenticated user.
2. A submission must include a photo URL (representing an outfit).
3. A user can only access the feed if they have submitted today (though for this MVP sample feed, we will simulate this check).
4. Feedback must be linkable to a user (if signed in) or anonymous.
5. Users cannot edit other users' submissions.

## The Dirty Dozen Payloads (Targeting Rejection)

| Payload ID | Description | Target Collection | Expected Result |
|---|---|---|---|
| P1 | Create waitlist entry with someone else's email | waitlist | DENY (if we enforce email == auth.email) |
| P2 | Create submission without a photo URL | submissions | DENY |
| P3 | Create submission with 10 brands (limit is 5) | submissions | DENY |
| P4 | Update another user's submission brands | submissions | DENY |
| P5 | Injection: Set `upvotes` to 999999 on create | submissions | DENY |
| P6 | List all waitlist entries as a regular user | waitlist | DENY |
| P7 | Create submission with a malicious script in location | submissions | DENY (if regex/size enforced) |
| P8 | Update `userId` to a different user ID | submissions | DENY |
| P9 | Create feedback with a terminal status field not in schema | feedback | DENY |
| P10 | Read a specific waitlist entry without being owner | waitlist | DENY |
| P11 | Update `createdAt` to a past timestamp | submissions | DENY |
| P12 | Anonymous user creating a submission (if authed required) | submissions | DENY |

## Test Runner (Logic Check)
The security rules will be tested to ensure these payloads are blocked using the `isValid[Entity]` helpers and strict `affectedKeys()` checks.

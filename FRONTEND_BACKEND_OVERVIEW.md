# Backend Overview for Frontend Copilot

This document summarizes the backend API, auth, roles, data models, and response conventions to help the frontend integrate smoothly.

## Stack & Structure
- **Runtime:** Node.js + Express
- **DB/ORM:** PostgreSQL via Prisma
- **Auth:** JWT (Bearer header or HTTP-only cookie)
- **Routing:** Class-based routers per module

Top-level router mounts:
- `POST /auth/login`, `POST /auth/logout`, `GET /auth/check-auth`
- `GET/POST/PUT/DELETE /categories/*` (auth required)
- `GET/POST/PUT/DELETE /users/*` (auth + `ADMIN` role)
- `GET/POST/PUT/DELETE /assets/*` (auth required; mutations require `ADMIN` or `STAFF`)

## Authentication & Roles
- **JWT source:**
  - Authorization header: `Authorization: Bearer <token>`
  - Or HTTP-only cookie named from config (`config.cookie`).
- **Session creation:** On successful login, backend issues JWT and sets cookie (`httpOnly`, `secure` in non-dev, `sameSite` depends on env).
- **Middleware:**
  - `requireAuth`: validates JWT, loads `req.user = { id, email, role }`.
  - `requireRole([roles])`: enforces allowed roles.
- **Roles enum:** `ADMIN`, `STAFF`, `VIEWER`.

Frontend integration tips:
- Prefer Bearer header for API calls; cookie works if same-site and browser settings permit.
- Include token on all protected routes; handle `401` (Unauthorized) and `403` (Forbidden).

## Response & Error Conventions
- **Success shape:**
  ```json
  { "success": true, "data": <payload>, "message": "optional" }
  ```
- **Errors:** Raised via `AppError`; expect standard HTTP codes (`401`, `403`, `404`, `400`, `500`). Error body may include message; handle generically.

## Data Models (Prisma)

### User (`users`)
- `id: Int` (PK)
- `name: String`
- `email: String` (unique)
- `password: String` (hashed)
- `role: Role` (default `VIEWER`)
- `created_at: DateTime`, `updated_at: DateTime`
- Relations: `updatedAssets: Asset[]` via `asset_updated_by`

### Category (`categories`)
- `id: Int` (PK)
- `name: String` (unique)
- `description: String?`
- `created_at: DateTime`, `updated_at: DateTime`, `deleted_at: DateTime?`
- Relations: `assets: Asset[]`

### Asset (`assets`)
- `id: Int` (PK)
- `name: String`
- `quantity: Decimal(12,3)` default `0`
- `unit_measurement: String?`
- `description: String?`
- `serial_number: String?` (unique)
- `category_id: Int?`
- `location: String?`
- `image_url: String?`, `cloudinary_id: String?`
- `qr_data: String?`
- `updated_by: Int?`
- `created_at: DateTime`, `updated_at: DateTime`, `deleted_at: DateTime?`
- Relations:
  - `updatedBy: User?` (`asset_updated_by`)
  - `category: Category?`

## Endpoints

### Auth
- `POST /auth/login`
  - Body: `{ email: string, password: string }`
  - Success: sets JWT cookie; returns current user.
- `POST /auth/logout`
  - Clears cookie / session.
- `GET /auth/check-auth`
  - Requires token; returns current user profile.

### Categories (requireAuth)
- `GET /categories`
  - List categories. Consider adding pagination/filtering on frontend.
- `GET /categories/:category_id`
  - Fetch category by id.
- `POST /categories` (roles: `ADMIN`, `STAFF`)
  - Create category. Body includes `name`, `description?`.
- `PUT /categories/:category_id` (roles: `ADMIN`, `STAFF`)
  - Update category.
- `DELETE /categories/:category_id` (roles: `ADMIN`, `STAFF`)
  - Soft-delete by setting `deleted_at` (implementation may vary).

### Users (requireAuth + `ADMIN`)
- `GET /users`
  - List users.
- `GET /users/:id`
  - Fetch user by id.
- `POST /users`
  - Create user.
- `PUT /users/:id`
  - Update user.
- `DELETE /users/:id`
  - Delete or deactivate user.

### Assets (requireAuth)
- `GET /assets`
  - List assets. Expect to optionally filter by `category_id`, `deleted_at` null, etc. Pagination recommended on frontend.
- `GET /assets/:id`
  - Fetch asset by id.
- `POST /assets` (roles: `ADMIN`, `STAFF`)
  - Create asset. Suggested body fields: `name`, `description?`, `quantity`, `unit_measurement?`, `serial_number?`, `category_id?`, `location?`, `image_url?`, `qr_data?`.
- `PUT /assets/:id` (roles: `ADMIN`, `STAFF`)
  - Update asset. Backend records `updated_by` from `req.user`.
- `DELETE /assets/:id` (roles: `ADMIN`, `STAFF`)
  - Soft-delete asset (`deleted_at`).

## Request Examples

Auth header:
```
Authorization: Bearer <JWT>
```

Login:
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "********"
}
```

Create Asset:
```json
POST /assets
{
  "name": "Printer",
  "quantity": "2.000",
  "unit_measurement": "pcs",
  "category_id": 1,
  "location": "HQ - 2F"
}
```

## Frontend Considerations
- **Decimal handling:** `quantity` is Decimal; send as string to avoid float issues.
- **Soft deletes:** Items with `deleted_at` should be hidden by default.
- **Permissions UI:** Disable create/update/delete based on `req.user.role`.
- **Images:** Use `image_url` and `cloudinary_id` if present; upload flow may be separate.
- **QR:** `qr_data` can store encoded metadata; rendering QR is a frontend concern.
- **Pagination/Filtering:** Implement client-side controls; backend supports indexing on `category_id, deleted_at`.

## Edge Cases & Notes
- **Token missing/expired:** Expect `401`. Prompt re-login; clear local token.
- **Forbidden actions:** `403` when role insufficient.
- **Unique constraints:** `email`, `serial_number`, `category.name` are unique; handle duplicate errors gracefully.
- **Cookie mode:** When relying on cookies, ensure `sameSite`/`secure` aligns with deployment; cross-origin may require CORS + credentials.
- **Timestamps:** Use backend-provided `created_at`, `updated_at` for display; avoid client-side overwrites.

## Quick Integration Checklist
- Store JWT and attach `Authorization` header on protected requests.
- Build role-aware UI: `VIEWER` read-only, `STAFF`/`ADMIN` can mutate, `USERS` module restricted to `ADMIN`.
- Normalize decimal quantities; display with up to 3 decimals.
- Hide soft-deleted records; optionally provide admin toggle to view archived.
- Handle common HTTP errors with user-friendly messages.

If you need more details (payload schemas per controller), ask the backend Copilot for controller method signatures.

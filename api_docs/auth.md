## Auth Routes

### POST - `/api/v1/auth/login`

Public login endpoint.

Body:

```json
{
  "id": "custom generated id",
  "password": "user's password"
}
```
---
### POST - `/api/v1/auth/refresh-token`

Public refresh-token endpoint.

Cookies:

```json
{
  "refreshToken": "[refresh token from cookies]"
}
```
---
### POST - `/api/v1/auth/change-password`

Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

Headers:

```json
{
  "authorization": "Bearer [accessToken]"
}
```

Body:

```json
{
  "oldPassword": "previous password",
  "newPassword": "new password"
}
```
---
### POST `/api/v1/auth/forget-password`

Public password reset request.

Body:

```json
{
  "id": "custom id"
}
```
---
### POST `/api/v1/auth/reset-password`

Public password reset confirmation.

Headers:

```json
{
  "authorization": "Bearer [reset-access-token]"
}
```

Body:

```json
{
  "id": "custom id",
  "newPassword": "USER PASSWORD"
}
```
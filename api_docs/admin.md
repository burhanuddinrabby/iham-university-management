
## Admin Routes

### GET - `/api/v1/admins`

Protected endpoint for `superAdmin` and `admin`.

**Supports common filters and pagination.**

---

### GET - `/api/v1/admins/:adminID`

Protected endpoint for `superAdmin` and `admin`.

---

### PATCH - `/api/v1/admins/:adminID`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "admin": {
    "contactNo": "...",
    "name": {
      "firstName": "..."
    }
  }
}
```

---

### DELETE - `/api/v1/admins/:adminID`

Protected endpoint for `superAdmin` only.

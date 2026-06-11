## Semester Registration Routes

### POST - `/api/v1/semester-registrations/create-semester-registration`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "academicSemester": "MONGODB _id",
  "status": "ongoing",
  "startDate": "2025-05-01T00:00:00Z", //format
  "endDate": "2025-08-31T23:59:59Z",
  "minCredit": 6,
  "maxCredit": 18
}
```

---

### GET - `/api/v1/semester-registrations`

Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

**Supports common filters and pagination.**

---

### GET - `/api/v1/semester-registrations/:id`

Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

---

### PATCH - `/api/v1/semester-registrations/:id`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "status": "ended",
  "minCredit": 3
}
```

---

### DELETE - `/api/v1/semester-registrations/:id`

Protected endpoint for `superAdmin` and `admin`.
## Offered Course Routes

### POST - `/api/v1/offered-courses/create-offered-course`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "semesterRegistration": "MONGODB _id",
  "academicFaculty": "MONGODB _id",
  "academicDepartment": "MONGODB _id",
  "course": "MONGODB _id",
  "faculty": "MONGODB _id",
  "maxCapacity": 50,
  "section": 3,
  "days": ["Sun", "Mon"],
  "startTime": "08:30", //24hr format
  "endTime": "09:00"
}
```

---

### GET - `/api/v1/offered-courses`

Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

**Supports common filters and pagination.**

---

### GET - `/api/v1/offered-courses/my-offered-courses`

Protected endpoint for `student`.

---

### GET - `/api/v1/offered-courses/:id`

Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

---

### PATCH - `/api/v1/offered-courses/:id`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "faculty": "MONGODB _id",
  "maxCapacity": 100,
  "days": ["Sun", "Mon"],
  "startTime": "13:30",
  "endTime": "14:00"
}
```

---

### DELETE - `/api/v1/offered-courses/:id`

Protected endpoint for `superAdmin` and `admin`.


## Faculty Routes

### GET - `/api/v1/faculties`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

**Supports common filters and pagination.**

---

### GET - `/api/v1/faculties/:facultyID`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

---

### PATCH - `/api/v1/faculties/:facultyID`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "faculty": {
    "contactNo": "...",
    "name": {
      "firstName": "..."
    }
  }
}
```

---

### DELETE - `/api/v1/faculties/:facultyID`

Protected endpoint for `superAdmin` and `admin`.

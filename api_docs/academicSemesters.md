## Academic Semester Routes

### POST - `/api/v1/academic-semesters/create-semester`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "name": "Fall",
  "year": "2024"
}
```

---

### GET - `/api/v1/academic-semesters`

Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

**Supports common filters and pagination.**

---

### GET - `/api/v1/academic-semesters/:id`


Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

---

### PATCH - `/api/v1/academic-semesters/:id`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "name": "Spring",
  "year": "2024"
}
```

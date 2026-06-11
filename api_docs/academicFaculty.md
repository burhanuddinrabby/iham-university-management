## Academic Faculty Routes

### POST - `/api/v1/academic-faculties/create-academic-faculty`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "name": "Faculty of Engineering"
}
```

---

### GET - `/api/v1/academic-faculties`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

**Supports common filters and pagination.**


---

### GET - `/api/v1/academic-faculties/:id`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

---

### PATCH - `/api/v1/academic-faculties/:id`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "name": "FSIT"
}
```

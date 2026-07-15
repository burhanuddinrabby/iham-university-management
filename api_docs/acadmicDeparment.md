## Academic Department Routes

### POST - `/api/v1/academic-departments/create-department`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "name": "Electrical and Eletronic Engineering",
  "academicFaculty": "Mongo _id"
}
```

---

### GET - `/api/v1/academic-departments`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

**Supports common filters and pagination.**

#### Successful Response
```ts
type Response = {
  success: boolean
  message: string
  meta: {
    page: number
    limit: number
    totalEntries: number
    totalPage: number
  }
  data: Array<{
    _id: string
    name: string
    academicFaculty: any
    createdAt: string
    updatedAt: string
  }>
}
```

Example query:

```text
/api/v1/academic-departments?searchTerm=Engineering&page=1&limit=10
```

---

### GET - `/api/v1/academic-departments/:id`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

---

### PATCH - `/api/v1/academic-departments/:id`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "name": "Electrical and Eletronic Engineering",
  "academicFaculty": "Mongo _id"
}
```

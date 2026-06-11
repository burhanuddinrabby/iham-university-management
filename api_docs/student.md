
## Student Routes

### GET - `/api/v1/students`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

**Supports common filters and pagination.**

Example query:

```text
/api/v1/students?searchTerm=Rodh&contactNo=01712345678&sort=-email&page=1&limit=2&fields=-email
```

---

### GET - `/api/v1/students/:studentID` [custom id]

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

---

### PATCH - `/api/v1/students/:studentID`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "student": {
    "contactNo": " ... ",
    "guardian": {
      "fatherName": "... ..."
    }
  }
}
```

---

### DELETE - `/api/v1/students/:studentID`

Protected endpoint for `superAdmin` and `admin`.

---
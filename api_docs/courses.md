## Course Routes

### POST - `/api/v1/courses/create-course`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "title": "Basic Express",
  "prefix": "EXPRESS",
  "code": 101,
  "credits": 3,
  "prerequisites": [
    {
      "courseCode": "JS101"
    },
    {
      "courseId": "MONGODB _id"
    }
  ]
}
```

---

### GET - `/api/v1/courses`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

**Supports common filters and pagination.**

---

### GET - `/api/v1/courses/:id`

Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

---

### PATCH - `/api/v1/courses/:id`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "title": "Basic Express",
  "prefix": "EXPRESS",
  "courseCode": "EXPRESS101",
  "prerequisites": [
    {
      "courseCode": "JS101",
      "isDeleted": true //insertion
    },
    {
      "courseId": "MONGODB _id",
      "isDeleted": true //deletion
    },
    {
      "courseCode": "FIREBASE111",
      "isDeleted": false //insertion
    },
    {
      "courseId": "MONGODB _id",
      "isDeleted": false //insertion
    }
  ]
}
```

---

### DELETE - `/api/v1/courses/:id`

Protected endpoint for `superAdmin` and `admin`.

---

### PUT - `/api/v1/courses/:id/assign-faculties`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "faculties": ["MONGODB _id", "MONGODB _id"]
}
```
###### eg: /courses/MONGODB _id/assign-faculties

---

### DELETE - `/api/v1/courses/:id/remove-faculties`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "faculties": ["MONGODB _id"]
}
```
###### eg:/courses/MONGODB _id/remove-faculties 

---

### GET - `/api/v1/courses/:id/get-faculties`

Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

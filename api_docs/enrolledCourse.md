## Enrolled Course Routes

### POST - `/api/v1/enrolled-courses/create-enrolled-course`

Protected endpoint for `student`.

Body:

```json
{
  "offeredCourse": "MONGODB _id"
}
```

---

### PATCH - `/api/v1/enrolled-courses/update-enrolled-course-marks`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

Body:

```json
{
  "semesterRegistration": "MONGODB _id",
  "offeredCourse": "MONGODB _id",
  "student": "MONGODB _id",
  "courseMarks": {
    //fields [CT1, CT2, CT3, assignment,attendance, presentation, finalTerm]
    "CT3": 9,
    "midTerm": 22
  }
}
```

---

### GET - `/api/v1/enrolled-courses/my-enrolled-courses`

Protected endpoint for `student`.

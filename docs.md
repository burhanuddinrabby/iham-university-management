<h1 style="text-align:center">IHAM University API Documentation</h1>

This document consolidates the API surface for the backend project.

---
---

### Base URL
All routes are mounted under:

```text
/api/v1
```

Example:

```text
http://localhost:5000/api/v1
```
---
---

### Authentication

Protected endpoints require this header:

```json
{
  "authorization": "Bearer [accessToken]"
}
```

`auth/login` sets the refresh token in an `httpOnly` cookie.

---
---

### Common Query Params

List endpoints commonly support these query params where applicable:

- `searchTerm`
- `sort`
- `page`
- `limit`
- `fields`
- `fieldName`

---
---
### ALL ROUTES

###### [Auth Routes](./api_docs/auth.md) || [User Routes](./api_docs/user.md) || [Student Routes](./api_docs/student.md) || [Faculty Routes](./api_docs/faculty.md) || [Admin Routes](./api_docs/admin.md) || [Academic Semester Routes](./api_docs/academicSemesters.md) || [Academic Faculty Routes](./api_docs/academicFaculty.md) || [Academic Department Routes](./api_docs/acadmicDeparment.md) || [Course Routes](./api_docs/courses.md) || [Semester Registration Routes](./api_docs/semesterRegistration.md) || [Offered Course Routes](./api_docs/offeredCourse.md) || [Enrolled Course Routes](./api_docs/enrolledCourse.md)

#### Route Verification

| Module | Mounted Path | Doc File | Status | Notes |
| --- | --- | --- | --- | --- |
| Auth | `/auth` | [api_docs/auth.md](./api_docs/auth.md) | Verified | Matches live route file and controller actions. |
| User | `/users` | [api_docs/user.md](./api_docs/user.md) | Verified | Includes create student/faculty/admin, status change, and me routes. |
| Student | `/students` | [api_docs/student.md](./api_docs/student.md) | Verified | CRUD routes match controller and service methods. |
| Faculty | `/faculties` | [api_docs/faculty.md](./api_docs/faculty.md) | Verified | CRUD routes match controller and service methods. |
| Admin | `/admins` | [api_docs/admin.md](./api_docs/admin.md) | Verified | CRUD routes match controller and service methods. |
| Academic Semester | `/academic-semesters` | [api_docs/academicSemesters.md](./api_docs/academicSemesters.md) | Verified | Create, list, get single, and update are present in code. |
| Academic Faculty | `/academic-faculties` | [api_docs/academicFaculty.md](./api_docs/academicFaculty.md) | Verified | Create, list, get single, and update are present in code. |
| Academic Department | `/academic-departments` | [api_docs/acadmicDeparment.md](./api_docs/acadmicDeparment.md) | Verified | Create, list, get single, and update are present in code. |
| Course | `/courses` | [api_docs/courses.md](./api_docs/courses.md) | Verified | Includes assign/remove/get faculties routes in addition to CRUD. |
| Semester Registration | `/semester-registrations` | [api_docs/semesterRegistration.md](./api_docs/semesterRegistration.md) | Verified | Matches create, list, get single, update, and delete routes. |
| Offered Course | `/offered-courses` | [api_docs/offeredCourse.md](./api_docs/offeredCourse.md) | Verified | Includes my-offered-courses route for students. |
| Enrolled Course | `/enrolled-courses` | [api_docs/enrolledCourse.md](./api_docs/enrolledCourse.md) | Verified | Matches create, update marks, and my-enrolled-courses routes. |

For the full request/response examples, use the linked module docs above.

---
---

### Notes

- All protected routes require a valid access token unless stated otherwise.
- Several list endpoints support filtering, pagination, sorting, and field selection.
- Multipart upload routes expect `file` plus a JSON string in `data`.
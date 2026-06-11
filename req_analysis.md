<h1 style="text-align:center">IHAM University Requirement Analysis</h1>

This document maps the current product requirements to the implemented modules, route coverage, and DB service calls in the codebase.

## Scope

The backend is organized around these functional areas:

- Authentication and password recovery
- User onboarding and profile access
- Student, faculty, and admin profile management
- Academic setup for semesters, faculties, and departments
- Course creation, prerequisite management, and faculty assignment
- Semester registration and offered course scheduling
- Student enrollment and grade processing

## Requirement Coverage Summary

| Area | Requirement | Module(s) | Coverage |
| --- | --- | --- | --- |
| Authentication | Login, refresh token, change password, reset password | auth | Implemented |
| User management | Create student/faculty/admin, status update, get current user | user | Implemented |
| Student management | List, get single, update, delete student records | student | Implemented |
| Faculty management | List, get single, update, delete faculty records | faculty | Implemented |
| Admin management | List, get single, update, delete admin records | admin | Implemented |
| Academic setup | Academic semester, faculty, department CRUD | academicSemester, academicFaculty, academicDepartment | Implemented |
| Course management | Course CRUD, prerequisites, faculty assignment | course | Implemented |
| Semester control | Semester registration lifecycle | semesterRegistration | Implemented |
| Offered course control | Create and manage semester offerings | offeredCourse | Implemented |
| Enrollment and grading | Enroll in courses, update marks, view enrolled courses | enrolledCourse | Implemented |

## Module Requirement Analysis

### Authentication

Requirement: provide secure login, token refresh, password change, password reset, and email-based reset initiation.

Implemented flow:

- Login verifies credentials and issues access and refresh tokens.
- Refresh token exchanges a valid refresh token for a new access token.
- Change password requires the current password and updates the stored hash.
- Forget password generates a short-lived reset token and sends a reset link by email.
- Reset password validates the reset token and updates the user password.

DB/service calls:

- `login(payload)` -> reads `UserModel`, checks password match, returns JWTs.
- `refreshToken(token)` -> reads `UserModel`, checks password-change timing, returns a new access token.
- `changePassword(userData, payload)` -> reads and updates `UserModel` password fields.
- `forgetPassword(id)` -> reads `UserModel`, creates reset token, sends email.
- `resetPassword(token, payload)` -> validates token and updates `UserModel` password fields.

### User Management

Requirement: admins must be able to create student, faculty accounts; all authenticated users must be able to access their own profile; admins must be able to change user status. Only super admin can create admins.

Implemented flow:

- Student, faculty, and admin creation each build a user record plus a role-specific profile record.
- Profile image upload is supported when a file is provided.
- Student and faculty creation derive academic faculty from the selected department.
- `me` returns the current authenticated profile based on role.
- Change status updates the user account status by generated id.

DB/service calls:

- `createStudentIntoDB(file, password, studentData)` -> uses `AcademicSemesterModel`, `AcademicDepartmentModel`, `UserModel`, `StudentModel`.
- `createFacultyIntoDB(file, password, facultyData)` -> uses `AcademicDepartmentModel`, `UserModel`, `FacultyModel`.
- `createAdminIntoDB(file, password, adminData)` -> uses `UserModel`, `AdminModel`.
- `getMeFromDB(user)` -> reads `StudentModel`, `FacultyModel`, or `AdminModel` depending on role.
- `changeStatusOfUser(id, payload)` -> updates `UserModel`.

### Student Management

Requirement: list students, fetch one student, update student profile, and soft-delete student accounts.

Implemented flow:

- Student listing supports query filtering, sorting, pagination, and field selection.
- Single student fetch populates academic semester and department relationships.
- Update edits nested student profile fields without replacing the whole document.
- Delete performs a soft delete on both the student profile and the linked user record.

DB/service calls:

- `getAllStudentsFromDB(query)` -> reads `StudentModel` with population and query builder.
- `getSingleStudentFromDB(id)` -> reads `StudentModel` by generated id.
- `updateStudentIntoDB(id, payload)` -> updates `StudentModel` nested fields.
- `deleteStudentFromDB(id)` -> updates `StudentModel` and `UserModel` in a transaction.

### Faculty Management

Requirement: list faculty members, fetch one, update profile fields, and soft-delete faculty accounts.

Implemented flow:

- Faculty listing supports query filtering, sorting, pagination, and field selection.
- Single faculty fetch populates academic department and faculty relations.
- Update edits nested name fields while preserving the rest of the profile.
- Delete soft-deletes both faculty and linked user records.

DB/service calls:

- `getAllFacultiesFromDB(query)` -> reads `FacultyModel` with population and query builder.
- `getSingleFacultyFromDB(id)` -> reads `FacultyModel` by generated id.
- `updateFacultyIntoDB(id, payload)` -> updates `FacultyModel` nested fields.
- `deleteFacultyFromDB(id)` -> updates `FacultyModel` and `UserModel` in a transaction.

### Admin Management

Requirement: list admin accounts, fetch one, update profile fields, and soft-delete admin accounts.

Implemented flow:

- Admin listing supports query filtering, sorting, pagination, and field selection.
- Single admin fetch reads the admin profile by generated id.
- Update edits nested name fields.
- Delete soft-deletes both admin and linked user records.

DB/service calls:

- `getAllAdminsFromDB(query)` -> reads `AdminModel` with query builder.
- `getSingleAdminFromDB(id)` -> reads `AdminModel` by generated id.
- `updateAdminIntoDB(id, payload)` -> updates `AdminModel` nested fields.
- `deleteAdminFromDB(id)` -> updates `AdminModel` and `UserModel` in a transaction.

### Academic Semester

Requirement: create, list, fetch, and update academic semesters.

Implemented flow:

- Semester creation stores a new academic semester document.
- Listing supports filtering, sorting, pagination, and field selection.
- Single fetch returns one semester by Mongo id.
- Update modifies semester fields in place.

DB/service calls:

- `createSemesterIntoDB(payload)` -> creates `AcademicSemesterModel` record.
- `getAllSemestersFromDB(query)` -> reads `AcademicSemesterModel` with query builder.
- `getSingleSemestersFromDB(id)` -> reads `AcademicSemesterModel` by `_id`.
- `updateSemesterIntoDB(id, payload)` -> updates `AcademicSemesterModel` by `_id`.

### Academic Faculty

Requirement: create, list, fetch, and update academic faculties.

Implemented flow:

- Academic faculty creation inserts a new faculty group.
- Listing supports filtering and pagination.
- Single fetch and update operate on Mongo id.

DB/service calls:

- `createAcademicFacultyIntoDB(payload)` -> creates `AcademicFacultyModel` record.
- `getAllAcademicFacultiesFromDB(query)` -> reads `AcademicFacultyModel` with query builder.
- `getSingleAcademicFacultyFromDB(id)` -> reads `AcademicFacultyModel` by id.
- `updateAcademicFacultyIntoDB(id, payload)` -> updates `AcademicFacultyModel` by id.

### Academic Department

Requirement: create, list, fetch, and update academic departments.

Implemented flow:

- Department creation stores a department linked to an academic faculty.
- Listing populates academic faculty details and supports filtering and pagination.
- Single fetch returns the department with its faculty relation.
- Update modifies department fields in place.

DB/service calls:

- `createAcademicDepartmentIntoDB(payload)` -> creates `AcademicDepartmentModel` record.
- `getAllAcademicDepartmentsFromDB(query)` -> reads `AcademicDepartmentModel` with population and query builder.
- `getSingleAcademicDepartmentFromDB(id)` -> reads `AcademicDepartmentModel` by id with population.
- `updateAcademicDepartmentIntoDB(id, payload)` -> updates `AcademicDepartmentModel` by id.

### Course Management

Requirement: create courses, update course metadata, soft-delete courses, manage prerequisites, and assign faculty members to courses.

Implemented flow:

- Course creation derives the final course code and resolves prerequisite courses.
- Update supports course metadata changes and prerequisite add/remove handling.
- Listing, single fetch, and delete are available.
- Faculty assignment and removal are stored in a dedicated course-faculty relation model.

DB/service calls:

- `createCourseIntoDB(payload)` -> creates `CourseModel` record and resolves prerequisite courses from `CourseModel`.
- `getAllCoursesFromDB(query)` -> reads `CourseModel` with query builder and populates prerequisites.
- `getSingleCourseFromDB(id)` -> reads `CourseModel` by id and populates prerequisites.
- `updateCourseIntoDB(id, payload)` -> reads and updates `CourseModel`, resolves prerequisite state.
- `deleteCourseFromDB(id)` -> soft-deletes `CourseModel`.
- `assignCourseFacultiesIntoDB(id, payload)` -> upserts `CourseFacultyModel` using `$addToSet`.
- `removeCourseFacultiesFromDB(id, payload)` -> updates `CourseFacultyModel` using `$pull`.
- `getFacultiesWithCourseFromDB(courseId)` -> reads `CourseFacultyModel` and populates faculty references.

### Semester Registration

Requirement: register academic semesters, list registrations, fetch one, update registration status, and delete only upcoming registrations.

Implemented flow:

- Creation validates the academic semester and prevents duplicate or concurrent upcoming registrations.
- Listing supports query builder operations and semester population.
- Single fetch returns the registration with academic semester details.
- Update enforces status transition rules.
- Delete only works for upcoming registrations and removes related offered courses inside a transaction.

DB/service calls:

- `createSemesterRegistrationIntoDB(payload)` -> reads `AcademicSemesterModel`, reads `SemesterRegistrationModel`, creates `SemesterRegistrationModel`.
- `getAllSemesterRegistrationFromDB(query)` -> reads `SemesterRegistrationModel` with population and query builder.
- `getSingleSemesterRegistrationFromDB(id)` -> reads `SemesterRegistrationModel` by id with population.
- `updateSemesterRegistrationIntoDB(id, payload)` -> reads and updates `SemesterRegistrationModel` by id.
- `deleteSemesterRegistrationFromDB(id)` -> deletes matching `OfferedCourseModel` documents and deletes the semester registration record.

### Offered Course

Requirement: create offered courses for a semester, list them, fetch one, update assignment details, delete upcoming offerings, and show student-specific available offerings.

Implemented flow:

- Creation validates semester, faculty, department, course existence, department-to-faculty relationship, duplicate section, and time conflicts.
- Listing and single fetch return populated relational data.
- Update only works for offerings attached to an upcoming semester and checks faculty schedule conflicts.
- Delete only works for offerings attached to an upcoming semester.
- Student-specific offerings are filtered by current ongoing semester, department, faculty, enrollment history, and prerequisite completion.

DB/service calls:

- `createOfferedCourseIntoDB(payload)` -> reads `SemesterRegistrationModel`, `AcademicFacultyModel`, `AcademicDepartmentModel`, `FacultyModel`, `CourseModel`, creates `OfferedCourseModel`.
- `getAllOfferedCourseFrom(query)` -> reads `OfferedCourseModel` with population and query builder.
- `getSingleOfferedCourseFrom(id)` -> reads `OfferedCourseModel` by id with population.
- `updateOfferedCourseIntoDB(id, payload)` -> reads `OfferedCourseModel`, `SemesterRegistrationModel`, `FacultyModel`, updates `OfferedCourseModel`.
- `deleteOfferedCourseFromDB(id)` -> reads `OfferedCourseModel`, reads `SemesterRegistrationModel`, deletes `OfferedCourseModel`.
- `getMyOfferedCoursesFromDB(studentId, query)` -> reads `StudentModel`, `SemesterRegistrationModel`, and aggregates from `OfferedCourseModel` and `EnrolledCourseModel`.

### Enrolled Course

Requirement: let students enroll in offered courses, allow faculty to update marks, and let students view their own enrollments.

Implemented flow:

- Enrollment checks offered-course existence, section capacity, duplicate registration, semester credit limits, and then records the enrollment in a transaction.
- Mark updates are allowed only for the faculty assigned to that enrollment.
- When enough marks are present, grade, grade points, and completion state are calculated automatically.
- Students can list their own enrolled courses with populated relational data.

DB/service calls:

- `createEnrolledCourseIntoDB(id, payload)` -> reads `OfferedCourseModel`, `StudentModel`, `SemesterRegistrationModel`, `CourseModel`, and creates `EnrolledCourseModel` plus updates `OfferedCourseModel` capacity in a transaction.
- `updateEnrolledCourseIntoDB(facultyId, payload)` -> reads `FacultyModel`, reads `EnrolledCourseModel`, updates marks and grading fields on `EnrolledCourseModel`.
- `getMyEnrolledCourseFromDB(studentId, query)` -> reads `StudentModel` and lists `EnrolledCourseModel` with population and query builder.

## Data Model Alignment

The current implementation depends on these core collections:

- `UserModel`
- `StudentModel`
- `FacultyModel`
- `AdminModel`
- `AcademicSemesterModel`
- `AcademicFacultyModel`
- `AcademicDepartmentModel`
- `CourseModel`
- `CourseFacultyModel`
- `SemesterRegistrationModel`
- `OfferedCourseModel`
- `EnrolledCourseModel`

## Notes

- The codebase currently implements the requirements listed in the root README and module docs.
- Role-based access control is enforced by route guards, so each requirement also depends on the correct role assignment.
- Some flows rely on transactions to keep linked collections consistent, especially user/profile creation, soft delete, and course enrollment.
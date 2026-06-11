<h1 style="border-bottom: none; text-align: center">IHAM University Data Models</h1>   

---
---

### Model Design Rules

- Most collections use Mongoose `ObjectId` references to connect related documents.
- Role-specific profile collections are separated from the shared `User` authentication collection.
- Several models use soft delete with `isDeleted` instead of hard delete.
- Most read operations exclude deleted documents through schema middleware.
- Timestamps are enabled on most collections through `createdAt` and `updatedAt`.

---
---

<h2 style="border-bottom: none;">User</h2>

Authentication and account state live here.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Generated user id used by login and lookups. |
| `password` | string | yes | Stored hashed; excluded from normal query output. |
| `email` | string | yes | Unique login email. |
| `needsPasswordChange` | boolean | no | Defaults to `true`. |
| `passwordChangedAt` | Date | no | Set when password changes. |
| `role` | `superAdmin` \| `admin` \| `student` \| `faculty` | yes | Access control role. |
| `status` | `in-progress` \| `blocked` | no | Defaults to `in-progress`. |
| `isDeleted` | boolean | no | Soft-delete flag. |

#### Behavior

- Password is hashed before save.
- Password is blanked after save response.
- Static helpers support password matching and JWT timestamp checks.

---
---

<h2 style="border-bottom: none;">Student</h2>


Student profile collection linked to `User`.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Generated student id. |
| `user` | ObjectId | yes | Refers to `User`. |
| `name` | object | yes | Nested name object. |
| `gender` | `male` \| `female` \| `other` | yes | Gender choice. |
| `dateOfBirth` | Date | no | Optional date of birth. |
| `email` | string | yes | Unique student email. |
| `contactNo` | string | yes | Primary contact number. |
| `emergencyContactNo` | string | yes | Emergency contact number. |
| `bloodGroup` | `A+` \| `A-` \| `B+` \| `B-` \| `AB+` \| `AB-` \| `O+` \| `O-` | no | Optional blood group. |
| `presentAddress` | string | yes | Current address. |
| `permanentAddress` | string | yes | Permanent address. |
| `guardian` | object | yes | Nested guardian object. |
| `localGuardian` | object | yes | Nested local guardian object. |
| `profileImg` | string | no | Profile image URL. |
| `admissionSemester` | ObjectId | yes | Refers to `Semester`. |
| `academicDepartment` | ObjectId | yes | Refers to `AcademicDepartment`. |
| `academicFaculty` | ObjectId | no | Refers to `AcademicFaculty`. Derived during creation. |
| `isDeleted` | boolean | no | Soft-delete flag. |

#### Embedded Structures

##### `name`

- `firstName`: string
- `middleName`: string, optional
- `lastName`: string

##### `guardian`

- `fatherName`: string
- `fatherOccupation`: string
- `fatherContactNo`: string
- `motherName`: string
- `motherOccupation`: string, optional
- `motherContactNo`: string, optional

##### `localGuardian`

- `name`: string
- `occupation`: string
- `contactNo`: string
- `address`: string

#### Behavior

- A virtual `fullname` combines first, middle, and last name.
- Find operations automatically exclude deleted students.
- Static helper `isUserExists(id)` checks for a student by generated id.

---
---

<h2 style="border-bottom: none;">
Faculty
</h2>


Faculty profile collection linked to `User`.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Generated faculty id. |
| `user` | ObjectId | yes | Refers to `User`. |
| `name` | object | yes | Nested name object. |
| `designation` | string | yes | Example: Lecturer. |
| `gender` | `male` \| `female` \| `other` | yes | Gender choice. |
| `dateOfBirth` | Date | no | Optional date of birth. |
| `email` | string | yes | Unique faculty email. |
| `contactNo` | string | yes | Primary contact number. |
| `emergencyContactNo` | string | yes | Emergency contact number. |
| `presentAddress` | string | yes | Current address. |
| `permanentAddress` | string | yes | Permanent address. |
| `academicDepartment` | ObjectId | yes | Refers to `AcademicDepartment`. |
| `academicFaculty` | ObjectId | no | Refers to `AcademicFaculty`. Derived during creation. |
| `profileImg` | string | no | Profile image URL. |
| `isDeleted` | boolean | no | Soft-delete flag. |
| `bloodGroup` | `A+` \| `A-` \| `B+` \| `B-` \| `AB+` \| `AB-` \| `O+` \| `O-` | no | Optional blood group. |

#### Embedded Structures

##### `name`

- `firstName`: string
- `middleName`: string, optional
- `lastName`: string

#### Behavior

- A virtual `fullname` combines first, middle, and last name.
- Find operations automatically exclude deleted faculty.
- Static helper `isUserExists(id)` checks for a faculty profile by generated id.

---
---

<h2 style="border-bottom: none;">
Admin
</h2>

Admin profile collection linked to `User`.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Generated admin id. |
| `user` | ObjectId | yes | Refers to `User`. |
| `name` | object | yes | Nested name object. |
| `designation` | string | yes | Example: VC. |
| `gender` | `male` \| `female` \| `other` | yes | Gender choice. |
| `dateOfBirth` | Date | no | Optional date of birth. |
| `email` | string | yes | Unique admin email. |
| `contactNo` | string | yes | Primary contact number. |
| `emergencyContactNo` | string | yes | Emergency contact number. |
| `presentAddress` | string | yes | Current address. |
| `permanentAddress` | string | yes | Permanent address. |
| `profileImg` | string | no | Profile image URL. |
| `isDeleted` | boolean | no | Soft-delete flag. |
| `bloodGroup` | `A+` \| `A-` \| `B+` \| `B-` \| `AB+` \| `AB-` \| `O+` \| `O-` | no | Optional blood group. |

#### Embedded Structures

##### `name`

- `firstName`: string
- `middleName`: string, optional
- `lastName`: string

#### Behavior

- A virtual `fullname` combines first, middle, and last name.
- Find operations automatically exclude deleted admins.
- Static helper `isUserExists(id)` checks for an admin profile by generated id.

---
---

<h2 style="border-bottom: none;">
Academic Semester
</h2>

Represents the academic term definition.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | `Spring` \| `Summer` \| `Fall` | yes | Semester name. |
| `code` | `01` \| `02` \| `03` | no | Derived from the semester name. |
| `year` | string | yes | Academic year. |
| `startMonth` | month name | no | Derived from the semester name. |
| `endMonth` | month name | no | Derived from the semester name. |

#### Behavior

- On save, code, start month, and end month are derived from the semester name.
- On update, the same derivation logic is reapplied when the semester name changes.
- Duplicate semester name and year combinations are blocked.

---
---

<h2 style="border-bottom: none;">
Academic Faculty
</h2>

Top-level academic grouping.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | yes | Unique faculty name. |

---
---

<h2 style="border-bottom: none;">
Academic Department
</h2>

Department inside an academic faculty.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | yes | Unique department name. |
| `academicFaculty` | ObjectId | yes | Refers to `AcademicFaculty`. |

#### Behavior

- Save middleware blocks duplicate department names.
- Update middleware checks that the department exists before update.

---
---

<h2 style="border-bottom: none;">
Course
</h2>

Academic course catalog record.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | Unique course title. |
| `prefix` | string | yes | Course prefix, such as CSE or ENG. |
| `code` | number | yes | Course numeric code. |
| `credits` | number | yes | Credit value. |
| `courseCode` | string | no | Combined course code, usually `prefix + code`. Unique. |
| `prerequisites` | array | no | Array of prerequisite course references. |
| `isDeleted` | boolean | no | Soft-delete flag. |

#### Embedded Structure: `prerequisites`

Each item includes:

- `course`: ObjectId ref to `Course`
- `isDeleted`: boolean, optional

#### Behavior

- Find operations automatically exclude deleted courses.
- Course creation can resolve prerequisites by either course id or course code.
- Course updates merge new prerequisite state with existing prerequisite records.

---
---

<h2 style="border-bottom: none;">
CourseFaculty
</h2>

Join model between courses and faculties.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `course` | ObjectId | yes | Refers to `Course`. Unique per record. |
| `faculties` | ObjectId[] | no | Array of faculty references. |

#### Purpose

- Stores which faculty members can teach a course.
- Supports adding and removing multiple faculty assignments.

---
---

<h2 style="border-bottom: none;">
Semester Registration
</h2>

Controls the lifecycle of a semester offering window.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `academicSemester` | ObjectId | yes | Refers to `Semester`. Unique. |
| `status` | `upcoming` \| `ongoing` \| `ended` | no | Defaults to `upcoming`. |
| `startDate` | Date | yes | Registration start date. |
| `endDate` | Date | yes | Registration end date. |
| `minCredit` | number | no | Defaults to `3`. |
| `maxCredit` | number | no | Defaults to `15`. |

#### Purpose

- One academic semester can have only one semester registration.
- It controls when offered courses can be created or deleted.

---
---

<h2 style="border-bottom: none;">
Offered Course
</h2>

Scheduled course offering for a specific semester.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `semesterRegistration` | ObjectId | yes | Refers to `SemesterRegistration`. |
| `academicSemester` | ObjectId | yes | Refers to `Semester`. |
| `academicFaculty` | ObjectId | yes | Refers to `AcademicFaculty`. |
| `academicDepartment` | ObjectId | yes | Refers to `AcademicDepartment`. |
| `course` | ObjectId | yes | Refers to `Course`. |
| `faculty` | ObjectId | yes | Refers to `Faculty`. |
| `maxCapacity` | number | yes | Maximum students allowed. |
| `section` | number | yes | Section number. |
| `days` | string[] | no | Days of the week. |
| `startTime` | string | yes | Start time string. |
| `endTime` | string | yes | End time string. |

#### Days Allowed

- `Sat`
- `Sun`
- `Mon`
- `Tue`
- `Wed`
- `Thu`
- `Fri`

#### Purpose

- Couples a course with a semester, faculty member, department, section, and schedule.
- Used as the source record for student enrollment.

---
---
<h2 style="border-bottom: none;">
Enrolled Course
</h2>

Tracks a student’s enrollment and grading progress.

#### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `semesterRegistration` | ObjectId | yes | Refers to `SemesterRegistration`. |
| `academicSemester` | ObjectId | yes | Refers to `Semester`. |
| `academicFaculty` | ObjectId | yes | Refers to `AcademicFaculty`. |
| `academicDepartment` | ObjectId | yes | Refers to `AcademicDepartment`. |
| `course` | ObjectId | yes | Refers to `Course`. |
| `offeredCourse` | ObjectId | yes | Intended ref to offered course record. |
| `faculty` | ObjectId | yes | Refers to `Faculty`. |
| `student` | ObjectId | yes | Refers to `Student`. |
| `isEnrolled` | boolean | no | Defaults to `false`. |
| `courseMarks` | object | no | Nested marks object. |
| `grade` | grade enum | no | Defaults to `N/A`. |
| `gradePoints` | number | no | Defaults to `0`. |
| `isCompleted` | boolean | no | Defaults to `false`. |

#### Embedded Structure: `courseMarks`

- `CT1`: number, default `0`, max `15`
- `CT2`: number, default `0`, max `15`
- `CT3`: number, default `0`, max `15`
- `average`: number, default `0`, max `15`
- `assignment`: number, default `0`, max `5`
- `attendance`: number, default `0`, max `7`
- `presentation`: number, default `0`, max `8`
- `midTerm`: number, default `0`, max `25`
- `finalTerm`: number, default `0`, max `40`

#### Grade Values

Current interface and model logic use these grade labels:

- `A+`
- `A`
- `A-`
- `B+`
- `B`
- `B-`
- `C+`
- `C`
- `D`
- `F`
- `N/A`

#### Purpose

- Captures the student-course link for a semester.
- Stores marks, grade calculation output, and completion state.

---

### Relationship Summary

- `User` is the parent identity for `Student`, `Faculty`, and `Admin`.
- `Student` belongs to one `AcademicDepartment` and one `AcademicSemester`.
- `Faculty` belongs to one `AcademicDepartment`.
- `AcademicDepartment` belongs to one `AcademicFaculty`.
- `Course` can have many prerequisites, and prerequisites are also `Course` records.
- `CourseFaculty` maps one course to many faculty members.
- `SemesterRegistration` belongs to one academic semester.
- `OfferedCourse` belongs to one semester registration and links a course, faculty, department, and academic semester.
- `EnrolledCourse` belongs to one student and one offered course and stores final academic results.

---

### Notes

- The schemas rely heavily on reference population for readable API responses.
- Many documents are soft deleted and filtered out at query time.
- The ERD in [erd.md](erd.md) shows the same relationships visually.
<h1 style="text-align:center">IHAM University Project Details</h1>


IHAM University is a role-based university management backend API built with Node.js, Express, TypeScript, MongoDB, and Mongoose. It is designed to manage the full academic lifecycle of a university, from creating users and academic structures to offering courses, enrolling students, and recording grades.

[Visit quick links](#quick_links)

## What This Project Does

The system handles three main user groups: students, faculty members, and administrators. Each role has a separate profile collection, while a shared user collection manages authentication, authorization, and account status.

At a high level, the backend supports these workflows:

- User login, token refresh, password change, and password reset.
- Creation and management of student, faculty, and admin profiles.
- Setup of academic faculties, departments, and semesters.
- Creation of courses with prerequisites and faculty assignment.
- Registration of academic semesters and scheduling of offered courses.
- Student enrollment into offered courses with capacity and credit checks.
- Faculty grading of enrolled students.

## Problem It Solves

Universities usually need a centralized system to manage academic structure, course offerings, student enrollment, and grading. This project provides that backend foundation through clean modules, secure access control, and a data model that connects all academic entities.

## Main Features

### Authentication

- Login with access and refresh tokens.
- Refresh token flow for long-lived sessions.
- Change password while logged in.
- Forget password and reset password by email link.

### User Management

- Create student, faculty, and admin accounts.
- Upload profile images during account creation.
- Fetch the current authenticated profile.
- Block or unblock users through status updates.

### Academic Setup

- Create and manage academic semesters.
- Create and manage academic faculties.
- Create and manage academic departments.

### Course Management

- Create courses with generated course codes.
- Add or remove prerequisites.
- Assign faculty members to a course.
- Retrieve course-to-faculty mappings.

### Semester and Offering Management

- Register academic semesters with status control.
- Prevent invalid semester state transitions.
- Create offered courses for a specific semester, department, faculty, and section.
- Enforce schedule conflict checks for faculty members.

### Enrollment and Grading

- Let students enroll in available offered courses.
- Enforce semester credit limits.
- Prevent duplicate enrollment and full-section registration.
- Let faculty update marks for enrolled students.
- Automatically compute grades, grade points, and completion status.

## Architecture

The project follows a modular backend architecture:

- Each domain area has its own route, controller, service, model, interface, validation, and constants files where needed.
- Controllers handle request/response flow.
- Services contain the business rules and database operations.
- Models define the MongoDB schemas and relationships.
- Middleware handles authentication, validation, 404 handling, and global error processing.

This separation keeps the codebase readable and makes each module easy to extend.

## Tech Stack

- TypeScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- Zod for validation
- JWT for authentication
- bcrypt for password hashing
- Multer for file upload
- Nodemailer for email delivery

## Core Data Model

The application centers around these collections:

- `User`
- `Student`
- `Faculty`
- `Admin`
- `Semester`
- `AcademicFaculty`
- `AcademicDepartment`
- `Course`
- `CourseFaculty`
- `SemesterRegistration`
- `OfferedCourse`
- `EnrolledCourse`

*[Click here](./models.md) to visit all models with description*

These entities are linked so the application can represent a real university structure instead of isolated records.

## How the Modules Work Together

- A `User` account stores login credentials and role.
- A role-specific profile such as `Student`, `Faculty`, or `Admin` stores personal and academic information.
- A `Student` belongs to an `AcademicDepartment` and an `AcademicSemester`.
- A `Faculty` belongs to an `AcademicDepartment` and teaches one or more courses.
- `AcademicDepartment` belongs to an `AcademicFaculty`.
- `Course` records the academic subject and its prerequisites.
- `SemesterRegistration` controls whether a semester is upcoming, ongoing, or ended.
- `OfferedCourse` publishes a course for a semester, section, day, time, and faculty.
- `EnrolledCourse` stores the actual student registration, marks, and final grading outcome.

## Key Business Rules

- Only valid users can log in or refresh tokens.
- Password reset tokens are short-lived and verified before use.
- A student cannot enroll in the same offered course twice.
- A student cannot exceed the maximum credit load for the semester.
- Faculty members cannot be assigned to overlapping class schedules.
- Semester registrations can only be deleted while upcoming.
- Offered courses can only be changed or deleted while the parent semester is upcoming.
- Grades are computed only after the required mark components are present.

## Intended Audience

This backend is meant for:

- University administrators who need academic setup and account management.
- Faculty members who need course assignment and grading workflows.
- Students who need enrollment and progress tracking.
- Developers who want a clear, modular university backend to extend further.

<h2 id="quick_links">Quick links</h2>

[Requirement analysis](./req_analysis.md) <br>
[All Models](./models.md) <br>
[API Documentation](./docs.md) <br>
[ER Diagram idea](./erd.md) <br>

## Project Outcome

The result is a structured university management backend that supports secure authentication, academic administration, course scheduling, enrollment, and grading through a consistent API and a relational MongoDB data model.
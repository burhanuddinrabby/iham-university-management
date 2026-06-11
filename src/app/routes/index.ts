import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { StudentRoutes } from "../modules/student/student.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/semester.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CourseRoutes } from "../modules/course/course.route";
import { semesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.route";
import { OfferedCourseRoutes } from "../modules/offeredCourse/offeredCourse.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { EnrolledCourseRoutes } from "../modules/enrolledCourse/enrolledCourse.route";

const router = Router();

type TRoute = {
    path: string;
    route: any
}

const moduleRoutes : TRoute[] = [
// const moduleRoutes = [
    {
        path : '/auth',
        route : AuthRoutes
    },
    {
        path : '/users',
        route : UserRoutes
    },
    {
        path : '/students',
        route: StudentRoutes
    },
    {
        path : '/faculties',
        route: FacultyRoutes
    },
    {
        path : '/admins',
        route: AdminRoutes
    },
    {
        path : '/academic-semesters',
        route: AcademicSemesterRoutes
    },
    {
        path: '/academic-faculties',
        route: AcademicFacultyRoutes
    },
    {
        path: '/courses',
        route: CourseRoutes
    },
    {
        path: '/semester-registrations',
        route: semesterRegistrationRoutes
    },
    {
        path: '/offered-courses',
        route: OfferedCourseRoutes
    },
    {
        path: '/academic-departments',
        route: AcademicDepartmentRoutes
    },
    {
        path: '/enrolled-courses',
        route: EnrolledCourseRoutes
    },
]

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
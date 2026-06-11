import { TGrade, TGradePoints } from './enrolledCourse.interface';

export const Grades: TGrade[] = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F', 'N/A']

export const GradePoints: TGradePoints[] = [
    {
        message: 'Outstanding',
        min: 80,
        max: 100,
        point: 4.00,
        grade: 'A+'
    },
    {
        message: 'Excellent',
        min: 75,
        max: 79.99,
        point: 3.75,
        grade: 'A'
    },
    {
        message: 'Very Good',
        min: 70,
        max: 74.99,
        point: 3.50,
        grade: 'A-'
    },
    {
        message: 'Good',
        min: 65,
        max: 69.99,
        point: 3.25,
        grade: 'B+'
    },
    {
        message: 'Satisfactory',
        min: 60,
        max: 64.99,
        point: 3.00,
        grade: 'B'
    },
    {
        message: 'Above Average',
        min: 55,
        max: 59.99,
        point: 2.75,
        grade: 'B-'
    },
    {
        message: 'Average',
        min: 50,
        max: 54.99,
        point: 2.50,
        grade: 'C+'
    },
    {
        message: 'Below Average',
        min: 45,
        max: 49.99,
        point: 2.25,
        grade: 'C'
    },
    {
        message: 'Pass',
        min: 40,
        max: 44.99,
        point: 2.00,
        grade: 'D'
    },
    {
        message: 'Fail',
        min: 0,
        max: 39.99,
        point: 0.00,
        grade: 'F'
    },
]
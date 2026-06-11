import { model, Schema } from "mongoose";
import { TCourse, TCourseFaculty, TPrerequisites } from './course.interface';

const prerequisiteSchema = new Schema<TPrerequisites>({
    course: {
        type: Schema.Types.ObjectId as any,
        ref: 'Course'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const courseSchema = new Schema<TCourse>({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    prefix: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: Number,
        required: true,
        trim: true
    },
    credits: {
        type: Number,
        required: true,
        trim: true
    },
    courseCode: {
        type: String,
        unique: true,
        trim: true
    },
    prerequisites: [prerequisiteSchema],
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    toJSON: {
        virtuals: true
    },
    timestamps: true
});

const courseFacultySchema = new Schema<TCourseFaculty>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        unique: true
    },
    faculties: [{
        type: Schema.Types.ObjectId,
        ref: 'Faculty'
    }]
});

// courseSchema.virtual('courseCode').get(function () {
//     return this.prefix  + (this.code).toString();
// });

courseSchema.pre('find', function (next) {
    this.find({
        isDeleted: {
            $ne: true
        }
    });
    next();
})

courseSchema.pre('findOne', function (next) {
    this.find({
        isDeleted: {
            $ne: true
        }
    });
    next();
})

export const CourseModel = model<TCourse>('Course', courseSchema);
export const CourseFacultyModel = model<TCourseFaculty>('CourseFaculty', courseFacultySchema);
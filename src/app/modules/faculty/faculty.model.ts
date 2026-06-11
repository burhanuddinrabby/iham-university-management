import { model, Schema } from "mongoose";
import { TFaculty, TFacultyModel } from "./faculty.interface";
import { TUsername } from "../student/student.interface";
const userNameSchema = new Schema<TUsername>({
    firstName: {
        type: String,
        required: true,
    },
    middleName: { type: String },
    lastName: {
        type: String,
        required: true,
    },
});
const facultySchema = new Schema<TFaculty, TFacultyModel>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User is required'],
        unique: true,
        ref: 'User'
    },
    name: {
        type: userNameSchema,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: "{VALUE} is not a valid gender"
        },
        required: true
    },
    dateOfBirth: {
        type: Date
    },
    email: {
        type: String,
        unique: [true, "Email is already exists!"],
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    emergencyContactNo: {
        type: String,
        required: true,
    },
    presentAddress: {
        type: String,
        required: true,
    },
    permanentAddress: {
        type: String,
        required: true,
    },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'AcademicDepartment'
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicFaculty'
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']
    },
    profileImg: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
},{
    toJSON: {
        virtuals: true
    },
    timestamps: true
}
);

facultySchema.virtual('fullname').get(function () {
    return this.name?.firstName + (this.name?.middleName ? (' ' + this.name?.middleName) : '') + ' ' + this.name?.lastName;
});

facultySchema.pre('find', function (next) {
    this.find({
        isDeleted: {
            $ne: true
        }
    });
    next();
})
facultySchema.pre('findOne', function (next) {
    this.find({
        isDeleted: {
            $ne: true
        }
    });
    next();
})

facultySchema.statics.isUserExists = async function (id: string) {
    const user = await FacultyModel.findOne({ id });
  return user;
}

export const FacultyModel = model<TFaculty, TFacultyModel>('Faculty', facultySchema);
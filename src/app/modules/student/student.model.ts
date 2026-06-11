import { Schema, model } from 'mongoose';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  TStudentModel,
  TUsername,
} from './student.interface';

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

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: true,
  },
  fatherOccupation: {
    type: String,
    required: true,
  },
  fatherContactNo: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  motherOccupation: String,
  motherContactNo: String,
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const studentSchema = new Schema<TStudent, TStudentModel>({
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
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']
  },
  presentAddress: {
    type: String,
    required: true,
  },
  permanentAddress: {
    type: String,
    required: true,
  },
  guardian: {
    type: guardianSchema,
    required: true
  },
  localGuardian: {
    type: localGuardianSchema,
    required: true
  },
  profileImg: String,
  admissionSemester: {
    type: Schema.Types.ObjectId,
    required: [true, 'Admission Semester is required'],
    ref: 'Semester'
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


studentSchema.virtual('fullname').get(function () {
  // return this.name?.firstName + ' ' + (
  //   this.name?.middleName
  // ) + this.name?.lastName;
  return this.name?.firstName + (this.name?.middleName ? (' ' + this.name?.middleName) : '') + ' ' + this.name?.lastName;
});

//find not deleted students
studentSchema.pre('find', function (next) {
  //filter undeleted students
  this.find({
    isDeleted: {
      $ne: true
    }
  });
  next();
})

studentSchema.pre('findOne', function (next) {
  //filter undeleted students
  this.find({
    isDeleted: {
      $ne: true
    }
  });
  next();
})
// studentSchema.post('findOne', function (doc, next) {
//   doc.password = '';
//   next();
// });

//instance method
/* studentSchema.methods.isUserExists = async function (id: string) {
  const user = await StudentModel.findOne({ id });
  return user;
} */
studentSchema.statics.isUserExists = async function (id: string) {
  const user = await StudentModel.findOne({ id });
  return user;
}

export const StudentModel = model<TStudent, TStudentModel>('Student', studentSchema);

import { model, Schema } from "mongoose";
import { TAcademicSemester } from "./semester.interface";
import { codeMapper, months, semesterCode, semesterName, startEndMonthMapper } from "./semester.constants";
import { NextFunction, Request, Response } from 'express';
import AppError from "../../errors/AppError";

const academicSemesterSchema = new Schema<TAcademicSemester>({
    name: {
        type: String,
        enum: semesterName,
        required: true
    },
    code: {
        type: String,
        enum: semesterCode,
    },
    year: {
        type: String,
        required: true
    },
    startMonth: {
        type: String,
        enum: months,
    },
    endMonth: {
        type: String,
        enum: months,
    }
}, {
    timestamps: true
}
);

academicSemesterSchema.pre("save" as any, async function (next: NextFunction) {
    // check for existing semester with same name and year
    const isSemesterExist = await AcademicSemesterModel.findOne({
        name: this.name,
        year: this.year
    });

    if (isSemesterExist) {
        // return next(new Error('Academic semester already exists'));
        throw new AppError(500, 'Academic semester already exists');
    }


    this.code = codeMapper[this.name] as any;
    this.startMonth = startEndMonthMapper[this.name][0] as any;
    this.endMonth = startEndMonthMapper[this.name][1] as any;

    next();
});

academicSemesterSchema.pre('findOneAndUpdate' as any, async function (this: any, next: NextFunction) {
    //will give the payload to update
    const payload = this.getUpdate();

    // console.log(this.getUpdate());

    if (payload.name && !payload.year) {
        // this.getFiler() returns { _id: '6903da466d7824a1f7858852' }
        const oldData = await AcademicSemesterModel.findOne(this.getFilter());
        if (oldData) {
            payload.year = oldData.year
        }
    } else if (!payload.name && payload.year) {
        const oldData = await AcademicSemesterModel.findOne(this.getFilter());
        if (oldData) {
            payload.name = oldData.name
        }
    }    

    if(payload.name){
        payload.code = codeMapper[payload?.name] as any;
        payload.startMonth = startEndMonthMapper[payload?.name][0] as any;
        payload.endMonth = startEndMonthMapper[payload?.name][1] as any;
        this.setUpdate(payload);
    }

    const isSemesterExist = await AcademicSemesterModel.findOne({
        name: payload.name,
        year: payload.year
    });
    if (isSemesterExist) {
        throw new AppError(500, 'Academic semester already exists');
    }

    next();
})

/* 
academicSemesterSchema.pre('findOneAndUpdate' as any, async function (this: any, next: NextFunction) {
    console.info("this", this.getFilter());
    const update = this.getUpdate() as any;
    const name = update?.name || update?.$set?.name;

    if (name) {
        update.code = codeMapper[name] as any;
        update.startMonth = startEndMonthMapper[name][0] as any;
        update.endMonth = startEndMonthMapper[name][1] as any;
        this.setUpdate(update);
    }
    
    const filter = this.getFilter() as any;
    const isSemesterExist = await AcademicSemesterModel.findOne({
        name: filter.name || name,
        year: filter.year || update?.year || update?.$set?.year
    });

    if (isSemesterExist) {
        return next(new Error('Academic semester already exists'));
    }


    console.log(this);
    next();
})
*/

export const AcademicSemesterModel = model<TAcademicSemester>('Semester', academicSemesterSchema);
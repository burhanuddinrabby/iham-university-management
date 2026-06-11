import { TMonth } from "./semester.interface";

export const semesterName = ['Spring', 'Summer', 'Fall'];

export const semesterCode = ['01', '02', '03']

export const months : TMonth[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const codeMapper: { [key: string]: string } /* map type, key and value both string */ = {
    Spring: '01',
    Summer: '02',
    Fall: '03'
}
export const startEndMonthMapper: { [key: string]: string[] } /* map type, key and value both string */ = {
    Spring: ['January', 'April'],
    Summer: ['May', 'August'],
    Fall: ['September', 'December']
}
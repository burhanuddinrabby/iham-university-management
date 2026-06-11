## User Routes

### POST - `/api/v1/users/create-student`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

Body type: `multipart/form-data`

- `file`: profile image file
- `data`: JSON stringified payload

Example payload:
```json
"file": "FILE UPLOADED BY CLIENT", //Type => FILE
"data": "json stringify data" //Type => Text
```
```json
{
  "password": "...",
  "student": {
    "name": {
      "firstName": "...",
      "middleName": "...",
      "lastName": "..."
    },
    "gender": "male",
    "dateOfBirth": "2000-05-15",
    "email": "...",
    "contactNo": "...",
    "emergencyContactNo": "...",
    "bloodGroup": "B+",
    "presentAddress": "Dhaka, Bangladesh",
    "permanentAddress": "Chittagong, Bangladesh",
    "guardian": {
      "fatherName": "...",
      "fatherOccupation": "...",
      "fatherContactNo": "...",
      "motherName": "...",
      "motherOccupation": "...",
      "motherContactNo": "..."
    },
    "localGuardian": {
      "name": "...",
      "occupation": "...",
      "contactNo": "...",
      "address": "..."
    },
    "profileImg": "VALID IMAGE URL",//only if image is uploaded from frontend and url is generated there
    "admissionSemester": "MONGODB _id",
    "academicDepartment": "MONGODB _id"
  }
}
```
---
### POST - `/api/v1/users/create-faculty`

Protected endpoint for `superAdmin` and `admin`.

Body type: `multipart/form-data`

- `file`: profile image file
- `data`: JSON stringified payload

Example payload:

```json
{
  "password": "...",
  "faculty": {
    "name": {
      "firstName": "...",
      "middleName": "...",
      "lastName": "..."
    },
    "designation": "Lecturer",
    "gender": "male",
    "dateOfBirth": "2000-05-15",
    "email": "...",
    "contactNo": "...",
    "emergencyContactNo": "...",
    "presentAddress": "Dhaka, Bangladesh",
    "permanentAddress": "Chittagong, Bangladesh",
    "academicDepartment": "MONGO _id OF DEPARTMENT",
    "profileImg": "VALID IMAGE URL",//only if image is uploaded from frontend and url is generated there
    "bloodGroup": "A+"
  }
}
```
---
### POST - `/api/v1/users/create-admin`

Protected endpoint for `superAdmin` and `admin`.

Body type: `multipart/form-data`

- `file`: profile image file
- `data`: JSON stringified payload

Example payload:

```json
{
  "admin": {
    "name": {
      "firstName": "...",
      "middleName": "...",
      "lastName": "..."
    },
    "designation": "...",
    "gender": "male",
    "dateOfBirth": "2000-05-15",
    "email": "...",
    "contactNo": "...",
    "emergencyContactNo": "...",
    "presentAddress": "Dhaka, Bangladesh",
    "permanentAddress": "Chittagong, Bangladesh",
    "profileImg": "VALID IMAGE URL",//only if image is uploaded from frontend and url is generated there
    "bloodGroup": "A+"
  }
}
```
---
### POST - `/api/v1/users/change-status/:id`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "status": "in-progress"
}
```
---
### GET - `/api/v1/users/me`

Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

Returns the authenticated user profile.

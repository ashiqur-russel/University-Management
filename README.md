# University Management System

## Overview
The University Management System (UMS) is a full-stack web application designed to manage students, faculty, and administrative processes within a university. 
This system allows students and faculty to manage their profiles, enroll in courses, view grades, and interact with notices and events.
 Administrators have the ability to manage accounts, courses, semesters, sections, and other vital data.

This project encompasses both front-end and back-end development to create a seamless and efficient user experience for all roles: Student, Faculty, and Admin.

## Features

 ### 1. Authentication & Authorization

| **Role**    | **Feature**                                            |
| ----------- | ------------------------------------------------------ |
| **Student** | - Log in and log out securely. <br> - Update password. |
| **Faculty** | - Log in and log out securely. <br> - Update password. |
| **Admin**   | - Log in and log out securely. <br> - Update password. |

 ### 2. Profile Management

| **Role**   | **Feature**                                           |
|------------|-------------------------------------------------------|
| **Student**| - Manage and update personal profile. <br> - Update certain fields. |
| **Faculty**| - Manage and update personal profile. <br> - Update certain fields. |
| **Admin**  | - Manage and update personal profile. <br> - Update certain fields. |

 ### 3. Academic Process Management

| **Role**   | **Feature**                                           |
|------------|-------------------------------------------------------|
| **Student**| - Enroll in courses for a specific semester. <br> - View class schedule. <br> - View grades. <br> - View notice boards and events. |
| **Faculty**| - Manage student grades. <br> - Access student personal and academic information. |
| **Admin**  | - Manage academic semester. <br> - Manage courses. <br> - Manage sections. <br> - Manage rooms. <br> - Manage buildings. |

 ### 4. User Management

| **Role**   | **Feature**                                           |
|------------|-------------------------------------------------------|
| **Student**| - N/A                                                  |
| **Faculty**| - N/A                                                  |
| **Admin**  | - Create, manage, and delete user accounts (students, faculty, admin). <br> - Block/unblock users. <br> - Change user passwords. |


## Data Model

### User

| Field            | Type                | Description                                     |
| ----------------------| -------------- | ----------------------------------------------- |
| `_id`                 | ObjectId       | Unique identifier for the user.                 |
| `id`                  | String         | Generated ID for the user.                      |
| `password`            | String         | User's password.                                |
| `needsPasswordChange` | Boolean        | Flag indicating if password change is needed.   |
| `role`                | String         | User's role (student, faculty, admin).          |
| `status`              | String         | User's status (active, inactive).               |
| `isDeleted`           | Boolean        | Flag indicating if the user is deleted.         |
| `createdAt`           | Date           | Timestamp when the user was created.            |
| `updatedAt`           | Date           | Timestamp when the user was last updated.       |

### Student
| Field                | Type           | Description                                         |
| ---------------------| -------------- | ----------------------------------------------------|
| `_id`                | ObjectId       | Unique identifier for the student.                  |
| `id`                 | String         | Generated ID for the student.                       |
| `name`               | String         | Full name of the student.                           |
| `gender`             | String         | Gender of the student.                              |
| `dateOfBirth`        | Date           | Date of birth of the student.                       |
| `email`              | String         | Email address of the student.                       |
| `contactNo`          | String         | Contact number of the student.                      |
| `emergencyContactNo` | String         | Emergency contact number.                           |
| `presentAddress`     | String         | Current address of the student.                     |
| `permanentAddress`   | String         | Permanent address of the student.                   |
| `guardian`           | String         | Guardian’s name of the student.                     |
| `localGuardian`      | String         | Local guardian’s name.                              |
| `profileImage`       | String         | URL to the student’s profile image.                 |
| `admissionSemester`  | String         | The semester in which the student was admitted.     |
| `isDeleted`          | Boolean        | Flag indicating if the student is deleted.          |
| `createdAt`          | Date           | Timestamp when the student record was created.      |
| `updatedAt`          | Date           | Timestamp when the student record was last updated. |

### Faculty
| Field                | Type       | Description                                                 |
| -------------------- | ---------- | ----------------------------------------------------------- |
| `_id`                | ObjectId   | Unique identifier for the faculty.                          |
| `id`                 | String     | Generated ID for the faculty.                               |
| `designation`        | String     | Faculty’s designation or job title.                         |
| `name`               | String     | Full name of the faculty.                                   |
| `gender`             | String     | Gender of the faculty.                                      |
| `dateOfBirth`        | Date       | Date of birth of the faculty.                               |
| `email`              | String     | Email address of the faculty.                               |
| `contactNo`          | String     | Contact number of the faculty.                              |
| `emergencyContactNo` | String     | Emergency contact number.                                   |
| `presentAddress`     | String     | Current address of the faculty.                             |
| `permanentAddress`   | String     | Permanent address of the faculty.                           |
| `profileImage`       | String     | URL to the faculty’s profile image.                         |
| `academicFaculty`    | String     | Faculty's academic faculty (e.g., Science, Arts).           |
| `academicDepartment` | String     | Faculty's academic department.                              |
| `isDeleted`          | Boolean    | Flag indicating if the faculty is deleted.                  |
| `createdAt`          | Date       | Timestamp when the faculty record was created.              |
| `updatedAt`          | Date       | Timestamp when the faculty record was last updated.         |

### Admin
| Field                    | Type       | Description                                                    |
| ------------------------ | ---------- | -------------------------------------------------------------- |
| `_id`                    | ObjectId   | Unique identifier for the admin.                               |
| `id`                     | String     | Generated ID for the admin.                                    |
| `designation`            | String     | Admin's designation or job title.                              |
| `name`                   | String     | Full name of the admin.                                        |
| `gender`                 | String     | Gender of the admin.                                           |
| `dateOfBirth`            | Date       | Date of birth of the admin.                                    |
| `email`                  | String     | Email address of the admin.                                    |
| `contactNo`              | String     | Contact number of the admin.                                   |
| `emergencyContactNo`     | String     | Emergency contact number.                                      |
| `presentAddress`         | String     | Current address of the admin.                                  |
| `permanentAddress`       | String     | Permanent address of the admin.                                |
| `profileImage`           | String     | URL to the admin’s profile image.                              |
| `managementDepartment`   | String     | Admin’s management department.                                 |
| `isDeleted`              | Boolean    | Flag indicating if the admin is deleted.                       |
| `createdAt`              | Date       | Timestamp when the admin record was created.                   |
| `updatedAt`              | Date       | Timestamp when the admin record was last updated.              |




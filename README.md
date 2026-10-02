# Campus Resource Booking System

A centralized web-based **Campus Resource Booking System** built using the MERN stack. The platform allows students and faculty to search campus resources, check real-time availability, submit booking requests, and track their booking status through a centralized system.

---

## 🏛️ Project Abstract

Efficient management and utilization of campus resources such as classrooms, computer labs, seminar halls, sports facilities, and equipment are essential for the smooth functioning of an educational institution.

This **Campus Resource Booking System** is a centralized web-based MERN stack platform that eliminates double-bookings, reduces manual coordination, provides visual slot availability checking, and streamlines administrative approval workflows.

---

## 🚀 Tech Stack

- **Database:** MongoDB / MongoDB Atlas (Mongoose ODM)
- **Backend Framework:** Node.js + Express.js
- **Authentication:** Role-Based Access Control (RBAC) with JWT & Bcrypt password hashing
- **Frontend Framework:** React.js (Vite)
- **Styling:** Tailwind CSS & Lucide Icons
- **HTTP Client:** Axios with auto-bearer auth interceptors

---

## 🧩 Core Modules

### 1. User Authentication & Role Management

- Secure registration and login supporting **Student**, **Faculty**, and **Admin** roles.
- Protected routes and JWT authentication.
- Role-based access control for different system functionalities.
- Demo login options for quick evaluation.

### 2. Resource Management

The system provides a centralized campus facility catalog containing:

- Resource Name
- Code / Room Number
- Category
- Location / Building
- Capacity
- Amenities
- Operational Status

Supported resource categories include:

- Classrooms
- Computer Labs
- Seminar Halls
- Sports Facilities
- Equipment

Admins can:

- Add resources
- Edit resources
- Delete resources
- Change resource availability/status

### 3. Resource Search & Availability

Users can search and filter campus resources based on:

- Resource name
- Resource code
- Location
- Amenities
- Resource category

The system also provides an **Interactive Time-Slot Availability Filter** where users can select:

- Date
- Start Time
- End Time

and immediately identify available resources.

An **Hourly Schedule Timeline** displays resource availability throughout the day with available and booked time slots.

### 4. Booking Request & Conflict Check

Users can submit booking requests by selecting:

- Date
- Start Time
- End Time
- Purpose
- Expected Attendees

The backend includes a conflict detection mechanism using interval overlap checking:

```text
max(start1, start2) < min(end1, end2)
This prevents double-booking of the same resource for overlapping reservations.
The system also validates the requested number of attendees against the resource capacity.
5. Approval / Rejection Workflow
Administrators have a dedicated booking approval interface that displays:
- Requester name
- Roll Number / ID
- Department
- Role
- Requested resource
- Date and time
- Purpose
- Expected attendees
The administrator can:
- Approve booking requests
- Reject booking requests
- Provide remarks or instructions
The booking status is updated in the database and the requester receives an in-app notification.
6. Notifications & Booking History
The system provides an in-app notification center with unread notification indicators.
Users receive notifications for:
- Booking submission
- Booking approval
- Booking rejection
- Other booking status updates
The My Bookings section allows users to view their complete booking history with status filters:
- Pending
- Approved
- Rejected
- Cancelled
Users can also cancel their own booking requests where applicable.

🛠️ How to Run the Project
1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or MongoDB Atlas
- Git
MongoDB can be configured using:
mongodb://127.0.0.1:27017

or a MongoDB Atlas connection string stored in backend/.env.
2. Backend Setup
cd backend
npm install
npm run seed
npm run dev

The backend server will start on:
http://localhost:5000

3. Frontend Setup
Open another terminal:
cd frontend
npm install
npm run dev

Open the application in your browser using the URL displayed by Vite.
📡 REST API Summary
Method	Endpoint	Access	Description
POST	/api/auth/register	Public	Register a new user
POST	/api/auth/login	Public	Authenticate user and receive JWT
GET	/api/auth/me	Private	Get logged-in user profile
GET	/api/resources	Public	List and search facilities
GET	/api/resources/:id	Public	Get facility details and schedule
POST	/api/resources/:id/check-availability	Public	Check resource availability
POST	/api/resources	Admin	Create a campus facility
PUT	/api/resources/:id	Admin	Update facility details
DELETE	/api/resources/:id	Admin	Remove a facility
POST	/api/bookings	Private	Submit a booking request
GET	/api/bookings/my	Private	Get user's booking history
GET	/api/bookings	Admin	View all bookings
PUT	/api/bookings/:id/status	Admin	Approve or reject booking
PUT	/api/bookings/:id/cancel	Private	Cancel user's booking
GET	/api/notifications	Private	Get notifications
PUT	/api/notifications/read-all	Private	Mark notifications as read
GET	/api/stats	Admin	View campus booking statistics


🔐 Environment Variables
Sensitive configuration such as MongoDB credentials and JWT secrets are stored in environment variables.
Create:
backend/.env

Example:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Do not commit .env to GitHub.
The project .gitignore is configured to exclude environment files and dependencies.
📁 Project Structure
Campus-Resource-Booking-System/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

🎯 Key Features
- 🔐 Role-based authentication
- 👨‍🎓 Student and faculty booking
- 👨‍💼 Admin booking approval
- 🏫 Centralized campus resource management
- 🔎 Resource search and filtering
- 🕒 Time-slot availability checking
- 🚫 Double-booking prevention
- 📅 Booking history
- 🔔 In-app notifications
- 📊 Admin analytics
- 📱 Responsive user interface
- ☁️ MongoDB Atlas support

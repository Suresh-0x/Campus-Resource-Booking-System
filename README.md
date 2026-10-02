# Campus Resource Booking System

**Hackathon Project MVP | Team: O6**

| Member Name | Roll Number / ID | Contribution |
| :--- | :--- | :--- |
| **J. Suresh** | `24A81A0578` | Full Stack Development & State Management |
| **N. Pavan** | `25A81A43H7` | Backend API Architecture & Database Design |
| **P. Nirish** | `25A81A61H1` | Frontend Interface & Interactive Components |
| **SK. Naseem** | `IT-253` | Conflict Resolution Logic & System Integration |

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

## 🧩 Core Modules Built (Per Project Specification)

### 1. User Authentication & Role Management
- Secure registration and login supporting **Student**, **Faculty**, and **Admin** roles.
- Protected routes and JWT tokens stored in localStorage.
- Instant 1-click **Demo Role Switcher** in the top navigation bar for judges and evaluators.

### 2. Resource Management
- Comprehensive campus facility catalog with details:
  - Resource Name, Code/Room Number (e.g. `AUD-01`, `LAB-301`), Category (`classroom`, `lab`, `seminar_hall`, `sports`, `equipment`), Location/Building, Capacity (seats), Amenities (Projector, AC, Wi-Fi, Workstations), Image, and Operational Status (`active`, `maintenance`, `inactive`).
- Admin interface to **Add**, **Edit**, **Delete**, and toggle status of any campus facility.

### 3. Resource Search & Availability
- Dynamic multi-keyword search across names, codes, locations, and amenities.
- Quick filter pills by facility category.
- **Interactive Time-Slot Availability Filter**: Select a date and start/end time to immediately see which facilities are free or occupied.
- **Hourly Schedule Timeline**: Visual daily timeline showing hourly slots (08:00 - 20:00) with color-coded "Available" vs "Booked" statuses.

### 4. Booking Request & Conflict Check
- Intuitive booking modal allowing users to choose Date, Start Time, End Time, Purpose, and Expected Attendees.
- **Real-Time Backend Conflict Engine**: Mathematical interval overlap detection (`max(s1, s2) < min(e1, e2)`) that strictly prevents double-booking the same facility for approved or pending reservations.
- Validates capacity limits against requested attendee count.

### 5. Approval / Rejection Workflow
- Dedicated **Admin Approvals Queue** displaying pending reservation requests with requester details (Name, Roll No, Department, Role).
- Admin can **Approve** (with pickup/access instructions) or **Reject** (with reason).
- Updates status in MongoDB and instantly triggers status alerts to the requester.

### 6. In-App Notifications & Booking History
- In-app notification center with real-time unread badges.
- Requester is notified upon submission, approval, or rejection.
- **My Bookings History** page with status filters (Pending, Approved, Rejected, Cancelled) and cancellation functionality.

---

## 🔑 Pre-Seeded Demo Accounts

You can log in directly using the 1-click demo buttons in the UI or manually using these credentials:

| Role | Name | Email | Password | Roll No / ID |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Dr. Ramesh Kumar | `admin@campus.edu` | `admin123` | `ADM-001` |
| **Faculty** | Prof. N. Pavan | `faculty@campus.edu` | `faculty123` | `25A81A43H7` |
| **Student** | J. Suresh | `student@campus.edu` | `student123` | `24A81A0578` |
| **Student** | P. Nirish | `nirish@campus.edu` | `student123` | `25A81A61H1` |
| **Student** | SK. Naseem | `naseem@campus.edu` | `student123` | `IT-253` |

---

## 🛠️ How to Run the Project

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI set in `backend/.env`.

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds demo users, facilities, reservations, and alerts
npm run dev      # Starts API server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts React Vite client on http://localhost:3000
```

Open `http://localhost:3000` in your web browser.

---

## 📡 REST API Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user with role |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/auth/me` | Private | Get profile of logged-in user |
| `GET` | `/api/resources` | Public | List & search facilities with slot availability check |
| `GET` | `/api/resources/:id` | Public | Get facility details and schedule for a date |
| `POST` | `/api/resources/:id/check-availability` | Public | Check if a specific slot is free |
| `POST` | `/api/resources` | Admin | Create a new campus facility |
| `PUT` | `/api/resources/:id` | Admin | Update facility details |
| `DELETE` | `/api/resources/:id` | Admin | Remove facility |
| `POST` | `/api/bookings` | Private | Submit new booking request (with conflict check) |
| `GET` | `/api/bookings/my` | Private | Get logged-in user's booking history |
| `GET` | `/api/bookings` | Admin | View all bookings across campus |
| `PUT` | `/api/bookings/:id/status` | Admin | Approve or reject booking with remarks |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel user's own booking |
| `GET` | `/api/notifications` | Private | Get in-app alerts and unread count |
| `PUT` | `/api/notifications/read-all`| Private | Mark all alerts as read |
| `GET` | `/api/stats` | Admin/Faculty | Campus facility utilization metrics |

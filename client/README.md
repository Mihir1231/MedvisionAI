MEDICAL_1

A full-stack medical web application built using React, TypeScript, Vite on the frontend and Node.js, Express, and MongoDB on the backend.

Project Overview

MEDICAL_1 is a scalable full-stack healthcare application designed for medical systems such as authentication portals, dashboards, and data management platforms.
The project follows clean architecture principles for both frontend and backend.

Tech Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
shadcn-ui
Backend
Node.js
Express.js
MongoDB
Mongoose
dotenv

Project Structure
MEDICAL_1/
│
├── client/                     # Frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── types/
│       ├── App.tsx
│       └── main.tsx
│
├── backend/                    # Backend
│   ├── config/                 # Database & app configuration
│   ├── controllers/            # Request handling logic
│   ├── models/                 # Database schemas
│   ├── routes/                 # API routes
│   ├── server.js               # Server entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
└── README.md

Getting Started
Prerequisites

Node.js (v18 or later)

npm

Frontend Setup
cd client
npm install
npm run dev


Frontend runs at:

http://localhost:5173

Backend Setup
cd backend
npm install
node server.js


Backend runs at:

http://localhost:5000

Environment Variables

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string

Build

Frontend production build:

cd client
npm run build

License
MIT License

Author
NexGenNinjas
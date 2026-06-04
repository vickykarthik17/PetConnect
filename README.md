# PetConnect
🐾 PetConnect – Adopt. Care. Connect.
PetConnect is a full-stack web application that connects pet lovers with pets in need of adoption. It allows users to browse available pets, view their details, and reach out to shelters or individuals for adoption inquiries — all in a smooth and user-friendly interface.

🚀 Features
🐶 Pet Listings: View adoptable pets with images, descriptions, and details

👤 User Authentication: Sign up/login to access features (adoption, posting pets)

🏠 Post a Pet: Let shelters or individuals list pets for adoption

🔎 Search and Filter: Find pets by location, breed, age, and more

📨 Contact Owners: Express interest and connect directly

🛠️ Tech Stack
Frontend: React.js (Hosted on Vercel)

Backend: Spring Boot (Java – Hosted on Render)

Database: MongoDB Atlas

API Communication: RESTful APIs using Spring controllers

Authentication: JWT-based authentication system

Deployment: Vercel (Frontend), Render (Backend)

📁 Project Goals
Create a platform that supports pet adoption with minimal friction

Practice building a real-world full-stack application

Leverage modern deployment tools (Vercel, Render, MongoDB Atlas)

Build and consume RESTful APIs in a scalable and secure way

🧑‍💻 How to Run Locally
1. Frontend

->cd frontend
->npm install
->npm start
(or)
->npm run:frontend

3. Backend 
->cd backend
->npm run:backend
# Configure your MongoDB URI in application.properties
./mvnw spring-boot:run
#run Backend and frontend separately and make sure you have mongodb connection string attached to your .env file
#Also make sure MongoDB is running

# Ecommerce Full-Stack Application

## Project Overview
A modern, full-stack E-commerce web application featuring a classic Amazon-style structural layout, robust JWT authentication, Google OAuth 2.0 Single Sign-On (SSO), and extensive Role-Based Access Control (RBAC).

**Technologies Used:**
- **Frontend**: React (Create React App), React Router Dom, Axios
- **Backend**: Java 17, Spring Boot 3.x, Spring Security (JWT + OAuth2)
- **Database**: MySQL 8.0 (Dockerized)

---

## Setup Steps

### Prerequisites
- Node.js (v16+)
- Java 17+ and Maven
- Docker (for MySQL database)
- Google Cloud Console Account (for OAuth2 credentials)

### 1. Database Setup
A `docker-compose.yml` is provided to spin up a local MySQL instance on port 3307 quickly:
```bash
cd ecommerce-app-backend
docker-compose up -d
```

### 2. Backend Setup
The backend uses Maven. It will automatically seed two users (`admin` / `password` and `user` / `password`) and sample products on the first run.
```bash
cd ecommerce-app-backend
./mvnw clean install
./mvnw spring-boot:run
```
The backend will be running on `http://localhost:8080`.

### 3. Frontend Setup
The frontend is built with React.
```bash
cd ecommerce-app-frontend
npm install
npm start
```
The frontend will be running on `http://localhost:3000`.

---

## API Details

### Authentication & Profile APIs
- **`POST /api/auth/login`** - Authenticate using username and password. Returns a JWT.
- **`POST /api/auth/register`** - Create a standard user account.
- **`GET /api/profile`** - Get logged-in user profile details (Requires JWT).
- **`PUT /api/profile`** - Update profile information (Requires JWT).
- **`PUT /api/profile/change-password`** - Change the current user password (Requires JWT).

### Product Management APIs
- **`GET /api/products`** - View all products (Public/Authenticated).
- **`POST /api/products`** - Add a new product (**ADMIN ONLY**).
- **`PUT /api/products/{id}`** - Update an existing product (**ADMIN ONLY**).
- **`DELETE /api/products/{id}`** - Delete a product (**ADMIN ONLY**).

---

## SSO Configuration

This application supports Single Sign-On (SSO) using Google OAuth 2.0.

### 1. Obtain Google Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and navigate to **APIs & Services > Credentials**.
3. Create **OAuth 2.0 Client IDs**.
4. Add the authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`

### 2. Configure Backend
Update the `application.properties` file located in `ecommerce-app-backend/src/main/resources` with your newly created Client ID and Secret:

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

### 3. How it Works
- The frontend Login page provides a "Sign in with Google" button.
- Clicking it redirects the user to `http://localhost:8080/oauth2/authorization/google`.
- Upon successful Google authentication, the Spring Security `OAuth2RedirectHandler` generates a standard JWT for the app.
- The user is seamlessly redirected back to `http://localhost:3000/oauth2/redirect?token=YOUR_JWT_TOKEN`, logging them into the React application.

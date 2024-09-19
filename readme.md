# CrapR API Documentation

---

## 1. Introduction

### 1.1 Project Overview

CrapR is a RESTful API built using Node.js, Express.js, MongoDB, and Mongoose. It serves as a proof of concept for a fictitious application that allows users to list items (referred to as "crap") they no longer need, enabling other users to claim them. The API facilitates the entire lifecycle of an item—from listing and expressing interest to finalizing the exchange.

### 1.2 Motivation and Goals

The project aims to:

- **Demonstrate Full-Stack Development Skills**: Show proficiency in building a backend API with robust authentication and data management.
- **Implement Real-World Features**: Include user authentication via Google OAuth, JWT token generation, and secure CRUD operations.
- **Showcase Problem-Solving Abilities**: Handle complex workflows like buyer-seller interactions and status transitions.

### 1.3 Key Features

- **User Authentication**: Secure login using Google OAuth and JWT tokens.
- **CRUD Operations**: Create, read, update, and delete operations for "crap" items.
- **Buyer-Seller Workflow**: Manage the lifecycle of an item through various statuses like AVAILABLE, INTERESTED, and FLUSHED.
- **Secure Data Handling**: Input sanitization, error handling, and protection against common web vulnerabilities.
- **Geo-Location Search**: Find items based on text search and proximity to a given location.

---

## 2. Getting Started

### 2.1 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas)
- **npm** (Node Package Manager)
- **Google Cloud Account** (for OAuth credentials)

### 2.2 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/boug0035/crapr-api.git
cd crapr-api
```

#### 2. Install Dependencies:

```bash
yarn install
```

#### 3. Set Up Environment Variables:

Create a .env file in the root directory and add:

```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2.3 Running the Application

- Start the Server:
  ```
  yarn dev
  ```
- Accessing the API:
  The API will be accessible at http://localhost:3000.

---

## 3. API Documentation

### 3.1 Authentication

- **Login Endpoint**:

  ```http
  GET /auth/google?redirect_url=your_redirect_url
  ```

  Redirects the user to Google OAuth consent screen.

- **Callback Endpoint**:
  ```http
  GET /auth/google/callback
  ```
  Handles Google's response and redirects to the provided redirect_url with a JWT token.

### 3.2 Endpoints Overview

- **Crap Management**:

  - **GET /api/crap** - List all available crap.
  - **GET /api/crap/:id** - Get details of a specific crap.
  - **POST /api/crap** - Create new crap.
  - **PUT /api/crap/:id** - Replace an existing crap.
  - **PATCH /api/crap/:id** - Update specific fields of a crap.
  - **DELETE /api/crap/:id** - Remove a crap.

- **Buyer-Seller Interactions**:
  - **POST /api/crap/:id/interested** - Express interest in a crap.
  - **POST /api/crap/:id/suggest** - Seller suggests pickup details.
  - **POST /api/crap/:id/agree** - Buyer agrees to the suggestion.
  - **POST /api/crap/:id/disagree** - Buyer disagrees with the suggestion.
  - **POST /api/crap/:id/reset** - Reset the crap status.
  - **POST /api/crap/:id/flush** - Seller marks the crap as taken.

### 3.3 Endpoint Details

#### 3.3.1 List All Crap

- **URL**: /api/crap
- **Method**: GET
- **Headers**:

  ```
  Authorization: Bearer <JWT Token>
  ```

- **Query Parameters**:

  - **query** (string): Text search query.
  - **lat** (number): Latitude for location-based search.
  - **long** (number): Longitude for location-based search.
  - **distance** (number): Max distance in meters.
  - **show_taken** (boolean): Include items not available.

- **Response**:
  ```json
  {
    "data": [
      {
        "_id": "641f45cc4de5a0f56bbc702e",
        "title": "Vintage Lamp",
        "description": "An old but functional lamp.",
        "images": [
          "https://storage.googleapis.com/craptracker-images/lamp.png"
        ],
        "status": "AVAILABLE",
        "owner": {
          "_id": "66136751ed1aed6ce50e1d92",
          "name": "Alice"
        },
        "createdAt": "2024-04-09T20:39:56.459Z",
        "updatedAt": "2024-04-09T20:39:56.459Z"
      }
    ]
  }
  ```
- **Notes**:
  - Sensitive information like **location**, **buyer**, and **suggestion** are omitted.
  - **owner** is populated with the user's name only.

#### 3.3.2 Get Crap Details

- **URL**: /api/crap/:id
- **Method**: GET
- **Headers**:
  ```
  Authorization: Bearer <JWT Token>
  ```
- **Response (If Authorized)**:

  ```json
  {
    "data": {
      "_id": "641f45cc4de5a0f56bbc702e",
      "title": "Vintage Lamp",
      "description": "An old but functional lamp.",
      "images": ["https://storage.googleapis.com/craptracker-images/lamp.png"],
      "status": "INTERESTED",
      "owner": {
        "_id": "66136751ed1aed6ce50e1d92",
        "name": "Alice"
      },
      "buyer": {
        "_id": "77136751ed1aed6ce50e1d93",
        "name": "Bob"
      },
      "location": {
        "type": "Point",
        "coordinates": [-73.5673, 45.5017]
      },
      "suggestion": {
        "address": "123 Main St, Montreal, QC",
        "date": "2024-04-15",
        "time": "14:00"
      },
      "createdAt": "2024-04-09T20:39:56.459Z",
      "updatedAt": "2024-04-10T15:22:30.123Z"
    }
  }
  ```

- **Notes**:
  - Sensitive information is only included if the requester is the **owner** or **buyer**.

### 3.4 Error Handling

- **Unauthenticated Access**:

  - **Status**: 401 Unauthorized
  - **Response**:

    ```json
    {
      "error": "Unauthenticated"
    }
    ```

- **Resource Not Found**:

  - **Status**: 404 Not Found
  - **Response**:

    ```json
    {
      "error": "Crap with id [id] not found"
    }
    ```

- **Bad Request**:

  - **Status**: 400 Bad Request
  - **Response**:

    ```json
    {
      "error": "Invalid input data"
    }
    ```

---

## 4. Data Models

### 4.1 Database Schema

- **Collections**:
  - users
  - craps
- **Relationships**:
  - Each **crap** document references an **owner** and optionally a **buyer**, both from the **users** collection.

### 4.2 Model Definitions

User Model

- **Fields**:
  - **name** (String): User's name from Google.
  - **googleId** (String): Unique identifier from Google OAuth.
  - **createdAt** (Date): Timestamp of creation.
  - **updatedAt** (Date): Timestamp of last update.

Crap Model

- **Fields**:
  - **title** (String): Title of the item.
  - **description** (String): Description of the item.
  - **images** (Array of Strings): URLs to item images.
  - **status** (String): Current status (e.g., AVAILABLE).
  - **owner** (ObjectId): Reference to the owning User.
  - **buyer** (ObjectId): Reference to the buying User (optional).
  - **location** (Embedded Document): GeoJSON Point schema.
  - **suggestion** (Embedded Document): Suggested pickup details.
  - **createdAt** (Date): Timestamp of creation.
  - **updatedAt** (Date): Timestamp of last update.

---

## 5. Project Architecture

### 5.1 Folder Structure

```lua
crapr-api/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── config/
├── tests/
├── app.js
├── package.json
└── README.md
```

### 5.2 Design Patterns

- **MVC Architecture**: Separation of concerns by organizing code into Models, Views, and Controllers.
- **Middleware Pattern**: Reusable middleware functions for authentication, error handling, and input sanitization.

### 5.3 Middleware and Utilities

- **Authentication Middleware**: Verifies JWT tokens and attaches user info to requests.
- **Error Handling Middleware**: Catches and formats errors before sending responses.
- **Input Sanitization**: Protects against XSS and query injection attacks.

---

## 6. Technology Stack

### 6.1 Back-End Framework

- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.

### 6.2 Database

- **MongoDB**: NoSQL database for scalable and flexible data storage.
- **Mongoose**: ODM for MongoDB to model application data.

### 6.3 Additional Libraries and Tools

- **Passport.js**: Authentication middleware for Node.js.
- **JSON Web Tokens (JWT)**: For secure token-based authentication.
- **Google OAuth 2.0**: User authentication via Google accounts.
- **Cors**: Middleware for handling Cross-Origin Resource Sharing.
- **dotenv**: Loads environment variables from a .env file.

---

## 7. Testing

### 7.1 Testing Frameworks

- **Mocha**: JavaScript test framework running on Node.js.
- **Jest**: Assertion library for Node.js and the browser.

### 7.2 Running Tests

- **Execute Test Suites**:
  ```bash
  yarn test
  ```

### 7.3 Test Coverage

- **Unit Tests**: Cover individual functions and middleware.
- **Integration Tests**: Test API endpoints and database interactions.

---

## 8. Deployment

### 8.1 Deployment Platform

- **Render**: Cloud platform for hosting the API.

### 8.2 Continuous Integration/Deployment

- **CI/CD Pipeline**: Configured to automatically deploy on new commits to the main branch.

### 8.3 Environment Variables and Configurations

- Ensure the following variables are set in the production environment:

  - **MONGODB_URI**
  - **JWT_SECRET**
  - **GOOGLE_CLIENT_ID**
  - **GOOGLE_CLIENT_SECRET**

- **Google Cloud Credentials**:
  - Update Authorized JavaScript origins and redirect URIs to match production URLs.

---

## 1. Appendices

### 12.1 References

- **Express.js Documentation**: expressjs.com
- **MongoDB Documentation**: docs.mongodb.com
- **Passport.js Documentation**: passportjs.org
- **Google Cloud Storage Documentation**: https://cloud.google.com/storage/docs

### 12.2 Licenses

    This project is licensed under the MIT License.

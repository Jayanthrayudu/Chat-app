# Relay – Real-Time Chat Application

A full-stack real-time chat platform built with **React** and **Spring Boot**. Relay lets users register securely, chat one-to-one or in groups, see who is online, and receive messages instantly over WebSockets.

![Relay Preview](../chatapp/chatapp-frontend/src/{assets/screenshots/direct-chat.png)

## Demo

**Live Application:** https://chat-app-frontend-q4oc.onrender.com/

> The app is hosted on Render's free tier, so the first request may take a short while if the service has gone idle.

Deployed using:

- Frontend: Render
- Backend: Render
- Database: PostgreSQL
- Reverse Proxy: Nginx
- Containerization: Docker

## Screenshots

| Register | Login |
| :---: | :---: |
| ![Register](../chatapp/chatapp-frontend/src/{assets/screenshots/login.png) | ![Login](../chatapp/chatapp-frontend/src/{assets/screenshots/register.png) |

| Conversations | Create Group |
| :---: | :---: |
| ![Conversations](../chatapp/chatapp-frontend/src/{assets/screenshots/conversation.png) | ![Create Group](../chatapp/chatapp-frontend/src/{assets/screenshots/creategroup.png) |

| Direct Chat | Edit Message |
| :---: | :---: |
| ![Direct Chat](../chatapp/chatapp-frontend/src/{assets/screenshots/direct-chat.png) | ![Edit Message](../chatapp/chatapp-frontend/src/{assets/screenshots/editmessage.png) |

| Delete Message |
| :---: |
| ![Delete Message](../chatapp/chatapp-frontend/src/{assets/screenshots/deletemessage.png) |

## Features

### Authentication & Security

- User registration with username, email and password
- JWT based login and session handling
- Show / hide password toggle on login
- Protected routes on the frontend
- Secured REST endpoints and JWT-authenticated WebSocket connections
- Sender identity is taken from the JWT on the server, never from the client

### Real-Time Messaging

- Instant one-to-one (direct) messaging
- Group chats with multiple members
- Live connection status indicator (Connected / Disconnected)
- Real-time delivery using WebSocket with STOMP and SockJS
- Personal notification queue so new messages update the conversation list and show a toast even when the room is not open
- Emoji picker in the message input
- Sent message status indicator

### Message Management

- Edit your own messages inline
- Delete messages with a confirmation dialog
- Paginated message history (loads 30 messages per page by default)
- Last message preview in the conversation list

### Conversations & Groups

- Search users by username and start a private chat instantly
- Create groups with a custom name and searchable member selection
- Add members to an existing group
- Remove members or leave a group
- Delete a chat room
- Room details panel showing chat info and member list

### User Presence

- Online / offline status shown on conversations and in the chat header
- Per-member presence in the room details panel

### UI / UX

- Modern dark theme styled with Tailwind CSS
- Three-panel layout: conversations, chat window, room details
- Modals, toasts, loaders and error messages for clear feedback

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- STOMP.js
- SockJS
- Axios
- React Router
- Context API + custom hooks

### Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring WebSocket (STOMP)
- Spring Data JPA
- Maven

### Database

- PostgreSQL

### Deployment & DevOps

- Docker & Docker Compose
- Nginx
- Render

## System Architecture

```
┌──────────────────┐   HTTPS (REST) / WSS   ┌─────────┐        ┌────────────────────┐        ┌────────────┐
│   React Client   │ ─────────────────────► │  Nginx  │ ─────► │    Spring Boot     │ ─────► │ PostgreSQL │
│ Vite + Tailwind  │ ◄───────────────────── │ (Proxy) │ ◄───── │ REST + WebSocket   │ ◄───── │            │
│ STOMP + SockJS   │                        └─────────┘        └────────────────────┘        └────────────┘
└──────────────────┘
```

**How it works**

1. The user registers or logs in through the REST API and receives a JWT.
2. The JWT secures all REST requests and is validated during the WebSocket handshake.
3. Messages are sent over STOMP to `/app/chat.send`.
4. The server saves the message, broadcasts it to `/topic/room/{roomId}`, and pushes a notification to every other participant on `/user/queue/notifications`.

## Project Structure

```
chatapp/
├── chat-app/                  # Spring Boot backend
│   ├── src/main/java/com/chat_app/
│   │   ├── config/            # App, CORS, Jackson, WebSocket config
│   │   ├── constants/
│   │   ├── controller/        # REST & WebSocket controllers
│   │   ├── dto/               # Request / response objects
│   │   ├── exception/         # Global exception handling
│   │   ├── mapper/
│   │   ├── model/             # JPA entities
│   │   ├── repository/
│   │   ├── security/          # JWT filter, service, WebSocket auth
│   │   ├── service/
│   │   ├── util/
│   │   ├── websocket/         # Presence & event listeners
│   │   └── ChatAppApplication.java
│   ├── src/main/resources/application.properties
│   ├── Dockerfile
│   ├── mvnw / mvnw.cmd
│   └── pom.xml
│
├── chatapp-frontend/          # React frontend
│   ├── src/
│   │   ├── components/        # auth, chat, common, layout
│   │   ├── context/           # AuthContext, ChatContext
│   │   ├── hooks/             # useAuth, useChat, useWebSocket
│   │   ├── pages/             # Login, Register, Chat, Profile, NotFound
│   │   ├── services/          # API & WebSocket services
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf.template
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── screenshots/               # README images
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Git
- Java 17 or higher
- Node.js 18 or higher and npm
- PostgreSQL 14+ (or Docker)
- Docker & Docker Compose (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/Jayanthrayudu/Chat-app.git
cd chatapp
```

### 2. Set Up the Database

Create a PostgreSQL database:

```sql
CREATE DATABASE chatapp;
```

### 3. Run the Backend

Open `chat-app/src/main/resources/application.properties` and configure it:

```properties
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/chatapp
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update

jwt.secret=your_long_random_secret_key
jwt.expiration=86400000
```

Start the server. These commands use the bundled Maven wrapper, so no separate Maven install is needed. They work in the integrated terminal of **VS Code**, **IntelliJ IDEA** or **STS**.

**Windows (PowerShell / CMD):**

```bash
cd chat-app
mvnw.cmd spring-boot:run
```

**macOS / Linux / Git Bash:**

```bash
cd chat-app
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`. Verify it with:

```bash
curl http://localhost:8080/api/health
```

**Running from an IDE instead:**

- **IntelliJ IDEA / STS:** open the `chat-app` folder as a Maven project and run `ChatAppApplication.java`.
- **VS Code:** install the *Extension Pack for Java* and *Spring Boot Extension Pack*, then run `ChatAppApplication.java` from the Spring Boot Dashboard.

### 4. Run the Frontend

Create `chatapp-frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
```

Install dependencies and start the dev server:

```bash
cd chatapp-frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

> To test real-time chat, register two users and log in with each in a different browser or an incognito window.


## API Documentation

All endpoints except register, login and health require the header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication – `/api/auth`

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new user            |
| POST   | `/api/auth/login`    | Login and receive a JWT        |
| GET    | `/api/auth/me`       | Get the current logged-in user |

### Users – `/api/users`

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/api/users`                  | Get all users            |
| GET    | `/api/users/search?username=` | Search users by username |
| GET    | `/api/users/{id}`             | Get a user by ID         |

### Chat Rooms – `/api/chat-rooms`

| Method | Endpoint                                     | Description                              |
| ------ | -------------------------------------------- | ---------------------------------------- |
| POST   | `/api/chat-rooms`                            | Create a chat room / group               |
| GET    | `/api/chat-rooms`                            | Get all chat rooms of the current user   |
| GET    | `/api/chat-rooms/{id}`                       | Get a chat room by ID                    |
| DELETE | `/api/chat-rooms/{id}`                       | Delete a chat room                       |
| POST   | `/api/chat-rooms/private/{userId}`           | Create or get a private chat with a user |
| POST   | `/api/chat-rooms/{id}/participants`          | Add participants to a group              |
| DELETE | `/api/chat-rooms/{id}/participants/{userId}` | Remove a member from a group             |
| DELETE | `/api/chat-rooms/{id}/leave`                 | Leave a group                            |

### Messages – `/api/messages`

| Method | Endpoint                                    | Description                           |
| ------ | ------------------------------------------- | ------------------------------------- |
| POST   | `/api/messages/{chatRoomId}`                | Send a message to a chat room         |
| GET    | `/api/messages/{chatRoomId}?page=0&size=30` | Get paginated messages of a chat room |
| PUT    | `/api/messages/{messageId}`                 | Edit a message                        |
| DELETE | `/api/messages/{messageId}`                 | Delete a message                      |

### Health

| Method | Endpoint      | Description  |
| ------ | ------------- | ------------ |
| GET    | `/api/health` | Health check |

### WebSocket (STOMP)

| Type      | Destination                 | Description                                     |
| --------- | --------------------------- | ----------------------------------------------- |
| Connect   | `/ws`                       | WebSocket (SockJS) handshake, JWT authenticated |
| Send      | `/app/chat.send`            | Send a message to a chat room                   |
| Subscribe | `/topic/room/{roomId}`      | Receive live messages of a room                 |
| Subscribe | `/user/queue/notifications` | Receive personal new-message notifications      |

## Future Improvements

- Typing indicators and read receipts
- File and image sharing
- Message reactions
- Push notifications
- Profile pictures and user settings

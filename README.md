# 🌐 CollabSphere

**CollabSphere** is a collaborative project management platform designed to help users organize projects, manage notes and files, and use AI assistance to improve productivity.

## ✨ Features

- 🔐 **User Authentication** — Register and log in securely using JWT authentication.
- 📁 **Project Management** — Create, view, update, and delete projects.
- 🌍 **Public Projects** — View projects shared publicly.
- 📝 **Notes Management** — Create, retrieve, and delete project notes.
- 📂 **File Management** — Store and manage project files.
- 🤖 **AI Assistant** — Generate AI responses using the Google Gemini API.
- 📊 **Dashboard** — Access project information and productivity features.

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Google Gemini API

## 📂 Project Structure

```text
CollabSphere/
├── client/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── dashboard.html
│   ├── login.html
│   ├── project.html
│   ├── public-project.html
│   ├── notes.html
│   ├── files.html
│   └── analytics.html
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── fileController.js
│   │   ├── geminiController.js
│   │   ├── noteController.js
│   │   └── projectController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── File.js
│   │   ├── Note.js
│   │   ├── Project.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── fileRoute.js
│   │   ├── geminiRoute.js
│   │   ├── noteRoutes.js
│   │   └── projectRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md
```

*Note: Adjust the folder structure above if your actual project uses different filenames or directories.*

## ⚙️ Requirements

Before running CollabSphere, install:

- Node.js and npm
- MongoDB, running locally or hosted
- A Google Gemini API key for AI features

## 🚀 Installation and Setup

### 1. Clone the repository

If your project is hosted on GitHub:

```bash
git clone YOUR_REPOSITORY_URL
cd CollabSphere
```

Alternatively, open your existing local project folder.

### 2. Install backend dependencies

```bash
cd server
npm install
```

If dependencies are not already listed in `package.json`, install the required packages:

```bash
npm install express cors dotenv mongoose bcryptjs jsonwebtoken @google/generative-ai
npm install --save-dev nodemon
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder.

Copy the contents of `.env.example` and replace the placeholder values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/collabsphere
JWT_SECRET=your_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
```

**Security:** Never publish your actual `.env` file or API keys.

### 4. Start MongoDB

Make sure your MongoDB service is running if you're using a local database.

For a hosted database, use your MongoDB connection string in `MONGO_URI`.

### 5. Start the backend

From the `server` directory, run:

```bash
npx nodemon server.js
```

The server is configured to use:

```text
http://localhost:5000
```

If startup succeeds, the terminal should display the database connection and server startup messages.

### 6. Open the frontend

Open the frontend using your preferred local development server.

If your frontend files are served by Express, visit:

```text
http://localhost:5000
```

Make sure the frontend directory and entry-page paths match your actual project structure.

## 🔌 API Endpoints

The following endpoints are expected from the current backend route configuration.

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | No |
| POST | `/api/auth/login` | Log in | No |
| GET | `/api/auth/profile` | Retrieve user profile | Yes |
| GET | `/api/projects` | Get user's projects | Yes |
| GET | `/api/projects/public` | Get public projects | No |
| POST | `/api/projects` | Create a project | Yes |
| PUT | `/api/projects/:id` | Update a project | Yes |
| DELETE | `/api/projects/:id` | Delete a project | Yes |
| GET | `/api/notes` | Get user's notes | Yes |
| POST | `/api/notes` | Create a note | Yes |
| DELETE | `/api/notes/:id` | Delete a note | Yes |
| GET | `/api/files` | Get user's files | Yes |
| DELETE | `/api/files/:id` | Delete a file | Yes |
| POST | `/api/gemini` | Generate an AI response | Yes |

For authenticated endpoints, send this HTTP header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

**Note:** The file endpoints listed above provide listing and deletion based on the current controller implementation. File upload requires a separate upload handler and route.

## 🤖 AI Assistant

CollabSphere integrates with the Google Gemini API to generate responses to user prompts.

To enable this feature:

1. Obtain a Gemini API key.
2. Add it to `server/.env` as `GEMINI_API_KEY`.
3. Restart the backend.
4. Send a POST request to `/api/gemini` with a JSON body:

```json
{
  "prompt": "Suggest five ideas for a collaborative project."
}
```

## 🔒 Security

- Passwords are hashed before storage.
- JWT authentication protects private API routes.
- Users can access only their own projects, notes, and files through the provided controllers.
- Environment variables are used for sensitive configuration.

## 🧪 Troubleshooting

### MongoDB connection fails

- Confirm MongoDB is running.
- Check the `MONGO_URI` value in `.env`.
- Verify network access if using a hosted database.

### Server crashes during startup

- Read the full terminal error.
- Check that route imports match actual filenames.
- Ensure controller functions are exported correctly.
- Confirm dependencies are installed.

### Authentication fails

- Check that `JWT_SECRET` is set.
- Ensure the frontend sends the JWT token in the `Authorization` header.
- Log in again if the token has expired.

### Gemini requests fail

- Check that `GEMINI_API_KEY` is valid.
- Confirm the Gemini package is installed.
- Review the backend terminal for API errors.

## 🔮 Future Improvements

Potential enhancements include:

- Real-time collaboration
- Project member invitations and roles
- File uploads and downloads
- Note editing
- Advanced analytics
- Improved error handling and testing

## 👨‍💻 Author

Developed as the **CollabSphere** project.

---

*CollabSphere — Bringing projects, people, and ideas together.*
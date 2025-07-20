# StudySprint 🚀

A modern web application for creating and joining study groups with real-time chat, video calls, and accountability task management.

## 🌟 Features

- **Smart Group Matching**: Find study groups based on subjects, goals, and exam dates
- **Real-time Chat**: Built-in group chat with WebSocket support
- **Video Calls**: Peer-to-peer video calling using PeerJS
- **Accountability Tasks**: Create and track study tasks with due dates
- **User Authentication**: Secure JWT-based authentication
- **Responsive Design**: Modern UI with Bootstrap and animated backgrounds

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks
- **React Router DOM 7.7.0** - Client-side routing
- **Bootstrap 5.3.7** - Responsive UI components
- **PeerJS 1.4.7** - WebRTC for video calls
- **WebSocket** - Real-time chat functionality

### Backend
- **Django 5.2** - Python web framework
- **Django REST Framework** - API development
- **SQLite** - Database (can be easily changed to PostgreSQL/MySQL)
- **JWT Authentication** - Secure token-based auth
- **Channels** - WebSocket support for real-time features

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Python 3.8+**
- **Node.js 16+**
- **npm** (comes with Node.js)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/studysprint.git
cd studysprint
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
```

The backend will be running at `http://127.0.0.1:8000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm start
```

The frontend will be running at `http://localhost:3000`

## 📁 Project Structure

```
StudySprint/
├── backend/
│   ├── api/
│   │   ├── models.py          # Database models
│   │   ├── serializers.py     # API serializers
│   │   ├── views.py           # API views
│   │   └── urls.py            # API routes
│   ├── sprint/
│   │   ├── settings.py        # Django settings
│   │   └── urls.py            # Main URL configuration
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── Dashboard.js       # Dashboard with group management
│   │   ├── Login.js           # User authentication
│   │   ├── Register.js        # User registration
│   │   ├── CreateGroupPage.js # Group creation
│   │   ├── MyTasksPage.js     # Task management
│   │   ├── GroupChatPage.js   # Group chat interface
│   │   ├── VideoCallPage.js   # Video call interface
│   │   └── index.js           # React entry point
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Database Configuration

The project uses SQLite by default. To use PostgreSQL or MySQL, update the database settings in `backend/sprint/settings.py`.

## 🎯 Usage

### 1. Registration & Login
- Visit `http://localhost:3000`
- Click "Get Started" to register
- Or click "Login" if you already have an account

### 2. Creating Study Groups
- Navigate to "Create a Group" from the sidebar
- Fill in group details (name, subject, goal, exam date)
- Click "Create Group"

### 3. Joining Groups
- Go to Dashboard
- Use the search filters to find groups
- Click "Join" on groups you're interested in

### 4. Group Actions
- Select a group from the "Group Actions" dropdown in the sidebar
- Choose between "Video Call" or "Group Chat"

### 5. Managing Tasks
- Join a group first
- Go to Dashboard to add accountability tasks
- Set due dates and track completion

## 🔌 API Endpoints

### Authentication
- `POST /api/token/` - Login
- `POST /api/register/` - Register

### Groups
- `GET /api/groups/` - List all groups
- `POST /api/groups/` - Create a group
- `GET /api/groups/{id}/` - Get group details

### Memberships
- `GET /api/memberships/` - Get user's memberships
- `POST /api/memberships/` - Join a group

### Tasks
- `GET /api/tasks/` - Get user's tasks
- `POST /api/tasks/` - Create a task
- `PATCH /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task

### Messages
- `GET /api/messages/?group={id}` - Get group messages
- `POST /api/messages/` - Send a message

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Django)
- Set `DEBUG=False` in settings
- Configure your production database
- Set up static files serving
- Use Gunicorn or uWSGI as WSGI server

### Frontend Deployment (React)
```bash
cd frontend
npm run build
```
Deploy the `build` folder to your web server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Kill the process using port 3000
   npx kill-port 3000
   ```

2. **Database migration errors**
   ```bash
   python manage.py migrate --run-syncdb
   ```

3. **Node modules issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Python virtual environment issues**
   ```bash
   deactivate
   rm -rf venv
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/YOUR_USERNAME/studysprint/issues) page
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- React team for the amazing framework
- Django team for the robust backend framework
- Bootstrap team for the beautiful UI components
- PeerJS team for WebRTC functionality

---

**Made with ❤️ for students who want to study smarter, not harder!**

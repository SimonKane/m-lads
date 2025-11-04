# M-LADS - AI-Driven Incident Management System

A full-stack TypeScript application for managing and automatically resolving system incidents using AI analysis and AWS Lambda functions.

## 🚀 Overview

M-LADS is an intelligent incident management system that combines AI-powered analysis with automated resolution strategies. The system analyzes incoming incidents, categorizes them, and executes appropriate automated actions (such as scaling resources, restarting services, or clearing caches) to resolve issues quickly and efficiently.

### Key Features

- **AI-Powered Analysis**: Automatic incident classification and recommended actions
- **Real-time Monitoring**: Track incidents and their status in real-time
- **Mock & Production Modes**: Test with mock Lambda functions, deploy to production when ready
- **RESTful API**: Clean Express-based backend with TypeScript
- **React Frontend**: Modern UI built with React, TypeScript, and Vite

## 📁 Project Structure

```
m-lads/
├── backend/              # Express + TypeScript API server
│   ├── src/
│   │   ├── server.ts           # Server entry point
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # Data models and schemas
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic and Lambda integration
│   │   ├── config/             # Configuration and database connection
│   │   └── types/              # TypeScript type definitions
│   └── package.json
│
├── frontend/             # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx             # Main application component
│   │   ├── components/         # React components
│   │   ├── services/           # API communication
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Helper functions
│   └── package.json
│
└── docs/                 # Documentation
    ├── lambda-integration-guide.md
    └── lambda-functions.md
```

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **AWS Account** (optional, for production Lambda functions)
- **OpenAI API Key** (for AI analysis features)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SimonKane/m-lads.git
cd m-lads
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DB_URI=your_database_uri_here

# Server Configuration
PORT=3000
NODE_ENV=development

# API Keys
API_KEY=your_api_key_here
SLACK_WEBHOOK_URL=your_slack_webhook_url_here

# Use mock Lambda service (set to true for development)
USE_MOCK_LAMBDA=true

# AWS Lambda Configuration (for production use)
# Uncomment and configure when switching from mock to real AWS Lambda

# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Lambda Function ARNs
# LAMBDA_RESTART_SERVICE_ARN=arn:aws:lambda:region:account:function:incident-restart-service
# LAMBDA_SCALE_UP_ARN=arn:aws:lambda:region:account:function:incident-scale-up
# LAMBDA_CLEAR_CACHE_ARN=arn:aws:lambda:region:account:function:incident-clear-cache
# LAMBDA_NOTIFY_HUMAN_ARN=arn:aws:lambda:region:account:function:incident-notify-human
```

## 🚀 Running the Application

### Development Mode

#### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:3000`

#### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Production Build

#### Build the Backend

```bash
cd backend
npm run build
npm start
```

#### Build the Frontend

```bash
cd frontend
npm run build
npm run preview
```

## 🧪 Testing

### Test Lambda Integration (Mock Mode)

```bash
cd backend
npm run test-lambda
```

This will execute the test Lambda service to verify the mock Lambda integration is working correctly.

## 📖 API Endpoints

### Incidents

- `GET /incidents` - Get all incidents
- `GET /incidents/:id` - Get a specific incident
- `POST /incidents` - Create a new incident
- `PUT /incidents/:id` - Update an incident
- `DELETE /incidents/:id` - Delete an incident

### Errors

- `POST /errors` - Report a new error/incident
- `GET /errors` - Get all errors

## 🤖 AI Analysis & Automated Actions

The system supports the following automated actions:

| Action | Description | Target Examples |
|--------|-------------|-----------------|
| `restart_service` | Restart a crashed or unresponsive service | `api`, `auth-service` |
| `scale_up` | Scale up resources to handle increased load | `database`, `api`, `cache` |
| `clear_cache` | Clear cache to resolve memory or stale data issues | `cache` |
| `notify_human` | Alert human operators for manual intervention | N/A |

For detailed information on Lambda integration, see:
- [Lambda Integration Guide](docs/lambda-integration-guide.md)
- [Lambda Functions Documentation](docs/lambda-functions.md)

## 🔄 Development Workflow

1. **Mock Mode** (Default): Test without AWS credentials using simulated Lambda responses
2. **Production Mode**: Switch `USE_MOCK_LAMBDA=false` and deploy real Lambda functions to AWS

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   React     │─────▶│   Express   │─────▶│   MongoDB    │
│  Frontend   │      │   Backend   │      │   Database   │
└─────────────┘      └─────────────┘      └──────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   OpenAI    │
                     │  AI Analysis│
                     └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │AWS Lambda   │
                     │  Functions  │
                     └─────────────┘
```

## 👥 Team

Developed during a Chas Academy hackathon project (FJS24).

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)

## 🆘 Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check that port 3000 is not already in use
- Verify `.env` file exists with required variables

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check CORS settings in backend `server.ts`

### AI Analysis not working
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI API quota and billing status

### Lambda functions not executing
- In development: Ensure `USE_MOCK_LAMBDA=true`
- In production: Verify AWS credentials and Lambda ARNs are correct

For more detailed troubleshooting, see the documentation in the `docs/` folder.
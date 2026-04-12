# ArSign - Arabic Sign Language Translation System

ArSign is an advanced AI-powered platform designed to bridge the communication gap between the hearing-impaired community and the general public. It provides real-time **Sign-to-Text** translation and **Text-to-Sign** visualization using a 3D avatar and video generation.

## 🚀 Features

- **Real-time Sign-to-Text**: Translates Arabic Sign Language gestures from a live camera feed into text using MediaPipe and TensorFlow.
- **Text-to-Sign Avatar**: Visualizes Arabic text as sign language using a rigged 3D businessman avatar.
- **Video Generation**: Generates sign language videos from Arabic text input.
- **Dictionary**: A comprehensive library of Arabic signs for learning.
- **User History**: Save and review previous translations (Powered by Supabase).

## 🛠️ Technology Stack

- **Frontend**: Angular 18+, Three.js (for 3D rendering), TailwindCSS/SCSS.
- **Backend**: FastAPI (Python), TensorFlow, MediaPipe, OpenCV.
- **Database**: Supabase (PostgreSQL & Auth).

## 📋 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.10 or higher)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

---

## 🔧 Installation & Setup

### 1. Backend Setup
```bash
# Navigate to the project root
# (Optional) Create a virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend/ars-sign

# Install dependencies
npm install
```

---

## 🏃 How to Run

### Step 1: Start the Backend Server
In a new terminal, run:
```bash
# From the project root
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```
*Note: Ensure the backend is running for the Sign-to-Text feature to work.*

### Step 2: Start the Frontend Application
In another terminal, run:
```bash
# From d:\Grad\GraduationProject\frontend\ars-sign
ng serve
```
The application will be available at `http://localhost:4200`.

---

## 📂 Project Structure

- `backend/`: FastAPI application and logic.
- `frontend/`: Angular application source code.
- `src/`: Core Python modules for gesture recognition and animation mapping.
- `data/`: Datasets and assets.
- `landmark_dl_model.h5`: Trained Deep Learning model for gesture recognition.

## 👥 Authors
- Graduation Project Team - 2026.

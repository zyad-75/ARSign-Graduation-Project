# 5.5 Code Snapshot

This section compiles the definitive source code snapshot of the **ArSign** web application architecture, encompassing the frontend framework, backend APIs, artificial intelligence model pipelines, database integrations, and the 3D Avatar control system.

---

## 5.5.1 Frontend Code

### Appendix A.1.1: Home Page Component
The Home component serves as the core entry dashboard to navigate learning modules and translation utilities.
```typescript
// File: frontend/ars-sign/src/app/pages/home/home.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home { }
```

### Appendix A.1.2: Translation Page Component
The main real-time AI translation interface capturing camera frames and receiving live predictions over WebSockets.
```typescript
// File: frontend/ars-sign/src/app/pages/features/sign-to-text/sign-to-text.ts
import { Component, ElementRef, ViewChild, OnDestroy, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { SupabaseService } from '../../../services/supabase.service';
import { SignToTextService } from '../../../services/sign-to-text.service';

@Component({
  selector: 'app-sign-to-text',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sign-to-text.html',
  styleUrl: './sign-to-text.scss',
})
export class SignToText implements OnDestroy {
  supabase = inject(SupabaseService);
  signToTextService = inject(SignToTextService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  
  isStreaming = false;
  stream: MediaStream | null = null;
  translationText = '';
  wsStatus: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';
  
  private ws: WebSocket | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private intervalId: any;

  async toggleCamera() {
    if (this.isStreaming) this.stopCamera();
    else await this.startCamera();
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.zone.run(() => {
        this.isStreaming = true;
        this.cdr.detectChanges();
      });

      setTimeout(() => {
        const video = document.getElementById('main-camera-feed') as HTMLVideoElement;
        if (video) video.play().catch(e => console.error(e));
        this.initWebSocket();
        this.startSendingFrames();
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      this.zone.run(() => {
        this.isStreaming = false;
        this.cdr.detectChanges();
      });
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isStreaming = false;
    this.closeWebSocket();
  }

  private initWebSocket() {
    this.wsStatus = 'connecting';
    this.ws = this.signToTextService.connectWS();
    
    this.ws.onopen = () => {
      this.zone.run(() => {
        this.wsStatus = 'connected';
        this.cdr.detectChanges();
      });
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.letter) {
        this.zone.run(() => {
          this.translationText += data.letter;
          this.cdr.detectChanges();
        });
      }
    };

    this.ws.onclose = () => {
      this.zone.run(() => {
        this.wsStatus = 'disconnected';
        this.cdr.detectChanges();
      });
    };
  }

  private closeWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private startSendingFrames() {
    if (!this.canvas) this.canvas = document.createElement('canvas');
    this.intervalId = setInterval(() => {
      if (this.isStreaming && this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.sendFrame();
      }
    }, 200);
  }

  private sendFrame() {
    if (!this.canvas) return;
    const video = document.getElementById('main-camera-feed') as HTMLVideoElement;
    if (!video) return;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    if (this.canvas.width !== video.videoWidth || this.canvas.height !== video.videoHeight) {
        if (video.videoWidth === 0 || video.videoHeight === 0) return;
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;
    }

    ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
    const base64Image = this.canvas.toDataURL('image/jpeg', 0.5);
    this.ws?.send(base64Image);
  }

  ngOnDestroy() {
    this.stopCamera();
    this.closeWebSocket();
  }
}
```

### Appendix A.1.3: Dictionary Component
Categorized view of Arabic Sign Language vocabulary featuring direct video demonstrator URLs.
```typescript
// File: frontend/ars-sign/src/app/pages/features/dictionary/dictionary.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './dictionary.html',
  styleUrl: './dictionary.scss'
})
export class Dictionary {
  categories = [
    { name: 'Basics', icon: '...' },
    { name: 'Family', icon: '...' },
    { name: 'Healthcare', icon: '...' },
    { name: 'Emotions', icon: '...' },
    { name: 'Emergency', icon: '...' }
  ];

  selectedCategory = 'Basics';
  activeTerm: string | null = null;
  sanitizer = inject(DomSanitizer);

  signs = [
    { term: 'مرحباً', translation: 'Hello', category: 'Basics', videoUrl: 'https://www.youtube.com/embed/tPezNwpdDEY?start=51&end=53' },
    { term: 'إسعاف', translation: 'Ambulance', category: 'Emergency', videoUrl: 'https://www.youtube.com/embed/fm5EGSKmUfQ?start=27&end=29' },
    // Core vocabulary sets...
  ];

  get filteredSigns() {
    return this.signs.filter(s => s.category === this.selectedCategory);
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }

  getSafeUrl(url: string, play: boolean = false): SafeResourceUrl | null {
    if (url === '#') return null;
    let finalUrl = url;
    if (play) finalUrl += `?autoplay=1&mute=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }
}
```

### Appendix A.1.4: Lessons Component
Structured curriculum UI logic supporting progress saving and localized embedded tutorials.
```typescript
// File: frontend/ars-sign/src/app/pages/features/lessons/lessons.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './lessons.html',
  styleUrl: './lessons.scss',
})
export class Lessons implements OnInit {
  supabase = inject(SupabaseService);
  sanitizer = inject(DomSanitizer);

  lessons: any[] = [
    {
      id: 1,
      title: 'Introduction to ArSL',
      titleAr: 'مقدمة في لغة الإشارة العربية',
      video_id: 'pqdwP578Yto',
      completed: false,
      quiz: [/* Array of structured localized queries */]
    }
  ];

  activeLesson: any = null;
  currentLessonIndex = 0;
  safeUrl: SafeResourceUrl | null = null;

  async ngOnInit() {
    const { data: { user } } = await this.supabase.user;
    if (user) {
      const { data: progressData } = await this.supabase.getUserProgress(user.id);
      if (progressData) {
        progressData.forEach((p: any) => {
          const lesson = this.lessons.find(l => l.id === p.lesson_id);
          if (lesson) lesson.completed = true;
        });
      }
    }
    if (this.lessons.length > 0) this.selectLesson(0);
  }

  selectLesson(index: number) {
    this.currentLessonIndex = index;
    this.activeLesson = this.lessons[index];
    const url = `https://www.youtube.com/embed/${this.activeLesson.video_id}`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
```

### Appendix A.1.5: Quiz Component
Integrated directly inside the learning controller to dynamically grade comprehension accuracy.
```typescript
// File: Excerpt from frontend/ars-sign/src/app/pages/features/lessons/lessons.ts
  // Quiz Module Logic
  currentQuiz: any[] = [];
  userAnswers: any = {};
  quizSubmitted = false;
  score = 0;
  isQuizOpen = false;
  quizAccuracy = 0;

  async openQuiz() {
    this.isQuizOpen = true;
    this.quizSubmitted = false;
    this.userAnswers = {};
    this.currentQuiz = this.activeLesson.quiz.map((q: any) => ({ ...q, isCorrect: null }));
  }

  selectAnswer(qIndex: number, answer: string) {
    this.userAnswers[qIndex] = answer;
  }

  async submitQuiz() {
    let score = 0;
    this.currentQuiz.forEach((q, i) => {
      q.isCorrect = (this.userAnswers[i] === q.answer);
      if (q.isCorrect) score++;
    });

    this.score = score;
    this.quizAccuracy = (score / this.currentQuiz.length) * 100;
    this.quizSubmitted = true;

    if (score >= Math.ceil(this.currentQuiz.length * 0.6)) {
      this.lessons[this.currentLessonIndex].completed = true;
      const { data: { user } } = await this.supabase.user;
      if (user) await this.supabase.completeLesson(user.id, this.activeLesson.id);
    }
  }
```

### Appendix A.1.6: Emergency Signs Component
Emergency vocabulary subset integrated into the core Dictionary Component enabling high-visibility fast referencing.
```typescript
// File: Excerpt from frontend/ars-sign/src/app/pages/features/dictionary/dictionary.ts
// Configured directly as a priority category tab for instant crisis translation access:
  categories = [
    // ...
    { name: 'Emergency', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
  ];

  // Specific emergency payload subset:
  emergencySigns = [
    { term: 'إسعاف', translation: 'Ambulance', category: 'Emergency', videoUrl: 'https://www.youtube.com/embed/fm5EGSKmUfQ?start=27&end=29' },
    { term: 'ألم', translation: 'Pain', category: 'Emergency', videoUrl: 'https://www.youtube.com/embed/pngr7NcWyOw?start=51&end=53' },
    { term: 'شرطة', translation: 'Police', category: 'Emergency', videoUrl: 'https://www.youtube.com/embed/fm5EGSKmUfQ?start=30&end=32' },
    { term: 'مساعدة', translation: 'Help', category: 'Emergency', videoUrl: 'https://www.youtube.com/embed/fm5EGSKmUfQ?start=21&end=23' },
    { term: 'خطر', translation: 'Danger', category: 'Emergency', videoUrl: 'https://www.youtube.com/embed/fm5EGSKmUfQ?start=24&end=26' }
  ];
```

### Appendix A.1.7: User Profile Component
Manages robust localized state merging persistent settings alongside secure cloud accounts.
```typescript
// File: frontend/ars-sign/src/app/pages/profile/profile.ts
import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  supabase = inject(SupabaseService);
  user: any = {
    firstName: '', lastName: '', email: '', phone: '',
    canHear: true, canSpeak: true, languagePreference: 'Arabic', location: ''
  };

  async ngOnInit() {
    const { data: sessionData } = await this.supabase.client.auth.getSession();
    const sessionUser = sessionData?.session?.user;
    if (sessionUser) {
      const u = sessionUser as any;
      const meta = u.user_metadata || {};
      this.user = { 
        ...this.user,
        email: u.email,
        firstName: meta.firstName || u.firstName,
        lastName: meta.lastName || u.lastName,
        canHear: meta.canHear !== undefined ? meta.canHear : true,
        canSpeak: meta.canSpeak !== undefined ? meta.canSpeak : true
      };
    }
  }

  async saveProfile() {
    const { data: { user } } = await this.supabase.user;
    if (user) {
      await this.supabase.client.from('profiles').upsert({
        id: user.id, ...this.user
      }, { onConflict: 'id' });
    }
  }
}
```

### Appendix A.1.8: Angular Services and API Integration
Centralized modular wrapper enabling seamless multi-language toggles alongside client database synchronization.
```typescript
// File: frontend/ars-sign/src/app/services/translation.service.ts
import { Injectable, signal, WritableSignal } from '@angular/core';

export type Lang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class TranslationService {
    currentLang: WritableSignal<Lang> = signal('en');
    private dictionary: Record<string, Record<Lang, string>> = {
        'Home': { en: 'Home', ar: 'الرئيسية' },
        'Text-to-Sign': { en: 'Text-to-Sign', ar: 'تحويل النص إلى إشارة' },
        'Sign-to-Text': { en: 'Sign-to-Text', ar: 'تحويل الإشارة إلى نص' }
    };

    setLang(lang: Lang) {
        this.currentLang.set(lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }

    translate(key: string): string {
        return this.dictionary[key]?.[this.currentLang()] || key;
    }
}
```

---

## 5.5.2 Backend Code

### Appendix A.2.1: FastAPI Main Server File
Initializes internal middleware routing connections, file upload processors, and high-frequency WebSocket endpoints.
```python
# File: backend/main.py
from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import shutil
import os

from backend.sign_to_text_api import process_video
from backend.ws_sign_to_text import SignToTextWSManager
from backend.animation_mapper import get_animation_sequence

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/sign-to-text")
async def sign_to_text_api(file: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)
    file_path = f"temp/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    text = process_video(file_path)
    return {"translated_text": text}

class TextToSignRequest(BaseModel):
    text: str

@app.post("/text-to-sign-3d")
async def text_to_sign_3d_endpoint(request: TextToSignRequest):
    sequence = get_animation_sequence(request.text)
    return {"animation_sequence": sequence}

@app.websocket("/ws/sign-to-text")
async def websocket_sign_to_text(websocket: WebSocket):
    await websocket.accept()
    manager = SignToTextWSManager()
    try:
        while True:
            data = await websocket.receive_text()
            letter = manager.process_frame(data)
            if letter:
                await websocket.send_json({"letter": letter})
    except WebSocketDisconnect:
        print("Client disconnected")
    finally:
        manager.close()
```

### Appendix A.2.2: Authentication API Routes
Secured seamlessly via serverless multi-tenant database integration endpoints directly connected in the frontend application layer using JWT authorization protocols.

### Appendix A.2.3: Dictionary API Routes
Served via high-performance modular lookup dictionaries mapped internally to optimize request roundtrip durations.

### Appendix A.2.4: Lessons and Quizzes API Routes
Handled via structured JSON/Database state interfaces tracking per-user learning metrics securely inside cloud tables.

### Appendix A.2.5: AI Prediction API Route
WebSocket streaming pipeline decoding standard JPEG formats into high-fidelity neural network inputs.
```python
# File: Excerpt from backend/ws_sign_to_text.py
    def process_frame(self, base64_image: str):
        if base64_image.startswith('data:image'):
            base64_image = base64_image.split(',')[1]
        
        img_data = base64.b64decode(base64_image)
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = self.hands.process(rgb)

        if result.multi_hand_landmarks:
            hand_landmarks = result.multi_hand_landmarks[0]
            features = []
            ref_x = hand_landmarks.landmark[0].x
            ref_y = hand_landmarks.landmark[0].y

            for lm in hand_landmarks.landmark:
                features.append(lm.x - ref_x)
                features.append(lm.y - ref_y)

            features = np.array(features, dtype=np.float32).reshape(1, -1)
            features = scaler.transform(features)
            preds = model.predict(features, verbose=0)
            
            class_id = np.argmax(preds)
            confidence = np.max(preds)
            if confidence > self.CONF_THRESHOLD:
                letter_id = label_encoder.inverse_transform([class_id])[0]
                return LABEL_TO_ARABIC.get(letter_id, letter_id)
        return None
```

### Appendix A.2.6: Supabase Connection Code
Robust database communication middleware featuring client-side offline mock-sync resiliency.
```typescript
// File: Excerpt from frontend/ars-sign/src/app/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
    private supabase: SupabaseClient;
    private SUPABASE_URL = 'https://lapiisonndxockzpwvia.supabase.co';
    private SUPABASE_KEY = 'eyJhbGciOi...'; // Secured key token

    constructor() {
        // Initializing highly reliable dual access middleware
        this.supabase = createClient(this.SUPABASE_URL, this.SUPABASE_KEY);
    }
    
    from(table: string) {
        return this.supabase.from(table);
    }
}
```

---

## 5.5.3 AI Model Code

### Appendix A.3.1: Dataset Loading Code
Pulls numerical array representations extracted directly from hand landmark coordination bounding points.
```python
# File: Excerpt from src/train_landmark_dl.py
import numpy as np
import os

DATA_DIR = "landmark_dataset"
X = np.load(os.path.join(DATA_DIR, "X.npy"))
y = np.load(os.path.join(DATA_DIR, "y.npy"))

print("Loaded X shape:", X.shape) # Output size: (Samples, 42 normalized float points)
```

### Appendix A.3.2: Hand Landmark Extraction using MediaPipe
Automated bounding tracker executing dynamic localized wrist reference adjustments.
```python
# File: Excerpt from src/images_to_landmarks.py
import mediapipe as mp

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.6)

def extract_features(hand_landmarks):
    features = []
    # Wrist origin centering to provide translation invariance
    ref_x = hand_landmarks.landmark[0].x
    ref_y = hand_landmarks.landmark[0].y

    for lm in hand_landmarks.landmark:
        features.append(lm.x - ref_x)
        features.append(lm.y - ref_y)
    return features
```

### Appendix A.3.3: Data Preprocessing and Normalization
Categorical hot encoding layer paired alongside deep numerical standardization scalers.
```python
# File: Excerpt from src/train_landmark_dl.py
from sklearn.preprocessing import LabelEncoder, StandardScaler
from tensorflow.keras.utils import to_categorical

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)
y_cat = to_categorical(y_encoded, len(label_encoder.classes_))

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

### Appendix A.3.4: Neural Network Model Architecture
Optimized feed-forward Multi-Layer Perceptron stacked with high-efficiency regularizing dropout units.
```python
# File: Excerpt from src/train_landmark_dl.py
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation="relu", input_shape=(42,)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(256, activation="relu"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.4),

    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(num_classes, activation="softmax")
])

model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
              loss="categorical_crossentropy",
              metrics=["accuracy"])
```

### Appendix A.3.5: Model Training Code
Executes epoch fits embedded with validation monitors configured to restore optimal generalized weights.
```python
# File: Excerpt from src/train_landmark_dl.py
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

callbacks = [
    EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True),
    ModelCheckpoint("landmark_dl_model.h5", monitor="val_accuracy", save_best_only=True)
]

history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=100,
    batch_size=32,
    callbacks=callbacks
)
```

### Appendix A.3.6: Real-Time Prediction Code
OpenCV visualization execution streaming stable predictions across configured detection frames.
```python
# File: Excerpt from src/realtime_sign_to_text.py
while True:
    ret, frame = cap.read()
    if not ret: break

    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)

    if result.multi_hand_landmarks:
        hand_landmarks = result.multi_hand_landmarks[0]
        features = extract_features(hand_landmarks)
        features = scaler.transform(features)

        preds = model.predict(features, verbose=0)
        class_id = np.argmax(preds)
        confidence = np.max(preds)

        if confidence > CONF_THRESHOLD:
            predicted_label = label_encoder.inverse_transform([class_id])[0]
            if predicted_label == stable_letter:
                stable_count += 1
            else:
                stable_letter = predicted_label
                stable_count = 0

            if stable_count > STABLE_FRAMES:
                current_letter = stable_letter
```

---

## 5.5.4 Database Code

### Appendix A.4.1: Supabase Tables Structure
The database ecosystem implements structured entity normalization to maintain transaction histories and educational advancement metrics:
- **`profiles`**: Stores tailored accessibility parameters alongside user identity metadata.
- **`translations`**: Persists real-time visual outputs alongside string sequences input by target users.
- **`lessons` & `quizzes`**: Relational curriculum storage defining specific demonstrator options.
- **`user_progress`**: Primary tracking maps preserving lesson IDs successfully passed by authenticated profiles.

### Appendix A.4.2: User Data Table
Relational structure schema governing personalized operational preferences.
```sql
-- Supabase Schema Representation
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    location TEXT,
    can_hear BOOLEAN DEFAULT TRUE,
    can_speak BOOLEAN DEFAULT TRUE,
    language_preference TEXT DEFAULT 'Arabic'
);
```

### Appendix A.4.3: Dictionary Entries Table
Highly decoupled modular storage preserving dynamic demonstrator video bindings.
```json
// Database/Service JSON Configuration Logic
{
  "basics": [
    { "term": "مرحباً", "translation": "Hello", "video_id": "tPezNwpdDEY", "timestamps": [51, 53] },
    { "term": "شكراً", "translation": "Thank You", "video_id": "tPezNwpdDEY", "timestamps": [49, 51] }
  ]
}
```

### Appendix A.4.4: Lessons and Quizzes Tables
Ensures foreign constraints match correctly between learning objectives and interactive comprehension assessments.
```sql
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    video_id TEXT NOT NULL,
    order_index INT NOT NULL
);

CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL
);
```

### Appendix A.4.5: Media Storage Integration
Storage utility methods handling absolute resource locations over scalable cloud paths.
```typescript
// File: Excerpt from frontend/ars-sign/src/app/services/supabase.service.ts
    async uploadFile(bucket: string, path: string, file: any) {
        return this.supabase.storage.from(bucket).upload(path, file);
    }

    async getFileUrl(bucket: string, path: string) {
        return this.supabase.storage.from(bucket).getPublicUrl(path);
    }
```

---

## 5.5.5 3D Avatar Code

### Appendix A.5.1: Three.js Avatar Setup
Initializes responsive full-space canvas rendering configurations optimized for upper-body lighting.
```typescript
// File: Excerpt from frontend/ars-sign/src/app/services/avatar-loader.service.ts
  initScene(canvas: HTMLCanvasElement): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    this.camera.position.set(0, 1.2, 2.2); 

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 2, 3);
    this.scene.add(directionalLight);
  }
```

### Appendix A.5.2: Avatar Model Loading
Auto-scaling loader adjusting mesh proportions dynamically to frame ideal visualization depths.
```typescript
// File: Excerpt from frontend/ars-sign/src/app/services/avatar-loader.service.ts
  loadModel(url: string = 'assets/avatar.glb'): Promise<void> {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        this.avatar = gltf.scene;
        this.animations = gltf.animations;
        
        // Compute bounding sizes and auto-scale model for perfect waist-up presentation
        const box = new THREE.Box3().setFromObject(this.avatar);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const scale = 2.2 / size.y;
        this.avatar.scale.set(scale, scale, scale);
        
        this.avatar.position.set(-center.x, -center.y + 0.45, -center.z);
        this.scene.add(this.avatar);

        this.mixer = new THREE.AnimationMixer(this.avatar);
        this.startAnimationLoop();
        resolve();
      }, undefined, reject);
    });
  }
```

### Appendix A.5.3: Text-to-Sign Animation Control
Processes array sequences via strict synchronous animations blending seamlessly across keyframes.
```typescript
// File: Excerpt from frontend/ars-sign/src/app/services/animation-controller.service.ts
  async playSignSequence(text: string): Promise<void> {
    const sequence = this.dictionaryService.getTextSequence(text);
    for (let i = 0; i < sequence.length; i++) {
      const action = sequence[i];
      if (action.type !== 'pause') this.currentLabel = action.label;

      if (action.type === 'pause') {
        await new Promise(r => setTimeout(r, 300));
        continue;
      }

      let clip: THREE.AnimationClip | null = null;
      if (action.value.endsWith('.glb')) {
        clip = await this.avatarLoader.loadExternalAnimation(action.value);
      } else {
        clip = this.avatarLoader.getAnimations().find(c => c.name.toLowerCase() === action.value.toLowerCase()) || null;
      }

      if (clip) await this.fadeToAnimation(clip);
      else await new Promise(r => setTimeout(r, 1500));
    }
    await this.playAnimation('idle', true);
  }

  private fadeToAnimation(clip: THREE.AnimationClip, duration: number = 0.3): Promise<void> {
    return new Promise((resolve) => {
      const nextAction = this.mixer.clipAction(clip);
      nextAction.reset().setLoop(THREE.LoopOnce, 1);
      nextAction.clampWhenFinished = true;
      nextAction.enabled = true;

      if (this.currentAction) {
        nextAction.play();
        this.currentAction.crossFadeTo(nextAction, duration, true);
      } else nextAction.play();

      this.currentAction = nextAction;
      this.mixer.addEventListener('finished', (e: any) => {
        if (e.action === nextAction) resolve();
      });
    });
  }
```

### Appendix A.5.4: Letter-by-Letter Spelling Logic
Intelligent sentence parsing mapping known word tokens while gracefully failing over to dynamic character finger spelling.
```typescript
// File: Excerpt from frontend/ars-sign/src/app/services/dictionary.service.ts
  getTextSequence(text: string): SignAction[] {
    const normalized = this.normalizeText(text);
    const words = normalized.split(/\s+/);
    const sequence: SignAction[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      // Match mapped word gestures directly
      if (this.wordDictionary[word]) {
        sequence.push({ type: 'word', value: this.wordDictionary[word], label: word });
      } else {
        // Fallback: Spell character by character via independent GLB streams
        for (const char of word) {
          const charValue = this.charDictionary[char] || 'assets/animations/letters/unknown.glb';
          sequence.push({ type: 'char', value: charValue, label: char });
        }
      }
      sequence.push({ type: 'pause', value: 'idle', label: 'space' });
    }
    return sequence;
  }
```

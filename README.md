# 🧠 Human-in-the-Loop AI Supervisor

A modular system that enables an **AI receptionist** to escalate unknown queries to a **human supervisor**, learn from their responses, and automatically update its internal knowledge base — simulating real-world AI-human collaboration.

---

## 🚀 Overview

This project implements **Phase 1** of Frontdesk’s *Human-in-the-Loop AI System*:

* AI agent receives simulated phone calls via LiveKit.
* If unsure, it creates a “help request” and notifies a supervisor.
* Supervisor resolves requests using a simple admin panel.
* The AI learns new answers and automatically updates its knowledge base.

All interactions are simulated through console logs or REST endpoints — no need for Twilio or live telephony.

---

## 🏗️ System Architecture

**Frontend:** React + TypeScript
**Backend:** Node.js + Express
**Database:** MongoDB (via Mongoose ORM)
**AI Simulation:** LiveKit SDK (mocked interaction layer)
**Containerization:** Docker & Docker Compose

```
┌─────────────────────────────┐
│        Caller (User)        │
└──────────────┬──────────────┘
               │
               ▼
        AI Agent (LiveKit)
               │
   Knows → Respond directly
   Doesn’t know → Create HelpRequest
               │
               ▼
┌──────────────────────────────┐
│ Human Supervisor Dashboard   │
│  - View pending requests     │
│  - Submit responses          │
│  - View resolved history     │
└──────────────┬───────────────┘
               │
               ▼
  AI follows up with caller &
  updates Knowledge Base (KB)
```

---

## 🧩 Key Features

### 🤖 AI Agent Simulation

* Receives simulated calls (mock endpoints or LiveKit).
* If query is known → responds with KB answer.
* If unknown → triggers a “request help” event.

### 🧍 Supervisor Panel (Frontend)

* Displays all pending, resolved, and unresolved help requests.
* Allows supervisor to reply to pending queries.
* On response, notifies AI to follow up with the customer and update KB.

### 📚 Knowledge Base

* Stores Q&A pairs the AI has learned over time.
* Displays all learned responses in a simple table view.

### 🔄 Request Lifecycle

`Pending → Resolved / Unresolved (Timeout)`

---

## 🧠 Design Decisions

| Aspect                    | Decision                                                                                      | Rationale                                             |
| ------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Help Request Modeling** | `HelpRequest { id, question, status, customerId, createdAt, resolvedAt, supervisorResponse }` | Clean separation between AI queries and human inputs. |
| **Knowledge Base Schema** | `Knowledge { question, answer, source, lastUpdated }`                                         | Enables continuous learning & easy search.            |
| **Supervisor Timeout**    | Requests auto-marked unresolved after configurable TTL (e.g., 10 min).                        | Ensures lifecycle completeness.                       |
| **Scaling**               | Modular microservice-ready design. DB indices on `status`.                                    | Can handle 1,000+ daily requests easily.              |
| **Error Handling**        | Central Express error middleware + try/catch.                                                 | Stability & maintainability.                          |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/human-in-the-loop-ai.git
cd human-in-the-loop-ai
```

### 2️⃣ Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
MONGO_URI=mongodb://mongo:27017/hitl-ai
LIVEKIT_API_KEY=<optional>
LIVEKIT_API_SECRET=<optional>
```

---

## 🐳 Docker Setup (Recommended)

### Build and Run

```bash
docker-compose up --build
```

This starts:

* Backend at `http://localhost:5000`
* Frontend at `http://localhost:5173`
* MongoDB container

---

## 🧰 API Endpoints (Backend)

| Method                           | Endpoint                                                  | Description |
| -------------------------------- | --------------------------------------------------------- | ----------- |
| `POST /api/ai/query`             | Receive question, respond if known or create help request |             |
| `GET /api/requests`              | List all help requests                                    |             |
| `POST /api/requests/:id/respond` | Supervisor submits answer                                 |             |
| `GET /api/knowledge`             | Get all learned answers                                   |             |

---

## 💻 Frontend (React)

* **/requests** — View pending and resolved requests
* **/knowledge** — View learned answers
* **/respond/:id** — Submit supervisor response

Each update automatically triggers backend API calls and updates lifecycle status.

---

## 🧩 Example Flow

**1️⃣ Caller:** “Do you have evening appointments?”
**2️⃣ AI:** Doesn’t know → “Let me check with my supervisor.”
**3️⃣ Backend:** Creates HelpRequest → `status: Pending`
**4️⃣ Supervisor UI:** Displays “evening appointments” query
**5️⃣ Supervisor:** Responds “Yes, 4PM–8PM slots are available.”
**6️⃣ AI:** Console logs → “Following up with caller: Yes, 4PM–8PM slots available.”
**7️⃣ Knowledge Base:** Updated with new Q&A.

---

## 🧪 Testing

Run backend tests:

```bash
npm test
```

Run frontend in development:

```bash
npm run dev
```

---

## 🧱 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   └── routes/
├── Dockerfile
└── server.js

frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── App.jsx
├── Dockerfile
└── vite.config.js
```

---

## 🔐 Future Improvements (Phase 2 Ideas)

* Real-time escalation via LiveKit voice hold/transfer.
* WebSocket live updates for supervisor dashboard.
* Analytics dashboard for AI learning performance.
* Twilio voice integration for real call handling.
* Fine-tuned LLM prompt training per business type.

---

## 🧑‍💻 Author

**Naga Venkata Karthikeya Vempala**
B.Tech, Pragati Engineering College
AI & Full Stack Developer | Frontdesk Assignment
📧 [karthikvempala31@gmail.com](mailto:karthikvempala31@gmail.com)

---

## 🏁 License

MIT License © 2025

---

> 💡 “The best AI is one that learns from humans — not replaces them.” — Frontdesk HITL Philosophy

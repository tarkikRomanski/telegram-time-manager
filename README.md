# Telegram Time Manager Bot ⏱️

A feature-rich Telegram bot for managing tasks, tracking spent time, attaching voice/image notes, and generating detailed activity statistics.

---

## 🚀 Features

- 📝 **Interactive Task Creation**: Step-by-step task creation wizard (Name, Description, Image, Voice notes).
- ⏱️ **Real-time Time Tracking**: Start and pause timer sessions for any task with precision interval logging.
- 📊 **Statistics & Analytics**: Generate total tracked time reports for individual tasks or overall summary across all tasks.
- 🗂️ **Task Management**: List, view, edit, and delete tasks directly within Telegram.
- 🛢️ **MongoDB Integration**: Persistent storage using Mongoose schema models.

---

## 🛠️ Project Structure

```text
├── components/
│   ├── emoji.js       # Unicode emoji helper dictionary
│   ├── formation.js   # HTML formatting and text sanitization helpers
│   └── store.js       # Bot instance & environment config store
├── db/
│   ├── connect.js     # MongoDB connection setup
│   └── Models/
│       ├── Task.js    # Task schema, time-tracking methods & status enums
│       └── User.js    # Telegram user schema & queries
├── endpoints/
│   ├── create.js      # Endpoint: /create wizard initiation
│   ├── deleteTask.js  # Endpoint: /delete task handler
│   ├── editTask.js    # Endpoint: /edit task handler
│   ├── end.js         # Endpoint: /end task creation completion
│   ├── list.js        # Endpoint: /list tasks handler
│   ├── pauseTask.js   # Endpoint: /pause timer handler
│   ├── setDescription.js # Endpoint: Task description/media setter
│   ├── setName.js     # Endpoint: Task name setter
│   ├── show.js        # Endpoint: /show task detail viewer
│   ├── startTask.js   # Endpoint: /start timer handler
│   └── statistic.js   # Endpoint: /statistic report generator
├── index.js           # Main bot entrypoint & command router
├── package.json       # Project dependencies & scripts
└── .example.env       # Environment variable template
```

---

## ⚙️ Configuration & Environment Variables

Copy `.example.env` to `.env` and supply your credentials:

```bash
cp .example.env .env
```

| Variable | Description |
| :--- | :--- |
| `TELEGRAM_TOKEN` | Telegram Bot Token obtained from [@BotFather](https://t.me/BotFather) |
| `MONGO_USER` | MongoDB Database User |
| `MONGO_PASSWORD` | MongoDB Database Password |
| `MONGO_HOST` | MongoDB Host / Connection Cluster URL |
| `MONGO_DB` | MongoDB Database Name |
| `PARSE_MODE` | *(Optional)* Telegram message parse mode (e.g., `HTML`) |

---

## 📖 Bot Commands Reference

| Command | Usage | Description |
| :--- | :--- | :--- |
| `/create` | `/create` | Starts interactive task creation wizard. |
| `/end` | `/end` | Finalizes current task creation step. |
| `/list` | `/list` | Displays a list of all your created tasks. |
| `/show` | `/show [<taskId>\|<name>]` | Shows detailed information for a task. |
| `/start` | `/start [<taskId>\|<name>]` | Starts time tracking for a specified or latest task. |
| `/pause` | `/pause [<taskId>\|<name>]` | Pauses time tracking and records elapsed time. |
| `/edit` | `/edit [<taskId>] [name:<name>] [description:<desc>]` | Edits task name or description. |
| `/delete` | `/delete [<taskId>\|<name>]` | Deletes a specified task. |
| `/statistic` | `/statistic ["all"\|<taskId>]` | Generates time statistics report for a task or all tasks. |

---

## 💻 Installation & Local Running

1. **Clone repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Fill out `.env` with your Telegram Bot Token and MongoDB credentials.

3. **Build & Start Bot**:
   ```bash
   npm run build
   npm start
   ```

---

## 📄 License

ISC License
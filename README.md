# 💬 Messenger App

A modern, real-time messaging application built with React, TypeScript, and Node.js. Features a sleek UI with smooth animations, auto-replies, and a complete mock API backend.

![Messenger App Screenshot](https://via.placeholder.com/800x500/3B82F6/FFFFFF?text=Messenger+App+Demo)

## ✨ Features

### 🎨 **Beautiful UI/UX**
- **Modern Design**: Clean, intuitive interface inspired by popular messaging apps
- **Smooth Animations**: Message slide-ins, typing indicators, and hover effects
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Dark/Light Themes**: Elegant color scheme with proper contrast

### 💬 **Real-time Messaging**
- **Instant Messaging**: Send and receive messages in real-time
- **Auto-replies**: Smart bot responses with 15+ realistic reply templates
- **Typing Indicators**: See when friends are typing with animated dots
- **Message Timestamps**: Clear time display for all messages

### 🌐 **API Integration**
- **RESTful Backend**: Complete Node.js mock server with Express
- **Real HTTP Calls**: Authentic API integration (no mock data in frontend)
- **Error Handling**: Graceful degradation and retry mechanisms
- **Connection Status**: Live online/offline status indicator

### ⚡ **Advanced Features**
- **Live Updates**: Auto-polling for new messages every 2 seconds
- **Multiple Conversations**: Switch between different friends seamlessly
- **Message Persistence**: Messages saved during session
- **Loading States**: Proper feedback for all async operations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/messenger-app.git
   cd messenger-app
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the development servers**
   
   **Terminal 1 - Start the API server:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Start the React app:**
   ```bash
   cd client
   npm start
   ```

5. **Open your browser**
   - React app: http://localhost:3000
   - API server: http://localhost:3001

## 📁 Project Structure

```
messenger-app/
├── 📁 server/                 # Node.js Mock API Server
│   ├── 📄 index.js           # Express server with API routes
│   ├── 📄 package.json       # Server dependencies
│   └── 📄 README.md          # Server documentation
├── 📁 client/                 # React TypeScript App
│   ├── 📁 src/
│   │   ├── 📄 App.tsx         # Main React component
│   │   ├── 📄 index.tsx       # React entry point
│   │   └── 📄 index.css       # Global styles
│   ├── 📁 public/             # Static assets
│   └── 📄 package.json        # Client dependencies
├── 📄 README.md              # This file
└── 📄 .gitignore             # Git ignore rules
```

## 🔌 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/friends` | Get all friends with latest message info |
| `GET` | `/chats/:friendId` | Get all messages for a specific friend |
| `POST` | `/chats/:friendId/messages` | Send a new message |
| `GET` | `/chats/:friendId/messages/latest` | Poll for new messages |
| `GET` | `/health` | Server health check |

### Example API Calls

**Send a message:**
```bash
curl -X POST http://localhost:3001/api/chats/1/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello there!"}'
```

**Get friends list:**
```bash
curl http://localhost:3001/api/friends
```

## 🎮 How to Use

### 💬 **Sending Messages**
1. Select a friend from the left sidebar
2. Type your message in the input field
3. Press `Enter` or click the send button
4. Watch for auto-replies (70% chance, 1-3 second delay)

### 👥 **Managing Conversations**
- **Switch Chats**: Click on different friends to view their conversations
- **Online Status**: Green dot indicates friends who are currently online
- **Unread Messages**: Blue badges show unread message counts
- **Search**: Use the search bar to find specific conversations

### 🔧 **Connection Monitoring**
- **Online Indicator**: Top-right corner shows connection status
- **Offline Mode**: App gracefully handles server disconnections
- **Auto-retry**: Failed messages are automatically retried

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Lucide React** - Beautiful, customizable icons
- **CSS-in-JS** - Scoped styling with JavaScript objects

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Fast, minimal web framework
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Create React App** - Zero-config React setup
- **Nodemon** - Auto-restarting development server
- **ESLint** - Code linting and formatting

## 🎨 Customization

### Adding New Auto-Replies
Edit `server/index.js` and modify the `genericReplies` array:

```javascript
const genericReplies = [
  "That's interesting! Tell me more.",
  "Your custom reply here",
  // Add more replies...
];
```

### Styling Changes
Update the `styles` object in `client/src/App.tsx`:

```javascript
const styles = {
  // Customize colors, spacing, etc.
  primaryColor: '#3b82f6',  // Change primary blue
  backgroundColor: '#f3f4f6', // Change background
  // ...
};
```

### Adding New Friends
Modify the `friends` array in `server/index.js`:

```javascript
let friends = [
  {
    id: '5',
    name: 'Your Friend Name',
    avatar: '👤',
    // ...other properties
  }
];
```

## 🧪 Testing

### Manual Testing Scenarios
1. **Basic Messaging**: Send messages and verify they appear
2. **Auto-Replies**: Wait for automatic friend responses
3. **Multiple Chats**: Switch between friends to test isolation
4. **Connection Loss**: Stop server to test offline mode
5. **Rapid Messages**: Send multiple quick messages

### API Testing
Use tools like Postman or curl to test API endpoints directly:

```bash
# Health check
curl http://localhost:3001/api/health

# Get all friends
curl http://localhost:3001/api/friends

# Send test message
curl -X POST http://localhost:3001/api/chats/1/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Test message"}'
```

## 🚧 Troubleshooting

### Common Issues

**Client can't connect:**
- Ensure server is running on port 3001
- Check browser console for CORS errors
- Verify API_BASE_URL in client code

**No auto-replies:**
- Check server console logs
- Remember: 30% chance of no reply (by design)
- Wait up to 3 seconds for responses

### Development Setup
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 👤 Author

**Your Name**
- Email: ags.mayank022@gmail.com

---
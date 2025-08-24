const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let friends = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: '👩‍💼',
    lastMessage: 'Hey, how are you doing?',
    lastMessageTime: '2m',
    isOnline: true,
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: '👨‍💻',
    lastMessage: 'Thanks for the help earlier!',
    lastMessageTime: '1h',
    isOnline: false,
    unreadCount: 0
  },
  {
    id: '3',
    name: 'Carol Davis',
    avatar: '👩‍🎨',
    lastMessage: 'The project looks great',
    lastMessageTime: '3h',
    isOnline: true,
    unreadCount: 1
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: '👨‍🔬',
    lastMessage: 'See you tomorrow!',
    lastMessageTime: '1d',
    isOnline: false,
    unreadCount: 0
  }
];

let chats = {
  '1': [
    {
      id: uuidv4(),
      text: 'Hey! How are you doing today?',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      isOwnMessage: false,
      sender: 'Alice Johnson'
    },
    {
      id: uuidv4(),
      text: 'I\'m doing great! Just finished a big project at work. How about you?',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      isOwnMessage: true,
      sender: 'You'
    },
    {
      id: uuidv4(),
      text: 'That\'s awesome! I\'m good too, just taking a break.',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      isOwnMessage: false,
      sender: 'Alice Johnson'
    }
  ],
  '2': [
    {
      id: uuidv4(),
      text: 'Thanks for helping me with the code review yesterday!',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isOwnMessage: false,
      sender: 'Bob Smith'
    },
    {
      id: uuidv4(),
      text: 'No problem! Happy to help anytime.',
      timestamp: new Date(Date.now() - 3540000).toISOString(),
      isOwnMessage: true,
      sender: 'You'
    }
  ],
  '3': [
    {
      id: uuidv4(),
      text: 'The design mockups look fantastic!',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isOwnMessage: false,
      sender: 'Carol Davis'
    }
  ],
  '4': [
    {
      id: uuidv4(),
      text: 'Ready for tomorrow\'s presentation?',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isOwnMessage: false,
      sender: 'David Wilson'
    }
  ]
};

// Generic replies for auto-responses
const genericReplies = [
  "That's interesting! Tell me more.",
  "I see what you mean.",
  "Thanks for sharing that!",
  "Got it! 👍",
  "That makes sense.",
  "I agree with that.",
  "Sounds good to me!",
  "Interesting perspective!",
  "Thanks for letting me know.",
  "I'll think about that.",
  "That's a good point.",
  "Nice! 😊",
  "Cool! Thanks for the update.",
  "I appreciate you telling me.",
  "That sounds great!"
];

// Utility function to get random reply
const getRandomReply = () => {
  return genericReplies[Math.floor(Math.random() * genericReplies.length)];
};

// Utility function to format time ago
const getTimeAgo = (timestamp) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInMs = now - messageTime;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
};

// API Routes

// GET /api/friends - Get all friends
app.get('/api/friends', (req, res) => {
  console.log('📋 GET /api/friends - Fetching friends list');
  
  // Update last message times dynamically
  const updatedFriends = friends.map(friend => {
    const friendChats = chats[friend.id] || [];
    if (friendChats.length > 0) {
      const lastMessage = friendChats[friendChats.length - 1];
      return {
        ...friend,
        lastMessage: lastMessage.text,
        lastMessageTime: getTimeAgo(lastMessage.timestamp)
      };
    }
    return friend;
  });
  
  res.json(updatedFriends);
});

// GET /api/chats/:friendId - Get chat messages for a specific friend
app.get('/api/chats/:friendId', (req, res) => {
  const { friendId } = req.params;
  console.log(`💬 GET /api/chats/${friendId} - Fetching chat messages`);
  
  const friendChats = chats[friendId] || [];
  res.json(friendChats);
});

// POST /api/chats/:friendId/messages - Send a message to a friend
app.post('/api/chats/:friendId/messages', (req, res) => {
  const { friendId } = req.params;
  const { text } = req.body;
  
  console.log(`📤 POST /api/chats/${friendId}/messages - Sending message: "${text}"`);
  
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  // Create user message
  const userMessage = {
    id: uuidv4(),
    text: text.trim(),
    timestamp: new Date().toISOString(),
    isOwnMessage: true,
    sender: 'You'
  };

  // Add to chats
  if (!chats[friendId]) {
    chats[friendId] = [];
  }
  chats[friendId].push(userMessage);

  // Update friend's last message
  const friendIndex = friends.findIndex(f => f.id === friendId);
  if (friendIndex !== -1) {
    friends[friendIndex].lastMessage = text.trim();
    friends[friendIndex].lastMessageTime = 'now';
  }

  console.log(`✅ Message sent successfully`);
  res.status(201).json(userMessage);

  // Simulate friend's auto-reply after 1-3 seconds
  const replyDelay = 1000 + Math.random() * 2000;
  setTimeout(() => {
    // 70% chance of getting a reply
    if (Math.random() > 0.3) {
      const friendReply = {
        id: uuidv4(),
        text: getRandomReply(),
        timestamp: new Date().toISOString(),
        isOwnMessage: false,
        sender: friends[friendIndex]?.name || 'Friend'
      };

      chats[friendId].push(friendReply);
      
      // Update friend's last message
      if (friendIndex !== -1) {
        friends[friendIndex].lastMessage = friendReply.text;
        friends[friendIndex].lastMessageTime = 'now';
      }

      console.log(`🤖 Auto-reply sent: "${friendReply.text}"`);
    }
  }, replyDelay);
});

// GET /api/chats/:friendId/messages/latest - Get latest messages (for polling)
app.get('/api/chats/:friendId/messages/latest', (req, res) => {
  const { friendId } = req.params;
  const { after } = req.query; // timestamp to get messages after
  
  console.log(`🔄 GET /api/chats/${friendId}/messages/latest - Checking for new messages`);
  
  const friendChats = chats[friendId] || [];
  
  if (after) {
    const afterDate = new Date(after);
    const newMessages = friendChats.filter(msg => new Date(msg.timestamp) > afterDate);
    res.json(newMessages);
  } else {
    res.json(friendChats);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Messenger API Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   GET  /api/friends`);
  console.log(`   GET  /api/chats/:friendId`);
  console.log(`   POST /api/chats/:friendId/messages`);
  console.log(`   GET  /api/chats/:friendId/messages/latest`);
  console.log(`   GET  /api/health`);
  console.log(`\n🎯 Ready to receive requests!`);
});
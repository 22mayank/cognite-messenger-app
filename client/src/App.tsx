import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Info, Wifi, WifiOff } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwnMessage: boolean;
  sender: string;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline: boolean;
  unreadCount?: number;
}

const API_BASE_URL = 'http://localhost:3001/api';

const MessengerApp: React.FC = () => {
  // Styles (same as before, abbreviated for space)
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    sidebar: {
      width: '320px',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column' as const
    },
    sidebarHeader: {
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
      position: 'relative' as const
    },
    connectionStatus: {
      position: 'absolute' as const,
      top: '8px',
      right: '8px',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    connectionOnline: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    connectionOffline: {
      backgroundColor: '#fecaca',
      color: '#991b1b'
    },
    sidebarTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '12px',
      margin: '0 0 12px 0'
    },
    searchContainer: {
      position: 'relative' as const
    },
    searchInput: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '8px',
      paddingBottom: '8px',
      backgroundColor: '#f3f4f6',
      border: 'none',
      borderRadius: '20px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s'
    },
    searchIcon: {
      position: 'absolute' as const,
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      width: '16px',
      height: '16px'
    },
    friendsList: {
      flex: 1,
      overflowY: 'auto' as const
    },
    friendItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      borderRight: '2px solid transparent'
    },
    friendItemSelected: {
      backgroundColor: '#eff6ff',
      borderRightColor: '#3b82f6'
    },
    friendItemHover: {
      backgroundColor: '#f9fafb'
    },
    avatarContainer: {
      position: 'relative' as const
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px',
      fontWeight: '500'
    },
    onlineIndicator: {
      position: 'absolute' as const,
      bottom: '-2px',
      right: '-2px',
      width: '16px',
      height: '16px',
      backgroundColor: '#10b981',
      border: '2px solid white',
      borderRadius: '50%'
    },
    friendInfo: {
      marginLeft: '12px',
      flex: 1,
      minWidth: 0
    },
    friendName: {
      fontWeight: '500',
      color: '#111827',
      fontSize: '14px',
      marginBottom: '2px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const
    },
    friendLastMessage: {
      fontSize: '12px',
      color: '#6b7280',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const
    },
    friendTime: {
      fontSize: '11px',
      color: '#9ca3af',
      marginLeft: '8px'
    },
    unreadBadge: {
      backgroundColor: '#3b82f6',
      color: 'white',
      fontSize: '11px',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '8px'
    },
    chatArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const
    },
    chatHeader: {
      padding: '16px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    chatHeaderLeft: {
      display: 'flex',
      alignItems: 'center'
    },
    chatHeaderAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '500'
    },
    chatHeaderInfo: {
      marginLeft: '12px'
    },
    chatHeaderName: {
      fontWeight: '500',
      color: '#111827',
      fontSize: '16px'
    },
    chatHeaderStatus: {
      fontSize: '12px',
      color: '#6b7280'
    },
    chatHeaderActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    actionButton: {
      padding: '8px',
      color: '#6b7280',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '16px',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px'
    },
    messageWrapper: {
      display: 'flex',
      animation: 'slideIn 0.3s ease-out'
    },
    messageWrapperOwn: {
      justifyContent: 'flex-end'
    },
    messageWrapperOther: {
      justifyContent: 'flex-start'
    },
    message: {
      maxWidth: '300px',
      padding: '12px 16px',
      borderRadius: '18px',
      transition: 'all 0.2s'
    },
    messageOwn: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderBottomRightRadius: '6px'
    },
    messageOther: {
      backgroundColor: 'white',
      color: '#374151',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderBottomLeftRadius: '6px'
    },
    messageText: {
      fontSize: '14px',
      lineHeight: '1.4'
    },
    messageTime: {
      fontSize: '11px',
      marginTop: '4px',
      opacity: 0.7
    },
    typingIndicator: {
      display: 'flex',
      justifyContent: 'flex-start',
      animation: 'slideIn 0.3s ease-out'
    },
    typingBubble: {
      backgroundColor: 'white',
      borderRadius: '18px',
      borderBottomLeftRadius: '6px',
      padding: '12px 16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    typingDots: {
      display: 'flex',
      gap: '4px'
    },
    typingDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#9ca3af',
      borderRadius: '50%',
      animation: 'bounce 1.4s ease-in-out infinite both'
    },
    inputArea: {
      padding: '16px',
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb'
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '12px'
    },
    messageInput: {
      flex: 1,
      padding: '12px 16px',
      backgroundColor: '#f3f4f6',
      border: 'none',
      borderRadius: '20px',
      fontSize: '14px',
      outline: 'none',
      resize: 'none' as const,
      transition: 'all 0.2s'
    },
    sendButton: {
      padding: '12px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    sendButtonActive: {
      backgroundColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
      transform: 'scale(1.05)'
    },
    sendButtonInactive: {
      backgroundColor: '#e5e7eb',
      color: '#9ca3af'
    },
    emptyState: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    },
    emptyStateContent: {
      textAlign: 'center' as const
    },
    emptyStateIcon: {
      width: '96px',
      height: '96px',
      margin: '0 auto 16px',
      background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    emptyStateTitle: {
      fontSize: '20px',
      fontWeight: '500',
      color: '#111827',
      marginBottom: '8px'
    },
    emptyStateDescription: {
      color: '#6b7280'
    },
    loadingState: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column' as const,
      gap: '12px',
      color: '#6b7280'
    }
  };

  // Add CSS animations
  const cssAnimations = `
    @keyframes slideIn {
      from {
        transform: translateY(16px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }
    
    .typing-dot-1 { animation-delay: -0.32s; }
    .typing-dot-2 { animation-delay: -0.16s; }
    .typing-dot-3 { animation-delay: 0s; }
  `;

  // State
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [hoveredFriend, setHoveredFriend] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // API Functions
  const fetchFriends = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/friends`);
      if (!response.ok) throw new Error('Failed to fetch friends');
      const data = await response.json();
      setFriends(data);
      setIsOnline(true);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setIsOnline(false);
    }
  }, []);

  const fetchMessages = useCallback(async (friendId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${friendId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
      setIsOnline(true);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setIsOnline(false);
    }
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend || isSending) return;

    setIsSending(true);
    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately

    try {
      const response = await fetch(`${API_BASE_URL}/chats/${selectedFriend.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: messageText }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const sentMessage = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      setIsOnline(true);

      // Refresh friends list to update last message
      await fetchFriends();

    } catch (error) {
      console.error('Error sending message:', error);
      setIsOnline(false);
      // Restore message on error
      setNewMessage(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const pollForNewMessages = useCallback(async (friendId: string) => {
    if (!friendId || messages.length === 0) return;

    try {
      const lastMessage = messages[messages.length - 1];
      const response = await fetch(
        `${API_BASE_URL}/chats/${friendId}/messages/latest?after=${lastMessage.timestamp}`
      );
      
      if (!response.ok) return;
      
      const newMessages = await response.json();
      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
        await fetchFriends(); // Update friends list
      }
      setIsOnline(true);
    } catch (error) {
      console.error('Error polling for messages:', error);
      setIsOnline(false);
    }
  }, [messages, fetchFriends]);

  // Effects
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      await fetchFriends();
      setIsLoading(false);
    };

    initializeApp();
  }, [fetchFriends]);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend.id);
      messageInputRef.current?.focus();
    }
  }, [selectedFriend, fetchMessages]);

  // Polling for new messages
  useEffect(() => {
    if (selectedFriend) {
      pollIntervalRef.current = setInterval(() => {
        pollForNewMessages(selectedFriend.id);
      }, 2000);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [selectedFriend, pollForNewMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format time
  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isLoading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: cssAnimations }} />
        <div style={styles.container}>
          <div style={styles.loadingState}>
            <div>Loading messenger...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssAnimations }} />
      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Header */}
          <div style={styles.sidebarHeader}>
            <div style={{
              ...styles.connectionStatus,
              ...(isOnline ? styles.connectionOnline : styles.connectionOffline)
            }}>
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isOnline ? 'Online' : 'Offline'}
            </div>
            <h1 style={styles.sidebarTitle}>Messages</h1>
            <div style={styles.searchContainer}>
              <Search style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search conversations..."
                style={styles.searchInput}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = '0 0 0 2px #3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Friends List */}
          <div style={styles.friendsList}>
            {friends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                onMouseEnter={() => setHoveredFriend(friend.id)}
                onMouseLeave={() => setHoveredFriend(null)}
                style={{
                  ...styles.friendItem,
                  ...(selectedFriend?.id === friend.id ? styles.friendItemSelected : {}),
                  ...(hoveredFriend === friend.id && selectedFriend?.id !== friend.id ? styles.friendItemHover : {})
                }}
              >
                <div style={styles.avatarContainer}>
                  <div style={styles.avatar}>
                    {friend.avatar}
                  </div>
                  {friend.isOnline && <div style={styles.onlineIndicator}></div>}
                </div>
                <div style={styles.friendInfo}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={styles.friendName}>{friend.name}</h3>
                    <span style={styles.friendTime}>{friend.lastMessageTime}</span>
                  </div>
                  <p style={styles.friendLastMessage}>{friend.lastMessage}</p>
                </div>
                {friend.unreadCount && friend.unreadCount > 0 && (
                  <div style={styles.unreadBadge}>
                    {friend.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={styles.chatArea}>
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <div style={styles.chatHeaderLeft}>
                  <div style={styles.avatarContainer}>
                    <div style={styles.chatHeaderAvatar}>
                      {selectedFriend.avatar}
                    </div>
                    {selectedFriend.isOnline && <div style={{...styles.onlineIndicator, width: '12px', height: '12px'}}></div>}
                  </div>
                  <div style={styles.chatHeaderInfo}>
                    <h2 style={styles.chatHeaderName}>{selectedFriend.name}</h2>
                    <p style={styles.chatHeaderStatus}>
                      {selectedFriend.isOnline ? 'Active now' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                <div style={styles.chatHeaderActions}>
                  <button 
                    style={styles.actionButton}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Phone size={20} />
                  </button>
                  <button 
                    style={styles.actionButton}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Video size={20} />
                  </button>
                  <button 
                    style={styles.actionButton}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Info size={20} />
                  </button>
                  <button 
                    style={styles.actionButton}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div style={styles.messagesContainer}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      ...styles.messageWrapper,
                      ...(message.isOwnMessage ? styles.messageWrapperOwn : styles.messageWrapperOther)
                    }}
                  >
                    <div
                      style={{
                        ...styles.message,
                        ...(message.isOwnMessage ? styles.messageOwn : styles.messageOther)
                      }}
                      onMouseEnter={(e) => {
                        if (!message.isOwnMessage) {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!message.isOwnMessage) {
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        }
                      }}
                    >
                      <p style={styles.messageText}>{message.text}</p>
                      <p style={{
                        ...styles.messageTime,
                        color: message.isOwnMessage ? 'rgba(255,255,255,0.7)' : '#6b7280'
                      }}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div style={styles.typingIndicator}>
                    <div style={styles.typingBubble}>
                      <div style={styles.typingDots}>
                        <div style={{...styles.typingDot}} className="typing-dot-1"></div>
                        <div style={{...styles.typingDot}} className="typing-dot-2"></div>
                        <div style={{...styles.typingDot}} className="typing-dot-3"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={styles.inputArea}>
                <div style={styles.inputContainer}>
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isOnline ? "Type a message..." : "Reconnecting..."}
                    disabled={!isOnline || isSending}
                    style={{
                      ...styles.messageInput,
                      opacity: (!isOnline || isSending) ? 0.6 : 1
                    }}
                    onFocus={(e) => {
                      if (isOnline) {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 0 0 2px #3b82f6';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || !isOnline || isSending}
                    style={{
                      ...styles.sendButton,
                      ...(newMessage.trim() && isOnline && !isSending ? styles.sendButtonActive : styles.sendButtonInactive),
                      opacity: isSending ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (newMessage.trim() && isOnline && !isSending) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newMessage.trim() && isOnline && !isSending) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                      }
                    }}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateContent}>
                <div style={styles.emptyStateIcon}>
                  <Send size={48} />
                </div>
                <h3 style={styles.emptyStateTitle}>Select a conversation</h3>
                <p style={styles.emptyStateDescription}>Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessengerApp;
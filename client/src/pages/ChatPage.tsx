import React, { useEffect, useState, useRef } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { Send, ArrowLeft } from 'lucide-react';
import { chatAPI, getUser, isLoggedIn, getToken } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

const ChatPage: React.FC = () => {
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [socketRef, setSocketRef] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/auth'); return; }
    loadChatUsers();

    // Connect socket
    const token = getToken();
    if (token) {
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(SOCKET_URL, { query: { token } });
      socket.on('receive_message', (msg: any) => {
        setMessages(prev => [...prev, msg]);
      });
      setSocketRef(socket);
      return () => { socket.disconnect(); };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatUsers = async () => {
    try {
      const res = await chatAPI.getUsers();
      setChatUsers(res.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const selectUser = async (user: any) => {
    setSelectedUser(user);
    try {
      const res = await chatAPI.getMessages(user._id);
      setMessages(res.data || []);
    } catch (err) { console.error(err); }
  };

  const sendMessage = () => {
    if (!newMsg.trim() || !selectedUser || !socketRef) return;
    socketRef.emit('send_message', { receiverId: selectedUser._id, content: newMsg });
    // Optimistic add
    setMessages(prev => [...prev, { sender: { _id: currentUser?._id }, receiver: { _id: selectedUser._id }, content: newMsg, createdAt: new Date().toISOString() }]);
    setNewMsg('');
  };

  if (loading) return <div className="flex justify-center items-center min-h-[50vh]"><div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-primary animate-spin" /></div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Users List */}
      <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 shrink-0`}>
        <h2 className="text-2xl font-bold mb-4">Messages</h2>
        <GlassCard className="flex-1 overflow-y-auto p-2">
          {chatUsers.length > 0 ? chatUsers.map(u => (
            <button key={u._id} onClick={() => selectUser(u)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${selectedUser?._id === u._id ? 'bg-primary/10' : 'hover:bg-white/5'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-white font-bold shrink-0">{u.name?.[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{u.name}</p>
                <p className="text-xs text-white/50 truncate">{u.lastMessage || 'Start a conversation'}</p>
              </div>
              {u.unreadCount > 0 && <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">{u.unreadCount}</div>}
            </button>
          )) : (
            <div className="p-6 text-center text-white/50 font-medium text-sm">Connect with students to start chatting.</div>
          )}
        </GlassCard>
      </div>

      {/* Chat Area */}
      <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
        {selectedUser ? (
          <>
            <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
              <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 hover:bg-white/10 rounded-lg"><ArrowLeft size={20} /></button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-accent-cyan/60 flex items-center justify-center text-white font-bold">{selectedUser.name?.[0]}</div>
              <div><p className="font-bold">{selectedUser.name}</p><p className="text-xs text-white/50">Connected</p></div>
            </div>
            <GlassCard className="flex-1 overflow-y-auto p-4 mb-4">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => {
                  const isMine = (msg.sender?._id || msg.sender) === currentUser?._id;
                  return (
                    <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm font-medium ${isMine ? 'bg-primary text-white rounded-br-md' : 'bg-white/10 text-white rounded-bl-md'}`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </GlassCard>
            <div className="flex gap-3">
              <GlassInput placeholder="Type a message..." value={newMsg} onChange={e => setNewMsg(e.target.value)} className="flex-1" onKeyDown={(e: any) => e.key === 'Enter' && sendMessage()} />
              <button onClick={sendMessage} className="p-3 bg-primary hover:bg-primary-dark rounded-xl text-white transition-colors"><Send size={20} /></button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <GlassCard className="max-w-md w-full p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Messages</h2>
              <p className="text-white/60 mb-6">Select a connection to start chatting.</p>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

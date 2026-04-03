import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';

const ChatPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
      <GlassCard className="max-w-md w-full p-8 text-center bg-white/5 mx-4">
        <h2 className="text-2xl font-bold mb-4">Messages</h2>
        <p className="text-white/60 mb-6">Connect with fellow students to start chatting.</p>
        <div className="flex flex-col gap-3">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 opacity-50">No active conversations</div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ChatPage;

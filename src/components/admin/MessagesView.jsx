import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  CornerDownRight, 
  Calendar, 
  Send, 
  Inbox
} from 'lucide-react';

const MessagesView = ({ messages, replyToMessage, addToast }) => {
  const [filterType, setFilterType] = useState('All'); // All, Unreplied, Replied
  const [selectedMessage, setSelectedMessage] = useState(null); // Message for reply modal
  const [replyText, setReplyText] = useState('');

  // Filters
  const filteredMessages = messages.filter(m => {
    if (filterType === 'Unreplied') return !m.replied;
    if (filterType === 'Replied') return m.replied;
    return true;
  });

  const unrepliedCount = messages.filter(m => !m.replied).length;

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      addToast('Please type a response before sending.', 'error');
      return;
    }

    replyToMessage(selectedMessage.id, replyText);
    addToast(`Reply dispatched to ${selectedMessage.email}`, 'success');
    setReplyText('');
    setSelectedMessage(null);
  };

  const openReplyModal = (msg) => {
    setSelectedMessage(msg);
    setReplyText('');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-wide text-stone-900 dark:text-white">Concierge Desk</h1>
          <p className="text-xs tracking-wider uppercase text-stone-500 dark:text-amber-500/70 font-mono mt-1">
            Manage inquiries, feedback, and bulk corporate orders
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-stone-105 dark:bg-neutral-900 border border-stone-200 dark:border-white/5 px-4 py-2 rounded-lg text-stone-600 dark:text-stone-300">
          Unanswered Inquiries: <span className="font-bold text-amber-500">{unrepliedCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-stone-200 dark:border-white/5 gap-4">
        {['All', 'Unreplied', 'Replied'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`pb-3 text-xs uppercase font-mono tracking-wider transition-colors relative cursor-pointer focus:outline-none ${
              filterType === type 
                ? 'text-amber-600 dark:text-amber-400 font-semibold' 
                : 'text-stone-400 dark:text-zinc-500 hover:text-stone-700 dark:hover:text-zinc-300'
            }`}
          >
            {type} Inquiries
            {type === 'Unreplied' && unrepliedCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] bg-amber-500 text-black font-bold font-mono">
                {unrepliedCount}
              </span>
            )}
            {filterType === type && (
              <motion.span 
                layoutId="messageTabUnderline" 
                className="absolute bottom-0 left-0 w-full h-[1.5px] bg-amber-500" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Cards list */}
      <div className="space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((m) => (
            <motion.div
              layout
              key={m.id}
              className={`bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border p-6 rounded-xl shadow-sm flex flex-col justify-between transition-all ${
                !m.replied 
                  ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.02)]' 
                  : 'border-stone-200/60 dark:border-white/5'
              }`}
            >
              <div>
                <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      {m.name}
                      {!m.replied && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
                      )}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400 dark:text-zinc-550 mt-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{m.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-[10px] text-stone-400 dark:text-zinc-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(m.date)}
                    </span>
                    {!m.replied ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 uppercase tracking-wider">
                        Pending
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 uppercase tracking-wider">
                        Replied
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-stone-50/50 dark:bg-neutral-950/60 rounded-lg text-xs leading-relaxed font-light text-stone-700 dark:text-stone-300 italic border border-stone-200/30 dark:border-white/5 relative">
                  <MessageSquare className="w-4 h-4 text-stone-400 dark:text-zinc-700 absolute top-3 right-3 opacity-30 pointer-events-none" />
                  "{m.message}"
                </div>

                {/* If replied, show previous answer */}
                {m.replied && m.replyText && (
                  <div className="mt-4 pl-4 border-l-2 border-amber-500/40 space-y-1.5 text-xs text-stone-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1 font-mono uppercase tracking-widest text-[9px] text-amber-600 dark:text-amber-550 font-bold">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      Concierge Dispatched Reply
                    </div>
                    <p className="font-light leading-relaxed">"{m.replyText}"</p>
                  </div>
                )}
              </div>

              {/* Action reply button */}
              {!m.replied && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => openReplyModal(m)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-amber-500/30 hover:border-amber-500 text-amber-500 hover:text-black hover:bg-amber-500 text-[10px] tracking-wider uppercase font-semibold transition-all rounded-none cursor-pointer focus:outline-none"
                  >
                    Draft Concierge Reply
                  </button>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-12 text-center rounded-xl shadow-sm flex flex-col items-center justify-center">
            <Inbox className="w-8 h-8 text-stone-450 mb-3" />
            <p className="text-stone-450 dark:text-zinc-500 font-mono text-xs">No customer messages matching tab segment.</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-50 dark:bg-[#141311] border border-stone-200 dark:border-white/10 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 w-full" />
              
              <div className="p-6 pb-4 border-b border-stone-200 dark:border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-serif text-stone-900 dark:text-white font-bold">Reply to {selectedMessage.name}</h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400 dark:text-zinc-550">{selectedMessage.email}</span>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-stone-400 hover:text-amber-500 transition-colors text-lg focus:outline-none"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleReplySubmit} className="p-6 space-y-4 text-xs">
                {/* original message preview */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-stone-400 dark:text-zinc-550 uppercase tracking-widest font-mono font-bold">Customer Inquire</label>
                  <div className="p-3 bg-stone-100 dark:bg-neutral-950 text-stone-650 dark:text-zinc-400 italic rounded leading-relaxed border border-stone-200/50 dark:border-white/5">
                    "{selectedMessage.message}"
                  </div>
                </div>

                {/* Reply draft input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-stone-550 dark:text-zinc-400 uppercase tracking-widest font-mono font-bold">Compose Concierge Response *</label>
                  <textarea
                    required
                    rows="6"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Hello! Thank you for writing to L'Épice. We are delighted to assist..."
                    className="w-full p-3 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500 leading-relaxed font-light"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-stone-200 dark:border-white/5 font-mono">
                  <button
                    type="button"
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 bg-stone-250 hover:bg-stone-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                  >
                    Discard Draft
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Dispatch Email
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagesView;

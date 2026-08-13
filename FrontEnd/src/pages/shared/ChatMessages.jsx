// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useLocation, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { useChat } from '../../context/ChatContext';
// import {
//   HiOutlineChatAlt2,
//   HiChevronLeft,
//   HiPaperAirplane,
//   HiOutlineTrash,
//   HiOutlineBan,
//   HiOutlineUser,
//   HiOutlineUserGroup,
// } from 'react-icons/hi';
// import Navbar from '../../components/common/Navbar';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const ChatMessage = () => {
//   const { user, token } = useAuth();
//   const location = useLocation();
//   const { chatId } = useParams();
//   const { socket, activeChat, setActiveChat, joinChat, sendMessage } = useChat();

//   const [conversations, setConversations] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const messagesEndRef = useRef(null);

//   // Block sellers and admins (only buyers can access this page)
//   // if (user?.role === 'seller') {
//   //   return (
//   //     <div className="min-h-screen bg-gray-50">
//   //       <Navbar />
//   //       <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
//   //         <div className="w-20 h-20 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-6">
//   //           <HiOutlineBan size={40} />
//   //         </div>
//   //         <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
//   //         <p className="text-gray-500 max-w-md">
//   //           Messages are only available for buyers. Sellers cannot access messages.
//   //         </p>
//   //         <a
//   //           href="/dashboard"
//   //           className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
//   //         >
//   //           Go to Dashboard
//   //         </a>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   if (user?.role === 'admin') {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
//           <div className="w-20 h-20 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-6">
//             <HiOutlineBan size={40} />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
//           <p className="text-gray-500 max-w-md">
//             Messages are only available for buyers. Admins cannot access messages.
//           </p>
//           <a
//             href="/admin-dashboard"
//             className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
//           >
//             Go to Admin Dashboard
//           </a>
//         </div>
//       </div>
//     );
//   }

//   // Scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   // Fetch conversations
//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/api/chat/user`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const fetchedConversations = res.data;
//         setConversations(fetchedConversations);

//         if (location.state?.chat) {
//           const existingChat = fetchedConversations.find(
//             (c) => c._id === location.state.chat._id
//           );
//           setActiveChat(existingChat || location.state.chat);
//         } else if (chatId) {
//           const chatFromUrl = fetchedConversations.find(c => c._id === chatId);
//           if (chatFromUrl) {
//             setActiveChat(chatFromUrl);
//           } else {
//             setActiveChat({ _id: chatId });
//           }
//         }

//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching conversations:', err);
//         setLoading(false);
//       }
//     };

//     if (user && token) {
//       fetchConversations();
//     }
//   }, [user, token, location.state, chatId, setActiveChat]);

//   // Fetch messages when activeChat changes
//   useEffect(() => {
//     if (!activeChat) return;

//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/api/chat/${activeChat._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setMessages(res.data.messages || []);
//         joinChat(activeChat._id);
//         scrollToBottom();
//       } catch (err) {
//         console.error('Error fetching messages:', err);
//       }
//     };

//     fetchMessages();
//   }, [activeChat, token, joinChat]);

//   // Socket listener
//   useEffect(() => {
//     if (!socket) return;

//     const handleReceiveMessage = (data) => {
//       if (activeChat && data.chatId === activeChat._id) {
//         setMessages((prev) => [...prev, data]);
//       }
//     };

//     socket.on('receiveMessage', handleReceiveMessage);

//     return () => {
//       socket.off('receiveMessage', handleReceiveMessage);
//     };
//   }, [socket, activeChat]);

//   // Scroll on new messages
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Additional scroll delay
//   useEffect(() => {
//     if (activeChat) {
//       const timer = setTimeout(() => scrollToBottom(), 100);
//       return () => clearTimeout(timer);
//     }
//   }, [activeChat]);

//   // Send message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !activeChat) return;

//     const textToSend = newMessage;
//     setNewMessage('');

//     try {
//       const res = await axios.post(
//         `${API_URL}/api/chat/send`,
//         {
//           chatId: activeChat._id,
//           text: textToSend,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (res.data.newMessage) {
//         setMessages((prev) => [...prev, res.data.newMessage]);
//       }
//       scrollToBottom();
//     } catch (err) {
//       console.error('Error sending message:', err);
//       setNewMessage(textToSend);
//     }
//   };

//   // Delete conversation
//   const handleDeleteChat = async (e, chatId) => {
//     e.stopPropagation();
//     if (!window.confirm('Are you sure you want to delete this conversation?'))
//       return;

//     try {
//       await axios.delete(`${API_URL}/api/chat/${chatId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setConversations((prev) => prev.filter((c) => c._id !== chatId));
//       if (activeChat?._id === chatId) setActiveChat(null);
//     } catch (err) {
//       console.error('Error deleting chat:', err);
//     }
//   };

//   // Delete single message
//   const handleDeleteMessage = async (chatId, messageId) => {
//     if (!window.confirm('Delete this message?')) return;

//     try {
//       const res = await axios.delete(
//         `${API_URL}/api/chat/${chatId}/message/${messageId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setMessages(res.data.chat.messages);
//     } catch (err) {
//       console.error('Error deleting message:', err);
//     }
//   };

//   // Get other participant with role
//   const getChatPartner = (chat) => {
//     const isBuyer = user._id === chat.buyer?._id;
//     return isBuyer ? chat.seller : chat.buyer;
//   };

//   const getPartnerRole = (chat) => {
//     const isBuyer = user._id === chat.buyer?._id;
//     return isBuyer ? 'Seller' : 'Buyer';
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-50">
//         <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="flex h-[calc(100vh-64px)] pt-4 px-4 md:px-6 max-w-7xl mx-auto">
//         {/* Sidebar – conversation list */}
//         <div
//           className={`w-full md:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
//             activeChat ? 'hidden md:block' : 'block'
//           }`}
//         >
//           <div className="p-4 border-b border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
//           </div>
//           <div className="h-[calc(100%-80px)] overflow-y-auto">
//             {conversations.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-64 text-gray-400">
//                 <HiOutlineChatAlt2 size={48} className="mb-2" />
//                 <p>No conversations yet</p>
//               </div>
//             ) : (
//               conversations.map((chat) => {
//                 const partner = getChatPartner(chat);
//                 const role = getPartnerRole(chat);
//                 return (
//                   <div
//                     key={chat._id}
//                     onClick={() => setActiveChat(chat)}
//                     className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
//                       activeChat?._id === chat._id ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''
//                     }`}
//                   >
//                     <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
//                       {partner?.profilePic ? (
//                         <img
//                           src={partner.profilePic}
//                           alt=""
//                           className="w-10 h-10 rounded-full object-cover"
//                         />
//                       ) : (
//                         partner?.name?.charAt(0).toUpperCase()
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-center">
//                         <span className="font-medium text-gray-800 truncate">
//                           {partner?.name}
//                         </span>
//                         <button
//                           onClick={(e) => handleDeleteChat(e, chat._id)}
//                           className="text-gray-400 hover:text-red-500 transition"
//                           title="Delete conversation"
//                         >
//                           <HiOutlineTrash size={16} />
//                         </button>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
//                           {role}
//                         </span>
//                         <p className="text-sm text-gray-500 truncate flex-1">
//                           {chat.messages?.at(-1)?.text || 'Started a conversation'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>

//         {/* Main chat area */}
//         <div className="flex-1 md:ml-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
//           {activeChat ? (
//             <>
//               {/* Chat header with role badge */}
//               <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
//                 <button
//                   onClick={() => setActiveChat(null)}
//                   className="md:hidden text-gray-600 hover:text-emerald-600"
//                 >
//                   <HiChevronLeft size={24} />
//                 </button>
//                 <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
//                   {getChatPartner(activeChat)?.profilePic ? (
//                     <img
//                       src={getChatPartner(activeChat).profilePic}
//                       alt=""
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   ) : (
//                     getChatPartner(activeChat)?.name?.charAt(0).toUpperCase()
//                   )}
//                 </div>
//                 <div>
//                   <div className="font-semibold text-gray-800">
//                     {getChatPartner(activeChat)?.name}
//                   </div>
//                   <div className="flex items-center gap-1 text-xs text-gray-500">
//                     <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
//                       {getPartnerRole(activeChat)}
//                     </span>
//                     <span className="text-gray-300">•</span>
//                     <span>Online</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/30">
//                 {messages.map((msg) => {
//                   const isOwn = (msg.sender?._id || msg.sender) === user._id;
//                   return (
//                     <div
//                       key={msg._id || Date.now() + Math.random()}
//                       className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
//                     >
//                       <div
//                         className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm ${
//                           isOwn
//                             ? 'bg-emerald-600 text-white rounded-br-none'
//                             : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
//                         }`}
//                       >
//                         {!isOwn && (
//                           <div className="text-xs font-medium text-emerald-600 mb-1 flex items-center gap-1">
//                             <HiOutlineUserGroup size={12} />
//                             Seller
//                           </div>
//                         )}
//                         {isOwn && (
//                           <div className="text-xs font-medium text-emerald-200 mb-1 flex items-center gap-1">
//                             <HiOutlineUser size={12} />
//                             You (Buyer)
//                           </div>
//                         )}
//                         {msg.image && (
//                           <div className="mb-2">
//                             <img
//                               src={msg.image}
//                               alt="Property"
//                               className="rounded-lg max-h-40 object-cover"
//                             />
//                           </div>
//                         )}
//                         <p className="text-sm leading-relaxed">{msg.text}</p>
//                         <div className={`flex items-center gap-1 mt-1 text-[10px] ${isOwn ? 'text-emerald-100' : 'text-gray-400'}`}>
//                           <span>
//                             {new Date(msg.createdAt).toLocaleTimeString([], {
//                               hour: '2-digit',
//                               minute: '2-digit',
//                             })}
//                           </span>
//                           {isOwn && (
//                             <button
//                               onClick={() => handleDeleteMessage(activeChat._id, msg._id)}
//                               className="hover:text-red-300 transition"
//                               title="Delete message"
//                             >
//                               <HiOutlineTrash size={12} />
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Message input */}
//               <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="text"
//                     placeholder="Type a message..."
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//                   />
//                   <button
//                     type="submit"
//                     disabled={!newMessage.trim()}
//                     className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition"
//                   >
//                     <HiPaperAirplane size={20} />
//                   </button>
//                 </div>
//               </form>
//             </>
//           ) : (
//             // No chat selected
//             <div className="flex flex-col items-center justify-center h-full text-gray-400">
//               <HiOutlineChatAlt2 size={64} className="mb-4" />
//               <h3 className="text-xl font-semibold text-gray-600">Your Messages</h3>
//               <p className="text-sm">Select a conversation to start chatting</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;



import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import {
  HiOutlineChatAlt2,
  HiChevronLeft,
  HiPaperAirplane,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import Navbar from '../../components/common/Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ChatMessage = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const { chatId } = useParams();
  const { socket, activeChat, setActiveChat, joinChat, sendMessage } = useChat();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // ❌ Seller block removed – now sellers can access chat
  if (user?.role === 'admin') {
        return (
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
              <div className="w-20 h-20 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-6">
                <HiOutlineBan size={40} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
              <p className="text-gray-500 max-w-md">
                Messages are only available for buyers. Admins cannot access messages.
              </p>
              <a
                href="/admin-dashboard"
                className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
              >
                Go to Admin Dashboard
              </a>
            </div>
          </div>
        );
      }

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/chat/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedConversations = res.data;
        setConversations(fetchedConversations);

        if (location.state?.chat) {
          const existingChat = fetchedConversations.find(
            (c) => c._id === location.state.chat._id
          );
          setActiveChat(existingChat || location.state.chat);
        } else if (chatId) {
          const chatFromUrl = fetchedConversations.find(c => c._id === chatId);
          if (chatFromUrl) {
            setActiveChat(chatFromUrl);
          } else {
            setActiveChat({ _id: chatId });
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setLoading(false);
      }
    };

    if (user && token) {
      fetchConversations();
    }
  }, [user, token, location.state, chatId, setActiveChat]);

  // Fetch messages when activeChat changes
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/chat/${activeChat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages || []);
        joinChat(activeChat._id);
        scrollToBottom();
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [activeChat, token, joinChat]);

  // Socket listener
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (activeChat && data.chatId === activeChat._id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, activeChat]);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Additional scroll delay
  useEffect(() => {
    if (activeChat) {
      const timer = setTimeout(() => scrollToBottom(), 100);
      return () => clearTimeout(timer);
    }
  }, [activeChat]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const textToSend = newMessage;
    setNewMessage('');

    try {
      const res = await axios.post(
        `${API_URL}/api/chat/send`,
        {
          chatId: activeChat._id,
          text: textToSend,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.newMessage) {
        setMessages((prev) => [...prev, res.data.newMessage]);
      }
      scrollToBottom();
    } catch (err) {
      console.error('Error sending message:', err);
      setNewMessage(textToSend);
    }
  };

  // Delete conversation
  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this conversation?'))
      return;

    try {
      await axios.delete(`${API_URL}/api/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConversations((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChat?._id === chatId) setActiveChat(null);
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  // Delete single message
  const handleDeleteMessage = async (chatId, messageId) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      const res = await axios.delete(
        `${API_URL}/api/chat/${chatId}/message/${messageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data.chat.messages);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Get other participant
  const getChatPartner = (chat) => {
    const isBuyer = user._id === chat.buyer?._id;
    return isBuyer ? chat.seller : chat.buyer;
  };

  const getPartnerRole = (chat) => {
    const isBuyer = user._id === chat.buyer?._id;
    return isBuyer ? 'Seller' : 'Buyer';
  };

  // ✅ Dynamic user role label
  const getUserRoleLabel = () => user?.role === 'buyer' ? 'Buyer' : 'Seller';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* ✅ Removed pt-4 – content starts flush with navbar */}
      {/* <div className="flex h-[calc(100vh-64px)] pt-16 px-4 md:px-6 max-w-7xl mx-auto"> */}
      <div className="flex h-[calc(100vh-64px-1cm)] pt-[3cm] px-4 md:px-6 max-w-7xl mx-auto">

{/* Sidebar – conversation list */}
        <div
          className={`w-full md:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
            activeChat ? 'hidden md:block' : 'block'
          }`}
        >
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          </div>
          <div className="h-[calc(100%-80px)] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <HiOutlineChatAlt2 size={48} className="mb-2" />
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((chat) => {
                const partner = getChatPartner(chat);
                const role = getPartnerRole(chat);
                return (
                  <div
                    key={chat._id}
                    onClick={() => setActiveChat(chat)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                      activeChat?._id === chat._id ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {partner?.profilePic ? (
                        <img
                          src={partner.profilePic}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        partner?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800 truncate">
                          {partner?.name}
                        </span>
                        <button
                          onClick={(e) => handleDeleteChat(e, chat._id)}
                          className="text-gray-400 hover:text-red-500 transition"
                          title="Delete conversation"
                        >
                          <HiOutlineTrash size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {role}
                        </span>
                        <p className="text-sm text-gray-500 truncate flex-1">
                          {chat.messages?.at(-1)?.text || 'Started a conversation'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 md:ml-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden text-gray-600 hover:text-emerald-600"
                >
                  <HiChevronLeft size={24} />
                </button>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {getChatPartner(activeChat)?.profilePic ? (
                    <img
                      src={getChatPartner(activeChat).profilePic}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    getChatPartner(activeChat)?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {getChatPartner(activeChat)?.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      {getPartnerRole(activeChat)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>Online</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/30">
                {messages.map((msg) => {
                  const isOwn = (msg.sender?._id || msg.sender) === user._id;
                  return (
                    <div
                      key={msg._id || Date.now() + Math.random()}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm ${
                          isOwn
                            ? 'bg-emerald-600 text-white rounded-br-none'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {!isOwn && (
                          <div className="text-xs font-medium text-emerald-600 mb-1 flex items-center gap-1">
                            <HiOutlineUserGroup size={12} />
                            {getPartnerRole(activeChat)}
                          </div>
                        )}
                        {isOwn && (
                          <div className="text-xs font-medium text-emerald-200 mb-1 flex items-center gap-1">
                            <HiOutlineUser size={12} />
                            You ({getUserRoleLabel()})
                          </div>
                        )}
                        {msg.image && (
                          <div className="mb-2">
                            <img
                              src={msg.image}
                              alt="Property"
                              className="rounded-lg max-h-40 object-cover"
                            />
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-1 text-[10px] ${isOwn ? 'text-emerald-100' : 'text-gray-400'}`}>
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isOwn && (
                            <button
                              onClick={() => handleDeleteMessage(activeChat._id, msg._id)}
                              className="hover:text-red-300 transition"
                              title="Delete message"
                            >
                              <HiOutlineTrash size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                  >
                    <HiPaperAirplane size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            // No chat selected
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <HiOutlineChatAlt2 size={64} className="mb-4" />
              <h3 className="text-xl font-semibold text-gray-600">Your Messages</h3>
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
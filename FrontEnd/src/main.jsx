


import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from "./components/context/AuthContext";
// import { ChatProvider } from "./components/context/ChatContext";
import { ChatProvider } from "./context/ChatContext";
import { AuthProvider } from "./context/AuthContext";
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
);
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// ChatProvider depends on AuthContext (via useAuth/useWebSocket), so it
// must render inside AuthProvider. It's only mounted for authenticated
// routes since it drives the WebSocket connection.
function ProtectedChatArea({ children }) {
  return (
    <ProtectedRoute>
      <ChatProvider>{children}</ChatProvider>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/chat"
            element={
              <ProtectedChatArea>
                <Chat />
              </ProtectedChatArea>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedChatArea>
                <Profile />
              </ProtectedChatArea>
            }
          />
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

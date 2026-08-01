import { useState } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import ToastContainer from "../common/Toast";
import { useChat } from "../../hooks/useChat";
import { ChatProvider } from "../../context/ChatContext";

export default function ChatLayout() {
  const { activeRoomId, clearActiveRoom } = useChat();
  const [mobileView, setMobileView] = useState("list");
  const [showRoomInfo, setShowRoomInfo] = useState(false);

  function handleSelectRoom() {
    setMobileView("chat");
    setShowRoomInfo(false);
  }

  function handleBack() {
    setMobileView("list");
    setShowRoomInfo(false);
    clearActiveRoom();
  }

  return (
    <div className="flex h-screen flex-col bg-ink-950">
      <ToastContainer />
      <Header />
      <div className="flex min-h-0 flex-1">
        <aside
          className={`w-full shrink-0 border-r border-ink-800 bg-ink-900 lg:block lg:w-80 ${
            mobileView === "chat" && activeRoomId ? "hidden" : "block"
          }`}
        >
          <ConversationList onSelect={handleSelectRoom} className="h-full" />
        </aside>

        <main
          className={`min-w-0 flex-1 lg:block ${
            mobileView === "list" && !activeRoomId ? "hidden" : "block"
          }`}
        >
          <ChatWindow onBack={handleBack} onOpenInfo={() => setShowRoomInfo(true)} />
        </main>

        <Sidebar isOpenMobile={showRoomInfo} onCloseMobile={() => setShowRoomInfo(false)} />
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Leaf, ArrowLeft, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatList from "@/components/chat/ChatList";

const Chat = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(requestId);

  // Mock data pour les conversations
  const mockChats = [
    {
      requestId: "req-123",
      otherUserName: "Pierre Martin",
      otherUserType: 'provider' as const,
      lastMessage: "J'arrive dans 10 minutes !",
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 1,
      requestStatus: 'in_progress' as const,
      serviceName: "Tonte de pelouse"
    },
    {
      requestId: "req-124",
      otherUserName: "Marie Dubois", 
      otherUserType: 'provider' as const,
      lastMessage: "Merci pour votre confiance !",
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 0,
      requestStatus: 'completed' as const,
      serviceName: "Montage de meuble"
    }
  ];

  if (!user) {
    navigate("/login");
    return null;
  }

  const selectedChat = mockChats.find(chat => chat.requestId === selectedChatId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/93345a67-4688-418b-8793-ad045f122f8d.png" 
                alt="GreenGo France" 
                className="h-32 w-auto" 
              />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Bonjour, {user.name}</span>
              <Link to="/client/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
              </Link>
              <Button variant="outline" onClick={() => {logout(); navigate('/')}}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/client/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Liste des conversations */}
            <div className="lg:col-span-1">
              <ChatList
                chats={mockChats}
                onChatSelect={setSelectedChatId}
                selectedChatId={selectedChatId}
              />
            </div>

            {/* Fenêtre de chat */}
            <div className="lg:col-span-2">
              {selectedChat ? (
                <ChatWindow
                  requestId={selectedChat.requestId}
                  currentUserId={user.id}
                  currentUserName={user.name}
                  otherUserName={selectedChat.otherUserName}
                  otherUserType={selectedChat.otherUserType}
                />
              ) : (
                <div className="h-[500px] flex items-center justify-center bg-white rounded-lg border">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Sélectionnez une conversation pour commencer
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

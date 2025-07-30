
import { useState, useEffect } from "react";
import { useAuth, UserClient } from "@/contexts/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Leaf, ArrowLeft, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatList from "@/components/chat/ChatList";
import Loader from "@/components/loader/Loader";
import { RequestStatus } from "@/types/requests";
import { db } from "@/firebaseConfig";
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";

interface ChatItem {
  requestId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: Date;
  requestStatus: RequestStatus;
  serviceName: string;
  otherAvatar: string | null
}

const Chat = () => {
  const { u, logout } = useAuth();
  const user: UserClient = u as UserClient;
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(requestId);
  const [loading, setLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<ChatItem[]>([]);

  useEffect(() => {
    const getChats = async () => {
      const data = await getDocs(query(collection(db, "requests"), where(u.role == 0 ? "clientId" : "providerId", "==", u.id), where("status", "in", ["accepted", "in_progress", "completed"])))
      let parsed = data.docs.map((d) => {
        const data = d.data()
        const out = {
          requestId: d.id,
          otherUserName: u.role == 0 ? data.providerName : data.clientName,
          lastMessage: "",
          lastMessageTime: new Date(),
          requestStatus: data.status,
          serviceName: data.title
        } as ChatItem
        return out;
      });
      let index = 0;
      for (var p of parsed) {
        const cChat = await getDocs(query(collection(db, "chats"), where(u.role == 0 ? "clientId" : "providerId", "==", u.id), where("requestId", "==", p.requestId)))
        const lastMessage = cChat.docs[0]?.data()
        parsed[index].lastMessage = lastMessage?.value
        parsed[index].lastMessage = lastMessage?.time
        index++;
      }
      setChats(parsed);
      setLoading(false);
    }
    getChats()
  }, [])

  useEffect(() => {
  if (!u) return;

  const chatsQuery = query(
    collection(db, "requests"),
    where(u.role === 0 ? "clientId" : "providerId", "==", u.id),
    where("status", "in", ["accepted", "in_progress"]),
    orderBy("updatedAt", "desc")
  );

  const unsub = onSnapshot(chatsQuery, async (snap) => {
    // On récupère le dernier message de chaque chat
    const promises = snap.docs.map(async (doct) => {
      const r = doct.data();
      const lastMsgQuery = query(
        collection(db, "chats"),
        where("requestId", "==", doct.id),
        orderBy("time", "desc"),
        limit(1)
      );

      const lastSnap = await getDocs(lastMsgQuery);
      const last = lastSnap.docs[0]?.data();
      const avatar = (await getDoc(doc(db, "profiles", u.role === 0 ? r.providerId : r.clientId))).data().avatar

      return {
        requestId: doct.id,
        otherAvatar: avatar,
        otherUserName: u.role === 0 ? r.providerName : r.clientName,
        lastMessage: last?.value ?? "",
        lastMessageTime: last?.time?.toDate?.() ?? new Date(0),
        requestStatus: r.status,
        serviceName: r.title,
      } as ChatItem;
    });

    const resolved = await Promise.all(promises);
    setChats(resolved);
    setLoading(false);
  });

  return () => unsub();
}, [u]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return null;
    }
  }, [])

  const selectedChat = chats.find(chat => chat.requestId === selectedChatId);

  return (
    <>
      {loading && <Loader /> }
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/logo.png" 
                  alt="Atoi" 
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
              <div className="lg:col-span-1">
                <ChatList
                  chats={chats}
                  onChatSelect={setSelectedChatId}
                  selectedChatId={selectedChatId}
                />
              </div>

              <div className="lg:col-span-2">
                {selectedChat ? (
                  <ChatWindow
                    requestId={selectedChat.requestId}
                    currentUserId={user.id}
                    currentUserName={user.name}
                    otherUserName={selectedChat.otherUserName}
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
    </>
  );
};

export default Chat;

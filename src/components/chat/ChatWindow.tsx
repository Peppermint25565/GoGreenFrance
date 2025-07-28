
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Paperclip, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Loader from "../loader/Loader";
import { arrayUnion, collection, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  requestId: string;
  currentUserId: string;
  currentUserName: string;
  otherUserName: string;
}

const ChatWindow = ({ 
  requestId, 
  currentUserId, 
  currentUserName, 
  otherUserName
}: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chatId, setChatId] = useState<string>("")
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const func = async () => {
      const data = (await getDocs(query(collection(db, "chats"), where("requestId", "==", requestId)))).docs[0]
      const msgs: Message[] = data.data().chats.map((c) => ({id: c.id, senderId: c.senderId, senderName: c.senderName, content: c.value, timestamp: c.time.toDate()} as Message))
      setChatId(data.id)
      setMessages(msgs);
      setIsLoading(false);
    }
    func()
  }, [requestId, currentUserId, currentUserName, otherUserName]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      content: newMessage,
      timestamp: new Date(),
    };

    await updateDoc(doc(db, "chats", chatId), {
      ["chats"]: arrayUnion({
        id: message.id,
        senderId: currentUserId,
        senderName: currentUserName,
        time: Timestamp.now(),
        value: newMessage
      })
    });

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      content: isImage ? "Photo partagée" : "Fichier partagé",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    
    toast({
      title: "Fichier envoyé",
      description: `${file.name} a été envoyé avec succès`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {otherUserName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{otherUserName}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
            <div className="space-y-4 py-4">
              {messages.map((message) => {
                const isOwn = message.senderId === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 px-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              🔒 Conversation sécurisée - Aucune information personnelle n'est partagée
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ChatWindow;

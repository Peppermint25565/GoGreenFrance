
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock } from "lucide-react";
import { RequestStatus } from "@/types/requests";

interface ChatItem {
  requestId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: Date;
  requestStatus: RequestStatus;
  serviceName: string;
  otherAvatar: string | null
}

interface ChatListProps {
  chats: ChatItem[];
  onChatSelect: (requestId: string) => void;
  selectedChatId?: string;
}

const ChatList = ({ chats, onChatSelect, selectedChatId }: ChatListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  if (chats.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune conversation en cours</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Conversations ({chats.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.requestId}
              onClick={() => onChatSelect(chat.requestId)}
              className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                selectedChatId === chat.requestId ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage className="h-full w-full object-cover rounded-full" src={chat.otherAvatar || ""} />
                  <AvatarFallback>
                    {chat.otherUserName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">
                        {chat.otherUserName}
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {chat.serviceName}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(chat.requestStatus)}`}
                    >
                      {getStatusText(chat.requestStatus)}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {chat.lastMessageTime.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatList;

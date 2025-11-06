import { useState, useRef, useEffect } from "react";
import { User } from "../types";
import { Button } from "./ui/button";
import { ChatEmojiPicker } from "./ChatEmojiPicker";
import { EmojiAutocomplete } from "./EmojiAutocomplete";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Plus,
  Users,
  Star,
  Play,
  X,
  File,
  Image as ImageIcon,
  Check,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";

interface ChatPageProps {
  users: User[];
  currentUserId: string;
  onBack?: () => void;
  isMobileFullScreen?: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
  type: "text" | "recommendation" | "system";
  contentId?: string;
  read?: boolean;
}

interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage: ChatMessage;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
}

export function ChatPage({
  users,
  currentUserId,
  onBack,
  isMobileFullScreen = false,
}: ChatPageProps) {
  const [selectedChat, setSelectedChat] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [emojiAutocomplete, setEmojiAutocomplete] = useState<{
    show: boolean;
    query: string;
    position: { top: number; left: number };
    colonIndex: number;
  }>({
    show: false,
    query: '',
    position: { top: 0, left: 0 },
    colonIndex: -1,
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock chat data
  const [conversations] = useState<ChatConversation[]>([
    {
      id: "1",
      participants: [currentUserId, "2"],
      lastMessage: {
        id: "msg1",
        senderId: "2",
        message:
          "Have you watched the new Dune movie yet? It's incredible! The cinematography is absolutely stunning and the story really builds on the first one.",
        timestamp: "2024-03-15T14:30:00Z",
        type: "text",
      },
      unreadCount: 2,
      isGroup: false,
    },
    {
      id: "2",
      participants: [currentUserId, "3"],
      lastMessage: {
        id: "msg2",
        senderId: currentUserId,
        message:
          "Thanks for the book recommendation! I really enjoyed it.",
        timestamp: "2024-03-15T12:15:00Z",
        type: "text",
      },
      unreadCount: 0,
      isGroup: false,
    },
    {
      id: "3",
      participants: [currentUserId, "2", "3"],
      lastMessage: {
        id: "msg3",
        senderId: "3",
        message:
          "Movie night this weekend? We could watch the new releases together!",
        timestamp: "2024-03-14T18:45:00Z",
        type: "text",
      },
      unreadCount: 1,
      isGroup: true,
      groupName: "Movie Club",
    },
    {
      id: "4",
      participants: [currentUserId, "4"],
      lastMessage: {
        id: "msg4",
        senderId: "4",
        message: "Check out this series!",
        timestamp: "2024-03-13T09:20:00Z",
        type: "recommendation",
      },
      unreadCount: 0,
      isGroup: false,
    },
  ]);

  const [messages] = useState<Record<string, ChatMessage[]>>({
    "1": [
      {
        id: "msg1",
        senderId: "2",
        message: "Hey! How are you doing?",
        timestamp: "2024-03-15T10:00:00Z",
        type: "text",
        read: true,
      },
      {
        id: "msg2",
        senderId: currentUserId,
        message: "Great! Just finished watching Dune Part Two",
        timestamp: "2024-03-15T10:02:00Z",
        type: "text",
        read: true,
      },
      {
        id: "msg3",
        senderId: "2",
        message: "I recommended Dune: Part Two",
        timestamp: "2024-03-15T10:05:00Z",
        type: "recommendation",
        contentId: "1",
        read: true,
      },
      {
        id: "msg4",
        senderId: "2",
        message:
          "Have you watched the new Dune movie yet? It's incredible! The cinematography is absolutely stunning and the story really builds on the first one.",
        timestamp: "2024-03-15T14:30:00Z",
        type: "text",
        read: false,
      },
    ],
    "2": [
      {
        id: "msg5",
        senderId: "3",
        message: "I found this amazing sci-fi book!",
        timestamp: "2024-03-15T11:00:00Z",
        type: "text",
        read: true,
      },
      {
        id: "msg6",
        senderId: currentUserId,
        message:
          "Thanks for the book recommendation! I really enjoyed it.",
        timestamp: "2024-03-15T12:15:00Z",
        type: "text",
        read: true,
      },
    ],
    "3": [
      {
        id: "msg7",
        senderId: "2",
        message: "Welcome to the Movie Club chat!",
        timestamp: "2024-03-14T16:00:00Z",
        type: "system",
        read: true,
      },
      {
        id: "msg8",
        senderId: "3",
        message:
          "Movie night this weekend? We could watch the new releases together!",
        timestamp: "2024-03-14T18:45:00Z",
        type: "text",
        read: false,
      },
    ],
    "4": [
      {
        id: "msg9",
        senderId: "4",
        message:
          "Hey, have you started watching Breaking Bad yet?",
        timestamp: "2024-03-13T09:00:00Z",
        type: "text",
        read: true,
      },
      {
        id: "msg10",
        senderId: "4",
        message: "Check out this series!",
        timestamp: "2024-03-13T09:20:00Z",
        type: "recommendation",
        read: true,
      },
    ],
  });

  const getOtherParticipants = (
    conversation: ChatConversation,
  ) => {
    return conversation.participants
      .filter((id) => id !== currentUserId)
      .map((id) => users.find((u) => u.id === id))
      .filter(Boolean) as User[];
  };

  const getChatName = (conversation: ChatConversation) => {
    if (conversation.isGroup && conversation.groupName) {
      return conversation.groupName;
    }
    const otherUsers = getOtherParticipants(conversation);
    return otherUsers.map((u) => u.displayName).join(", ");
  };

  const getChatAvatar = (conversation: ChatConversation) => {
    if (conversation.isGroup) {
      return null;
    }
    const otherUser = getOtherParticipants(conversation)[0];
    return otherUser?.avatar;
  };

  const getTimeString = (
    timestamp: string,
    format: "full" | "short" = "full",
  ): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (format === "short") {
      if (diffSeconds < 60) return "now";
      if (diffMinutes < 60) return `${diffMinutes}m`;
      if (diffHours < 24) return `${diffHours}h`;
      if (diffDays < 7) return `${diffDays}d`;
      if (diffWeeks < 5) return `${diffWeeks}w`;
      if (diffMonths < 12) return `${diffMonths}mo`;
      return `${diffYears}y`;
    }

    // Full format (default)
    if (diffSeconds < 60) return "just now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7)
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffWeeks < 5)
      return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    if (diffMonths < 12)
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  };

  const sendMessage = () => {
    if (
      (!newMessage.trim() && attachments.length === 0) ||
      !selectedChat
    )
      return;

    // In a real app, this would send the message to the backend
    setNewMessage("");
    setAttachments([]);
    setShowEmojiPicker(false);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);

    // Focus back on textarea and adjust height
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        adjustTextareaHeight();
      }
    }, 0);
  };

  const handleEmojiAutocompleteSelect = (emoji: string, nameLength: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { colonIndex } = emojiAutocomplete;
    const beforeColon = newMessage.substring(0, colonIndex);
    const afterQuery = newMessage.substring(colonIndex + nameLength + 1);
    
    setNewMessage(beforeColon + emoji + afterQuery);
    setEmojiAutocomplete({ show: false, query: '', position: { top: 0, left: 0 }, colonIndex: -1 });

    // Set cursor position after emoji
    setTimeout(() => {
      const newCursorPos = beforeColon.length + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
      adjustTextareaHeight();
    }, 0);
  };

  const checkForEmojiAutocomplete = (text: string, cursorPosition: number) => {
    // Find the last colon before cursor
    const textBeforeCursor = text.substring(0, cursorPosition);
    const lastColonIndex = textBeforeCursor.lastIndexOf(':');
    
    // Check if there's a colon and it's either at start or preceded by whitespace
    if (lastColonIndex >= 0 && (lastColonIndex === 0 || /\s/.test(text[lastColonIndex - 1]))) {
      const query = textBeforeCursor.substring(lastColonIndex + 1);
      
      // Only show autocomplete if query is valid (no spaces and reasonable length)
      if (query.length > 0 && query.length <= 20 && !query.includes(' ') && !query.includes(':')) {
        // Calculate position for autocomplete popup
        const textarea = textareaRef.current;
        if (textarea) {
          const rect = textarea.getBoundingClientRect();
          const position = {
            top: rect.top - 250, // Position above the textarea
            left: rect.left,
          };
          
          setEmojiAutocomplete({
            show: true,
            query,
            position,
            colonIndex: lastColonIndex,
          });
          return;
        }
      }
    }
    
    // Hide autocomplete if conditions not met
    if (emojiAutocomplete.show) {
      setEmojiAutocomplete({ show: false, query: '', position: { top: 0, left: 0 }, colonIndex: -1 });
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
    }
  };

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value;
    setNewMessage(newValue);
    adjustTextareaHeight();
    
    // Check for emoji autocomplete
    const cursorPosition = e.target.selectionStart;
    checkForEmojiAutocomplete(newValue, cursorPosition);
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedChat,
  );
  const chatMessages = selectedChat
    ? messages[selectedChat] || []
    : [];

  const filteredConversations = conversations.filter((conv) => {
    const chatName = getChatName(conv).toLowerCase();
    return chatName.includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop =
        scrollAreaRef.current.scrollHeight;
    }
  }, [chatMessages, selectedChat]);

  useEffect(() => {
    console.log("Emoji picker state changed:", showEmojiPicker);
  }, [showEmojiPicker]);

  // Handle browser back button on mobile
  useEffect(() => {
    if (!isMobileFullScreen || !onBack) return;

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      if (selectedChat) {
        setSelectedChat(null);
      } else {
        onBack();
      }
    };

    // Push a state to enable back button handling
    window.history.pushState({ page: "chat" }, "", "");
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isMobileFullScreen, onBack, selectedChat]);

  // Container wrapper component
  const Container = isMobileFullScreen ? "div" : Card;
  const containerProps = isMobileFullScreen
    ? {}
    : { className: "flex-1 flex flex-col shadow-sm" };

  return (
    <div
      className={`${isMobileFullScreen ? "h-screen flex flex-col" : "container mx-auto px-4 py-6"}`}
    >
      <div
        className={`flex flex-col md:flex-row gap-0 md:gap-6 ${
          isMobileFullScreen
            ? "h-full"
            : "h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]"
        }`}
      >
        {/* Chat List Sidebar */}
        <div
          className={`${
            selectedChat ? "hidden md:flex" : "flex"
          } w-full md:w-80 lg:w-96 flex-col ${isMobileFullScreen ? "h-full" : ""}`}
        >
          {isMobileFullScreen ? (
            // Mobile native view without card
            <div className="flex-1 flex flex-col bg-background">
              <div className="px-4 py-3 border-b bg-background">
                <div className="flex items-center justify-between mb-3">
                  <ArrowLeft
                    className="w-6 h-6 flex-shrink-0"
                    onClick={onBack}
                  />
                  <h1 className="text-xl font-semibold flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 flex-shrink-0" />
                    Messages
                  </h1>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0 h-10 w-10 p-0 hover:bg-muted"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {filteredConversations.map((conversation) => {
                    const otherUsers =
                      getOtherParticipants(conversation);
                    const isActive =
                      selectedChat === conversation.id;
                    const hasUnread =
                      conversation.unreadCount > 0;

                    return (
                      <div
                        key={conversation.id}
                        className={`relative overflow-visible p-3 cursor-pointer transition-all duration-200 active:scale-[0.98] active:bg-muted touch-manipulation mb-1 ${
                          isActive
                            ? "bg-primary/10"
                            : "hover:bg-muted/70"
                        }`}
                        onClick={() =>
                          setSelectedChat(conversation.id)
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            {conversation.isGroup ? (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary" />
                              </div>
                            ) : (
                              <Avatar className="w-12 h-12">
                                <AvatarImage
                                  src={getChatAvatar(
                                    conversation,
                                  )}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                                  {otherUsers[0]?.displayName.charAt(
                                    0,
                                  )}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            {hasUnread && (
                              <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center text-xs shadow-sm">
                                {conversation.unreadCount > 9
                                  ? "9+"
                                  : conversation.unreadCount}
                              </Badge>
                            )}
                            {!hasUnread &&
                              !conversation.isGroup && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                              )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2 mb-0.5">
                              <h3
                                className={`truncate flex-1 min-w-0 ${hasUnread ? "font-semibold" : "font-medium"}`}
                              >
                                {getChatName(conversation)}
                              </h3>
                              <span
                                className={`text-xs flex-shrink-0 ${hasUnread ? "text-primary font-medium" : "text-muted-foreground"}`}
                              >
                                {getTimeString(
                                  conversation.lastMessage
                                    .timestamp,
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <p
                                className={`text-sm truncate flex-1 max-w-60 ${
                                  hasUnread
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {conversation.lastMessage
                                  .senderId ===
                                  currentUserId && (
                                  <span className="inline-flex items-center gap-0.5 mr-1">
                                    {conversation.lastMessage
                                      .read ? (
                                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                    ) : (
                                      <Check className="w-3.5 h-3.5" />
                                    )}
                                  </span>
                                )}
                                {conversation.lastMessage
                                  .type === "recommendation"
                                  ? "📽️ Shared a recommendation"
                                  : conversation.lastMessage
                                      .message}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          ) : (
            // Desktop card view
            <Card className="flex-1 flex flex-col shadow-sm overflow-hidden h-full">
              <CardHeader className="pb-3 px-4 md:px-5 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">Messages</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0 h-9 w-9 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden min-h-0">
                <ScrollArea className="h-full">
                  <div className="p-2">
                    {filteredConversations.map(
                      (conversation) => {
                        const otherUsers =
                          getOtherParticipants(conversation);
                        const isActive =
                          selectedChat === conversation.id;
                        const hasUnread =
                          conversation.unreadCount > 0;

                        return (
                          <div
                            key={conversation.id}
                            className={`relative overflow-visible p-3 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.98] touch-manipulation mb-1 group ${
                              isActive
                                ? "bg-primary/10 shadow-sm"
                                : "hover:bg-muted/70 active:bg-muted"
                            }`}
                            onClick={() =>
                              setSelectedChat(conversation.id)
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                {conversation.isGroup ? (
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-background">
                                    <Users className="w-6 h-6 text-primary" />
                                  </div>
                                ) : (
                                  <Avatar className="w-12 h-12 ring-2 ring-background">
                                    <AvatarImage
                                      src={getChatAvatar(
                                        conversation,
                                      )}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                                      {otherUsers[0]?.displayName.charAt(
                                        0,
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                {hasUnread && (
                                  <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center text-xs shadow-sm">
                                    {conversation.unreadCount >
                                    9
                                      ? "9+"
                                      : conversation.unreadCount}
                                  </Badge>
                                )}
                                {!hasUnread &&
                                  !conversation.isGroup && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                  )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                                  <h3
                                    className={`truncate flex-1 min-w-0 ${hasUnread ? "font-semibold" : "font-medium"}`}
                                  >
                                    {getChatName(conversation)}
                                  </h3>
                                  <span
                                    className={`text-xs flex-shrink-0 ${hasUnread ? "text-primary font-medium" : "text-muted-foreground"}`}
                                  >
                                    {getTimeString(
                                      conversation.lastMessage
                                        .timestamp,
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <p
                                    className={`text-sm truncate flex-1 max-w-60 ${
                                      hasUnread
                                        ? "text-foreground font-medium"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {conversation.lastMessage
                                      .senderId ===
                                      currentUserId && (
                                      <span className="inline-flex items-center gap-0.5 mr-1">
                                        {conversation
                                          .lastMessage.read ? (
                                          <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                        ) : (
                                          <Check className="w-3.5 h-3.5" />
                                        )}
                                      </span>
                                    )}
                                    {conversation.lastMessage
                                      .type === "recommendation"
                                      ? "📽️ Shared a recommendation"
                                      : conversation.lastMessage
                                          .message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Area */}
        <div
          className={`${
            !selectedChat ? "hidden md:flex" : "flex"
          } flex-1 flex-col min-w-0 ${isMobileFullScreen ? "h-full" : ""}`}
        >
          {selectedConversation ? (
            isMobileFullScreen ? (
              // Mobile native chat view
              <div className="flex-1 flex flex-col bg-background h-full">
                {/* Chat Header */}
                <div className="px-4 py-3 flex-shrink-0 border-b bg-background">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Back button to conversation list */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 h-9 w-9 p-0 hover:bg-muted"
                        onClick={() => setSelectedChat(null)}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </Button>

                      {selectedConversation.isGroup ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                      ) : (
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage
                            src={getChatAvatar(
                              selectedConversation,
                            )}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                            {getOtherParticipants(
                              selectedConversation,
                            )[0]?.displayName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold truncate">
                          {getChatName(selectedConversation)}
                        </h2>
                        <p className="text-xs text-muted-foreground truncate">
                          {selectedConversation.isGroup
                            ? `${selectedConversation.participants.length} members`
                            : "Active now"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-muted"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-muted"
                      >
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-muted"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-hidden bg-muted/30">
                  <ScrollArea
                    className="h-full"
                    ref={scrollAreaRef}
                  >
                    <div className="p-4 space-y-4">
                      {chatMessages.map((message, index) => {
                        const sender = users.find(
                          (u) => u.id === message.senderId,
                        );
                        const isOwn =
                          message.senderId === currentUserId;
                        const showAvatar =
                          !isOwn &&
                          (index === 0 ||
                            chatMessages[index - 1].senderId !==
                              message.senderId);

                        return (
                          <div
                            key={message.id}
                            className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            {!isOwn && (
                              <div className="flex-shrink-0">
                                {showAvatar ? (
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage
                                      src={sender?.avatar}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm">
                                      {sender?.displayName.charAt(
                                        0,
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <div className="w-8 h-8" />
                                )}
                              </div>
                            )}
                            <div
                              className={`max-w-[85%] ${isOwn ? "order-first" : ""}`}
                            >
                              {message.type === "system" ? (
                                <div className="text-center my-4">
                                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-xs text-muted-foreground">
                                    <span>
                                      {message.message}
                                    </span>
                                  </div>
                                </div>
                              ) : message.type ===
                                "recommendation" ? (
                                <div
                                  className={`p-3 rounded-2xl border-2 shadow-sm ${
                                    isOwn
                                      ? "bg-primary text-primary-foreground border-primary/20"
                                      : "bg-card border-border"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Star
                                      className={`w-4 h-4 flex-shrink-0 ${isOwn ? "text-primary-foreground" : "text-primary"}`}
                                    />
                                    <span className="text-sm font-medium truncate">
                                      Recommended content
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 p-2.5 bg-background/10 backdrop-blur-sm rounded-lg">
                                    <div className="w-10 h-12 rounded bg-muted/50 flex-shrink-0 overflow-hidden">
                                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        Dune: Part Two
                                      </p>
                                      <p className="text-xs opacity-70 truncate">
                                        2024 • Sci-Fi
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant={
                                        isOwn
                                          ? "secondary"
                                          : "outline"
                                      }
                                      className="flex-shrink-0 h-8 w-8 p-0 rounded-full"
                                    >
                                      <Play className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`group relative px-4 py-2.5 rounded-2xl break-words shadow-sm ${
                                    isOwn
                                      ? "bg-primary text-primary-foreground rounded-br-md"
                                      : "bg-card rounded-bl-md"
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed">
                                    {message.message}
                                  </p>
                                </div>
                              )}
                              {message.type !== "system" && (
                                <div
                                  className={`flex items-center gap-1 mt-1 px-1 ${
                                    isOwn
                                      ? "justify-end"
                                      : "justify-start"
                                  }`}
                                >
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      message.timestamp,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                  {isOwn && (
                                    <span className="inline-flex">
                                      {message.read ? (
                                        <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                      ) : (
                                        <Check className="w-3.5 h-3.5 text-muted-foreground" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Message Input */}
                <div className="p-3 border-t bg-background flex-shrink-0">
                  {/* Attachments Preview */}
                  {attachments.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="relative flex items-center gap-2 bg-muted/70 rounded-lg px-3 py-2 pr-8 border"
                        >
                          {file.type.startsWith("image/") ? (
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <File className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-sm truncate max-w-[150px]">
                            {file.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() =>
                              removeAttachment(index)
                            }
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,video/*,.pdf,.doc,.docx"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary active:scale-95 transition-all rounded-full"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative min-w-0">
                      <Textarea
                        ref={textareaRef}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={handleTextareaChange}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            !e.shiftKey
                          ) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        className="pr-11 min-h-[2.5rem] max-h-24 resize-none touch-manipulation py-3 px-4 rounded-2xl border-2 focus-visible:ring-1 overflow-y-auto"
                        rows={1}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() =>
                          setShowEmojiPicker(!showEmojiPicker)
                        }
                        className={`absolute right-1.5 top-2 h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary active:scale-95 transition-all rounded-full ${
                          showEmojiPicker
                            ? "bg-primary/10 text-primary"
                            : ""
                        }`}
                      >
                        <Smile className="w-4 h-4" />
                      </Button>

                      {/* Emoji Picker Dropdown */}
                      {showEmojiPicker && (
                        <>
                          {/* Backdrop to close picker */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() =>
                              setShowEmojiPicker(false)
                            }
                          />
                          {/* Emoji Picker Panel */}
                          <div
                            className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] flex items-end justify-center p-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Card className="shadow-xl border-2 w-full max-w-md">
                              <ChatEmojiPicker
                                onEmojiSelect={handleEmojiSelect}
                                showSearch={true}
                              />
                            </Card>
                          </div>
                        </>
                      )}

                      {/* Emoji Autocomplete - Mobile */}
                      {emojiAutocomplete.show && (
                        <EmojiAutocomplete
                          query={emojiAutocomplete.query}
                          onSelect={handleEmojiAutocompleteSelect}
                          onClose={() =>
                            setEmojiAutocomplete({
                              show: false,
                              query: '',
                              position: { top: 0, left: 0 },
                              colonIndex: -1,
                            })
                          }
                          position={emojiAutocomplete.position}
                        />
                      )}
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={
                        !newMessage.trim() &&
                        attachments.length === 0
                      }
                      className="flex-shrink-0 h-10 w-10 touch-manipulation active:scale-95 transition-all rounded-full shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Desktop card view
              <Card className="flex-1 flex flex-col shadow-sm overflow-hidden h-full">
                {/* Chat Header */}
                <CardHeader className="pb-3 px-4 md:px-5 flex-shrink-0 border-b">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Back button for mobile */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden flex-shrink-0 h-9 w-9 p-0 hover:bg-muted"
                        onClick={() => setSelectedChat(null)}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </Button>

                      {selectedConversation.isGroup ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                      ) : (
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage
                            src={getChatAvatar(
                              selectedConversation,
                            )}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                            {getOtherParticipants(
                              selectedConversation,
                            )[0]?.displayName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold truncate">
                          {getChatName(selectedConversation)}
                        </h2>
                        <p className="text-xs text-muted-foreground truncate">
                          {selectedConversation.isGroup
                            ? `${selectedConversation.participants.length} members`
                            : "Active now"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hidden sm:flex hover:bg-muted"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hidden sm:flex hover:bg-muted"
                      >
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-muted"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0 overflow-hidden bg-muted/30 min-h-0">
                  <ScrollArea
                    className="h-full"
                    ref={scrollAreaRef}
                  >
                    <div className="p-4 md:p-6 space-y-4">
                      {chatMessages.map((message, index) => {
                        const sender = users.find(
                          (u) => u.id === message.senderId,
                        );
                        const isOwn =
                          message.senderId === currentUserId;
                        const showAvatar =
                          !isOwn &&
                          (index === 0 ||
                            chatMessages[index - 1].senderId !==
                              message.senderId);

                        return (
                          <div
                            key={message.id}
                            className={`flex gap-2 md:gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            {!isOwn && (
                              <div className="flex-shrink-0">
                                {showAvatar ? (
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage
                                      src={sender?.avatar}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm">
                                      {sender?.displayName.charAt(
                                        0,
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <div className="w-8 h-8" />
                                )}
                              </div>
                            )}
                            <div
                              className={`max-w-[85%] md:max-w-[70%] ${isOwn ? "order-first" : ""}`}
                            >
                              {message.type === "system" ? (
                                <div className="text-center my-4">
                                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-xs text-muted-foreground">
                                    <span>
                                      {message.message}
                                    </span>
                                  </div>
                                </div>
                              ) : message.type ===
                                "recommendation" ? (
                                <div
                                  className={`p-3 rounded-2xl border-2 shadow-sm ${
                                    isOwn
                                      ? "bg-primary text-primary-foreground border-primary/20"
                                      : "bg-card border-border"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Star
                                      className={`w-4 h-4 flex-shrink-0 ${isOwn ? "text-primary-foreground" : "text-primary"}`}
                                    />
                                    <span className="text-sm font-medium truncate">
                                      Recommended content
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 p-2.5 bg-background/10 backdrop-blur-sm rounded-lg">
                                    <div className="w-10 h-12 rounded bg-muted/50 flex-shrink-0 overflow-hidden">
                                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        Dune: Part Two
                                      </p>
                                      <p className="text-xs opacity-70 truncate">
                                        2024 • Sci-Fi
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant={
                                        isOwn
                                          ? "secondary"
                                          : "outline"
                                      }
                                      className="flex-shrink-0 h-8 w-8 p-0 rounded-full"
                                    >
                                      <Play className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`group relative px-4 py-2.5 rounded-2xl break-words shadow-sm ${
                                    isOwn
                                      ? "bg-primary text-primary-foreground rounded-br-md"
                                      : "bg-card rounded-bl-md"
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed">
                                    {message.message}
                                  </p>
                                </div>
                              )}
                              {message.type !== "system" && (
                                <div
                                  className={`flex items-center gap-1 mt-1 px-1 ${
                                    isOwn
                                      ? "justify-end"
                                      : "justify-start"
                                  }`}
                                >
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      message.timestamp,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                  {isOwn && (
                                    <span className="inline-flex">
                                      {message.read ? (
                                        <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                      ) : (
                                        <Check className="w-3.5 h-3.5 text-muted-foreground" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="p-3 md:p-4 border-t bg-background flex-shrink-0">
                  {/* Attachments Preview */}
                  {attachments.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="relative flex items-center gap-2 bg-muted/70 rounded-lg px-3 py-2 pr-8 border"
                        >
                          {file.type.startsWith("image/") ? (
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <File className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-sm truncate max-w-[150px]">
                            {file.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() =>
                              removeAttachment(index)
                            }
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,video/*,.pdf,.doc,.docx"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary active:scale-95 transition-all rounded-full"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative min-w-0">
                      <Textarea
                        ref={textareaRef}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={handleTextareaChange}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            !e.shiftKey
                          ) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        className="pr-11 min-h-[2.5rem] max-h-24 md:max-h-32 resize-none touch-manipulation py-3 px-4 rounded-2xl border-2 focus-visible:ring-1 overflow-y-auto"
                        rows={1}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() =>
                          setShowEmojiPicker(!showEmojiPicker)
                        }
                        className={`absolute right-1.5 top-2 h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary active:scale-95 transition-all rounded-full ${
                          showEmojiPicker
                            ? "bg-primary/10 text-primary"
                            : ""
                        }`}
                      >
                        <Smile className="w-4 h-4" />
                      </Button>

                      {/* Emoji Picker Dropdown */}
                      {showEmojiPicker && (
                        <>
                          {/* Backdrop to close picker */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() =>
                              setShowEmojiPicker(false)
                            }
                          />
                          {/* Emoji Picker Panel */}
                          <div
                            className="absolute bottom-full right-0 mb-2 z-50 w-[min(340px,calc(100vw-2rem))]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Card className="shadow-xl border-2">
                              <ChatEmojiPicker
                                onEmojiSelect={handleEmojiSelect}
                                showSearch={true}
                              />
                            </Card>
                          </div>
                        </>
                      )}
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={
                        !newMessage.trim() &&
                        attachments.length === 0
                      }
                      className="flex-shrink-0 h-10 w-10 md:w-auto md:px-5 touch-manipulation active:scale-95 transition-all rounded-full shadow-sm"
                    >
                      <Send className="w-4 h-4 md:mr-0" />
                      <span className="hidden md:inline ml-2">
                        Send
                      </span>
                    </Button>
                  </div>
                </div>
              </Card>
            )
          ) : (
            <Card className="flex-1 flex items-center justify-center shadow-sm">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mb-2">Select a conversation</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Choose a conversation from the list to start
                  messaging
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


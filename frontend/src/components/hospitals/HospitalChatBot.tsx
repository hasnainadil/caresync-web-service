import { HospitalChatBotMessage, ChatRoles } from "@/types";
import React, { useRef, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";

const MAX_TEXTAREA_ROWS = 3;

// Loading dots component for typing indicator
const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-center space-x-1 p-1 text-sm text-gray-500 translate-y-1">
            <div className="flex space-x-1 items-end">
                <div className="w-2 h-2 bg-blue-400 rounded-full" 
                     style={{ 
                         animation: 'bounce 1.2s infinite ease-in-out',
                         animationDelay: '-0.32s',
                         transform: 'translateY(0)'
                     }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"
                     style={{ 
                         animation: 'bounce 1.2s infinite ease-in-out',
                         animationDelay: '-0.16s',
                         transform: 'translateY(0)'
                     }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"
                     style={{ 
                         animation: 'bounce 1.2s infinite ease-in-out',
                         animationDelay: '0s',
                         transform: 'translateY(0)'
                     }}></div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes bounce {
                        0%, 80%, 100% {
                            transform: translateY(0);
                        }
                        40% {
                            transform: translateY(-10px);
                        }
                    }
                `
            }} />
        </div>
    );
};

// Utility function to detect URLs and convert them to clickable links
const renderMessageWithLinks = (content: string, isUserMessage: boolean = false) => {
    // Regular expression to match URLs (http, https, www, and domain.com patterns)
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}[^\s]*)/g;
    
    if (!urlRegex.test(content)) {
        return content;
    }
    
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
        if (urlRegex.test(part)) {
            // Ensure the URL has a protocol
            let url = part;
            if (!part.startsWith('http://') && !part.startsWith('https://')) {
                url = `https://${part}`;
            }
            
            return (
                <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                        isUserMessage 
                            ? "text-blue-200 hover:text-blue-100" 
                            : "text-blue-600 hover:text-blue-800"
                    } underline break-all font-medium`}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};

interface HospitalChatBotProps {
    onClose?: () => void;
}

const HospitalChatBot: React.FC<HospitalChatBotProps> = ({ onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<HospitalChatBotMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom when messages change
        const scrollToBottom = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        };
        
        // Use setTimeout to ensure DOM has updated
        const timeoutId = setTimeout(scrollToBottom, 100);
        
        return () => clearTimeout(timeoutId);
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !user) return;
        const userMessage: HospitalChatBotMessage = {
            id: `${Date.now()}`,
            content: input,
            role: ChatRoles.USER,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        try {
            const response = await apiClient.sendBotMessage({
                userId: user.uid,
                message: input,
                role: ChatRoles.USER,
                createdAt: new Date().toISOString(),
            });
            setMessages((prev) => [...prev, response]);
        } catch (e) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `${Date.now()}-err`,
                    content: "Sorry, something went wrong. Please try again.",
                    role: ChatRoles.ASSISTANT,
                    createdAt: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter to send, Shift+Enter for newline
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        console.log("Key pressed:", e.key);
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Limit textarea rows
    const textareaRows = Math.min(
        input.split("\n").length,
        MAX_TEXTAREA_ROWS
    );

    return (
        <div className="flex flex-col w-80 h-full max-h-[500px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-2xl border border-blue-200 overflow-hidden" onKeyDown={(e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                if (onClose) onClose();
            }
        }}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg shadow font-serif relative">
                <h2 className="font-semibold text-lg tracking-wide">Hospital ChatBot</h2>
                <span className="text-xs opacity-80 font-mono mr-5">AI Assistant</span>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-1 right-1 p-1 rounded-full hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Close chat"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
            {/* Messages */}
            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full w-full px-2 py-3" style={{ height: '100%' }}>
                    <div className="flex flex-col gap-3 min-h-full justify-end">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 mt-10 select-none">Start a conversation...</div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={msg.id + idx}
                                className={`flex w-full ${msg.role === ChatRoles.USER ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md text-sm break-words font-sans
                    ${msg.role === ChatRoles.USER
                                            ? "bg-blue-500 text-white rounded-br-md"
                                            : "bg-white text-blue-900 border border-blue-200 rounded-bl-md"}
                  `}
                                >
                                    {renderMessageWithLinks(msg.content, msg.role === ChatRoles.USER)}
                                </div>
                            </div>
                        ))}
                        
                        {/* Loading indicator when AI is responding */}
                        {loading && (
                            <div className="flex w-full justify-start">
                                <div className="max-w-[75%] px-4 py-2 rounded-2xl shadow-md text-sm bg-white text-blue-900 border border-blue-200 rounded-bl-md">
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}
                        
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
            </div>
            {/* Footer/Input */}
            <div className="flex items-end gap-2 p-3 bg-white rounded-b-lg border-t border-blue-100">
                <Textarea
                    className="resize-none min-h-[40px] max-h-[120px] text-sm flex-1 bg-blue-50 focus:bg-white transition-colors"
                    placeholder="Type your message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={textareaRows}
                    maxLength={500}
                    style={{ overflowY: textareaRows >= MAX_TEXTAREA_ROWS ? 'auto' : 'hidden' }}
                    disabled={loading}
                />
                <Button
                    variant="default"
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                >
                    <Send size={20} />
                </Button>
            </div>
        </div>
    );
};

export default HospitalChatBot;
import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './Room';




type ChatProps = {
  meetingId: string;
  spriteId: string;
  socket: WebSocket | null;
  chatMessages:  ChatMessage[]
};

const Chat = ({ meetingId, spriteId, socket, chatMessages }: ChatProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!chatMessages) return;
        chatMessages.forEach((msg) => {
            setMessages((prev) => [...prev, msg]);
        })

    }, [chatMessages]);

    

    return (
        <div className="fixed bottom-0 right-0 m-4 w-80 h-screen bg-white shadow-lg rounded-lg flex flex-col">
            <div className="bg-blue-500 text-white p-2 rounded-t-lg">Chat</div>
            <div className="p-4 flex-grow overflow-y-auto flex flex-col">
            {messages.map((message, index) => (
                <div 
                key={index} 
                className={`mb-2 p-2 rounded-lg inline-block max-w-xs break-words whitespace-pre-wrap ${message.Sender === spriteId ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}
                >
                {message.Message}
                </div>
            ))}
            <div ref={messagesEndRef} />
            </div>
            <div className="p-2 flex">
            <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-grow p-2 border rounded-l-lg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button 
                className="bg-blue-500 text-white p-2 rounded-r-lg" 
                onClick={() => {
                if (!socket) return;
                const msg = {
                    type: 'chatMessage',
                    chatMsg: {
                        Sender: spriteId,
                        Message: message,
                        Timestamp: Date.now()
                    },
                    meetingId: meetingId
                }
                socket.send(JSON.stringify(msg));
                setMessages([...messages, msg.chatMsg]);
                setMessage('');
                }}
            >
                Send
            </button>
            </div>
        </div>
    );
};

export default Chat;
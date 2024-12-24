import React from 'react';


type ChatProps = {
  meetingId: string;
};

const Chat = ({ meetingId }: ChatProps) => {
    const [messages, setMessages] = React.useState<{ text: string, sender: 'me' | 'other' }[]>([]);
    const [message, setMessage] = React.useState<string>('');
    const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
    console.log("meetings Id  ",meetingId)

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="fixed bottom-0 right-0 m-4 w-80 h-screen bg-white shadow-lg rounded-lg flex flex-col">
            <div className="bg-blue-500 text-white p-2 rounded-t-lg">Chat</div>
            <div className="p-4 flex-grow overflow-y-auto flex flex-col">
            {messages.map((message, index) => (
                <div 
                key={index} 
                className={`mb-2 p-2 rounded-lg inline-block max-w-xs break-words whitespace-pre-wrap ${message.sender === 'me' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}
                >
                {message.text}
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
                setMessages([...messages, { text: message, sender: 'me' }]);
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
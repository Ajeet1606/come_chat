import { useEffect, useState } from "react";
import styles from "../styles/Chat.module.css";
import { useSocket } from "../context/socketContext";
type Message = {
  id: string;
  senderId: string;
  text: string;
};

export default function Chat() {
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [socketId, setSocketId] = useState<string>("");
  const [typingMessage, setTypingMessage] = useState<string>("");

  useEffect(() => {
    if (socket.id != undefined) setSocketId(socket.id);

    socket.on("message", (message: Message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("typing", (data: { username: string; data: string }) => {
      console.log("data in typing", data);

      setTypingMessage(`${data.username} is typing: ${data.data}`);
    });

    socket.on("typing-stopped", () => {
      console.log("Typing stopped");
      setTypingMessage("");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("typing");
      socket.off("typing-stopped");
      socket.off("disconnect");
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (socket) {
      socket.emit("typing", e.target.value);
    }
  };

  const handleSendClick = () => {
    if (inputText.trim() !== "") {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: socketId,
        text: inputText,
      };
      if (socket) {
        socket.emit("typing-stopped");
        socket.emit("message", newMessage);
        setInputText("");
        console.log("Sent message:", inputText);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendClick();
    }
  };

  return (
    <>
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageWrapper} ${
                message.senderId == socketId ? styles.outgoing : styles.incoming
              }`}
            >
              <div className={styles.message}>{message.text}</div>
            </div>
          ))}
        </div>
        <div className={styles.typingIndicator}>
          <p>{typingMessage != "" ? typingMessage : ""}</p>
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={styles.input}
            placeholder="Type a message..."
          />
          <button onClick={handleSendClick} className={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}

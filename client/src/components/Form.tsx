import React, { useState } from "react";
import styles from "../styles/form.module.css";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socketContext";

const Form = () => {
  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();
  const handleSendClick = () => {
    if (inputText.trim() !== "") {
      if (socket) {
        console.log(inputText);
        socket.emit("set-username", inputText);
        navigate("/chat");
      }
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendClick();
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={inputText}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setInputText(event.target.value)
          }
          onKeyPress={handleKeyPress}
          className={styles.input}
          placeholder="Enter Username"
        />
        <button onClick={handleSendClick} className={styles.sendButton}>
          Enter Chat Room
        </button>
      </div>
    </div>
  );
};

export default Form;

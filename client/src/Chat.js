import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = (props) => {

  const { socket, username, room } = props

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if( currentMessage === "" ) return
      const currentDate = new Date(Date.now())
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: `${currentDate.getHours()} : ${currentDate.getMinutes()}`
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => setMessageList((list) => [...list, data]) );
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {
              messageList.map(( { author, message, time } ) => {
              return (
                <div className="message"
                     id={ username === author ? "you" : "other" }>
                  <div>
                    <div className="message-content">
                      <p>{ message }</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{ time }</p>
                      <p id="author">{ author }</p>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input type="text"
               value={currentMessage}
               placeholder="Hey..."
               onChange={ (event) => setCurrentMessage(event.target.value) }
               onKeyPress={ (event) => event.key === "Enter" && sendMessage() }
        />
        <button onClick={ sendMessage }>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;

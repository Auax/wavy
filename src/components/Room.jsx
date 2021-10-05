import React from "react";
import { useState } from "react"
import io from "socket.io-client";
import PopUp from "./CreateUsername";
import { ErrorTop, ShowError, HideError } from "./Error";
import { parseMessage } from "../message/message_parser";

let username;
let messagesArray = [];

const Room = () => {

    console.log("Function reload.");
    let endPoint = "https://wavy-chat.herokuapp.com"; // define endoint
    let socket = io.connect(`${endPoint}`);
    // Not using .at() method because Safari doesn't support it
    let roomName = window.location.href.split("/").pop();

    const connect = (user) => {
        console.log("Connected with: " + user);
        username = user;
        socket.emit('join', { channel: roomName, username: user });
    }

    const [messages, setMessages] = useState(messagesArray);

    socket.on('message', (data, user) => {
        console.log(`Username ${data[1]} incoming message: ${data[0]}`);
        let contentToAdd = { msg: data[0], user: data[1] };
        setMessages([...messages, contentToAdd]);
        messagesArray.push(contentToAdd);

        // Scroll div on new data
        var elem = document.getElementById('messages');
        elem.scrollTop = elem.scrollHeight;
    });

    // On Click
    const sendMessage = (event) => {
        try {
            event.preventDefault();
        } catch (e) { console.warn("Event undefined. -- 'event.preventDefault()'") }
        let messageInput = document.getElementById("message-input");
        let message = messageInput.value;

        if (message !== "" && message.length <= 5000) {
            HideError();
            socket.emit('message', { message: message, channel: roomName, username: username });
            messageInput.value = ""
        } else {

            console.log("Invalid blank message");
            ShowError("Invalid message. Message cannot be blank or contain more than 5000 characters.")
        }
    };

    const chatContent = (user, messages) => {
        let content = []
        if (messages.length > 0) {
            messages.map((getter, i) => (
                content.push(
                    <div key={i}>
                        {parseMessage(getter, username)}
                    </div>
                )
            ));
            return content;
        }
    }

    // Disconnect user when leaving page
    window.onbeforeunload = () => {
        socket.emit("disconnect_client", { room: roomName, username: username });
    }

    const resizeContainerMsg = () => {
        let resizeContainer = document.getElementById("messages");
        let newHeight = window.innerHeight;
        newHeight = newHeight - 205;
        resizeContainer.style.height = `${newHeight}px`
    }

    window.onresize = () => {
        resizeContainerMsg();
    }

    window.onload = () => {
        resizeContainerMsg();
    }

    return (
        <div>
            <div className="room">
                <ErrorTop text="" />
                <PopUp title="Create a temporal username." subtitle="Other users in this room will identify you with this user."
                    placeholder="Input your username!" room={roomName} func={connect} />
                <form onSubmit={sendMessage}>
                    <div className="input-group mb-3 chat-input-container">
                        <input type="text" className="form-control" placeholder="Message" aria-label="Message to send" id="message-input" name="message" />
                        <button className="input-group-text send-button tr-f" id="send-button" onClick={sendMessage}><i className="fa-solid fa-paper-plane tr-f"></i></button>
                    </div>
                </form>
                <div className="container">
                    <h1 className="title mb-3">Chat</h1>
                    <div className="messages" id="messages">
                        {!messages.length > 0 &&
                            (
                                <p className="subtitle">Nothing here...</p>
                            )
                        }
                        {chatContent(username, messages)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Room;
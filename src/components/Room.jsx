import React from "react";
import axios from "axios";
import io from "socket.io-client";
import PopUp from "./ValidateUser";
import { ErrorTop, ShowError, HideError } from "./Error";
import { parseMessage } from "../message/message_parser";
import endpoint from "./Consts"

class Room extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            id: null,
            private: null,
            username: null,
            messages: []
        };

        this.messagesArray = [];

        this.socket = null;
        // Not using .at() method because Safari doesn't support it
        this.roomId = window.location.href.split("/").pop();
    }

    componentDidMount() {
        this.processInitialData();
    }

    componentDidUpdate() {
        // Disconnect user when leaving page
        window.onbeforeunload = () => {
            this.socket.emit("disconnect_client", { room: this.roomId, username: this.state.username });
        }

        // On Resize event. Calls resizeContainerMsg func 
        window.onresize = () => {
            resizeContainerMsg();
        }

        // Resizing
        const resizeContainerMsg = () => {
            let resizeContainer = document.getElementById("messages");
            let newHeight = window.innerHeight;
            newHeight = newHeight - 253;
            resizeContainer.style.height = `${newHeight}px`
        }

        // Resize when loading
        resizeContainerMsg();
    }


    // Get basic info about the room
    // Called before the render
    processInitialData = () => {
        axios.get(endpoint + "/api/room/" + this.roomId)
            .then((data) => {
                // Only proceed if there was an OK response
                if (data["status"] === 200) {
                    data = data["data"][200];
                    // Assign variables to the state
                    this.setState({
                        isLoading: false,
                        id: data["id"],
                        private: data["private"],

                    })
                    // Log data to console
                    console.log("Premount data: " + JSON.stringify(data));
                } else ShowError("Room doesn't exist!"); // If data response is not OK. Show error msg
            })
            .catch((error) => {
                ShowError("Error getting the data");
                console.error(error);
            });
    }

    // Connect to the socket
    connect = (user, passw) => {
        if (this.socket) {
            this.setState({
                username: user
            });
            this.socket.emit('join', { channel: this.roomId, username: user, password: passw });
            console.log("Connected with: " + user);
        } else {
            ShowError("Error connecting to socket!")
        }
    }

    // Join to socket
    // Executed when sending the form
    join = (user, passw) => {
        // Fetch API data
        axios.post(endpoint + "/api/join", {
            id: this.roomId,
            password: passw
        })
            .then((data) => {
                if (data["data"][200]) {
                    console.log("Connected to room!")
                    // Connect if the server response is OK
                    this.socket = io.connect(`${endpoint}`);
                    this.socket.on('message', (data) => {
                        console.log(`Username ${data[1]} incoming message: ${data[0]}`);
                        let contentToAdd = { msg: data[0], user: data[1] };
                        this.setState({
                            messages: [...this.state.messages, contentToAdd]
                        })

                        // Scroll div on new data
                        var elem = document.getElementById('messages');
                        elem.scrollTop = elem.scrollHeight;
                    });
                    this.connect(user, passw);
                }

                else {
                    ShowError(JSON.stringify(data["data"]));
                }
            }).catch((err) => {
                console.error(err.message);;
            });
    }

    // Send message on click / enter
    sendMessage = (event) => {
        try {
            event.preventDefault();
        } catch (e) { console.warn("Event undefined: 'event.preventDefault()'") }
        let messageInput = document.getElementById("message-input");
        let message = messageInput.value;

        if (message !== "" && message.length <= 5000) {
            HideError();
            this.socket.emit('message', { message: message, channel: this.roomId, username: this.state.username });
            messageInput.value = ""
        } else {
            console.log("Invalid blank message");
            ShowError("Invalid message. Message cannot be blank or contain more than 5000 characters.")
        }
    };

    // Parse messages content
    chatContent = (user, messages) => {
        let content = []
        if (this.state.messages.length > 0) {
            this.state.messages.map((getter, i) => (
                content.push(
                    <div key={i}>
                        {parseMessage(getter, this.state.username)}
                    </div>
                )
            ));
            return content;
        }
    }

    render() {
        const isLoading = this.state.isLoading;
        if (isLoading) {
            // Wait until the preload data is fetched
            return false;
        }
        return (
            <div>
                <div className="room">
                    <ErrorTop text="" />
                    <PopUp title="Create a temporal username" subtitle="Other users in this room will identify you with this user."
                        placeholder="Input your username!" room={this.roomId}
                        private={this.state.private} placeholder_password="Room password" func={this.join} />
                    <form onSubmit={this.sendMessage}>
                        <div className="input-group mb-3 chat-input-container">
                            <input type="text" className="form-control" placeholder="Message" aria-label="Message to send" id="message-input" name="message" />
                            <button className="input-group-text send-button tr-f" id="send-button" onClick={this.sendMessage}><i className="fa-solid fa-paper-plane tr-f"></i></button>
                        </div>
                    </form>
                    <div className="container">
                        <h1 className="title mb-3 mt-5">Chat</h1>
                        <div className="messages" id="messages">
                            {!this.state.messages.length > 0 &&
                                (
                                    <p className="subtitle">Nothing here...</p>
                                )
                            }
                            {this.chatContent(this.state.username, this.state.messages)}
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};

export default Room;
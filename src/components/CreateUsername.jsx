import React from 'react';

import { ErrorTop, ShowError, HideError } from "./Error";

class PopUp extends React.Component {
    constructor(props) {
        super(props);
        try {
            this.content = (
                <div className="input-group mb-3">
                    <input type="text" id="popup-input" className="popup-input form-control"
                        placeholder={props.placeholder} />
                </div>
            );
        } catch (e) {
            ShowError("There was an error while running the 'CreateUsername.jsx' component!")
        }
    };

    onSubmit = (event) => {
        event.preventDefault();
        let inputValue = document.getElementById("popup-input").value;
        if (inputValue) {
            if (inputValue.length > 50) {
                ShowError("Username must be under 50 characters.");
                return;
            }

            // Create post request to API endpoint
            fetch('https://wavy-chat.herokuapp.com/api/create/username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    username: inputValue,
                    room: this.props.room
                })
            })
                .then((response) => response.json()) // Convert response to JSON obj
                .then((data) => {
                    if (data[200]) {
                        // Redirect to room
                        HideError();
                        document.getElementById("popup-container").classList.add("d-none");
                        this.props.func(inputValue);
                    }
                    else {
                        ShowError(data[400]);
                    }
                });
        } else {
            ShowError("Please input a valid username!");
        }
    }

    render() {
        return (
            <div id="popup-container">
                <ErrorTop text="" />
                <form autoComplete="off" onSubmit={this.onSubmit}>
                    <div className="popup form-control p-5" id="popup">
                        <h3 className="title-md mt-5 pt-3">{this.props.title}</h3>
                        <p className="subtitle">{this.props.subtitle}</p>
                        {this.content}
                        <button type="submit" className="btn button-sm w-100">Submit</button>
                    </div>
                </form>
            </div>
        );
    };
};


export default PopUp;
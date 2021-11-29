import React from 'react';
import axios from "axios";
import { ErrorTop, ShowError, HideError } from "./Error";

class PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.endpoint = process.env.REACT_APP_ENDPOINT;

        try {
            this.content = (
                <div className="input-group mb-3">
                    <input type="text" id="popup-name" className="popup-input form-control"
                        placeholder={props.placeholder} />
                    {props.private === true &&
                        (<input type="password" id="popup-password" className="popup-input form-control"
                            placeholder={props.placeholder_password} />)}
                </div>
            );
        } catch (e) {
            ShowError("There was an error while running the 'CreateUsername.jsx' component!")
        }
    };

    onSubmit = (event) => {
        event.preventDefault();
        const name = document.getElementById("popup-name").value;
        let password = null;
        if (this.props.private) {
            password = document.getElementById("popup-password").value;
        }
        if (name) {
            if (name.length > 50) {
                ShowError("Username must be under 50 characters.");
                return;
            }

            // Create post request to API endpoint
            axios.post(this.endpoint + '/api/validate/', {
                username: name,
                password: password,
                room: this.props.room
            })
                .then((data) => {
                    console.log("User Validated")
                    if (data["data"]["200"] === "Success") {
                        HideError();
                        document.getElementById("popup-container").classList.add("d-none");
                        // Call argument function
                        this.props.func(name, password);
                    }
                    else {
                        data = data["data"]
                        if (data["403"]) ShowError("Invalid Password!");
                        else ShowError(`${Object.keys(data)}: ${Object.values(data)}`);
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
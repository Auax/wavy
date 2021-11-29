import React from 'react';
import { withRouter } from 'react-router-dom';

import { ErrorTop, ShowError } from "./Error";

const onCheckboxChange = () => {
    // Toggle password field
    const roomPassword = document.getElementById("room-password");
    const privateCheckbox = document.getElementById("private-room-ch");
    roomPassword.disabled = !privateCheckbox.checked; // Toggle input disabled state
    !roomPassword.checked ? roomPassword.setAttribute("required", "true") : roomPassword.setAttribute("disabled", "false");
}

const validateOnChange = (id, length, warnText, lenghtOver = false) => {
    const toValidate = document.getElementById(id);
    const warnElementClassName = "form-text";
    // Change comparison depending on the lengthOver parameter
    // If lenghtOver is true, then the length of the input must be greater than the specified length
    // If lenghtOver is false, then the length of the input must be less than the specified length
    const comparison = lenghtOver ? toValidate.value.length > length : toValidate.value.length < length;

    if (comparison) {
        // Subtitle under the input field
        let warnElement = document.createElement("div");
        warnElement.setAttribute("class", warnElementClassName);
        warnElement.innerHTML = warnText;

        let nextSibling = toValidate.nextSibling;
        // Check if toValidate has already a sibling
        if (nextSibling) {
            if (nextSibling.className !== warnElement.className) {
                toValidate.parentNode.insertBefore(warnElement, nextSibling);
            }
        }

        else { // If there's no sibling, create one
            toValidate.parentNode.appendChild(warnElement);
        }
    }

    else {
        // If the comparison is not met. Then remove the warn text subtitle.
        let nextSibling = toValidate.nextSibling;
        if (nextSibling) {
            if (nextSibling.className === warnElementClassName) {
                nextSibling.remove();
            }
        }
    }
}

function CreateRoom() {
    const onSubmitForm = (event) => {

        const endpoint = process.env.REACT_APP_ENDPOINT; // Get the endpoint from env var

        event.preventDefault();

        // Captcha
        window.grecaptcha.ready(function () {
            window.grecaptcha.execute('6Lf0A2kcAAAAAL0vjtKP48OV4tdBGFStIryPOtnN', { action: 'submit' }).then(function (token) {
                // Retrieve field values
                let name_ = document.getElementById("room-name").value;
                let description_ = document.getElementById("room-description").value;
                let is_private_ = document.getElementById("private-room-ch").checked;
                let password_ = document.getElementById("room-password").value;

                // Create post request to API endpoint
                fetch(endpoint + '/api/create/post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                    body: JSON.stringify({
                        name: name_,
                        description: description_,
                        is_private: is_private_,
                        password: password_,
                        captcha_token: token
                    })
                })
                    .then((response) => response.json()) // Convert response to JSON obj
                    .then((data) => {
                        console.log(`[CreateRoom request]: ${JSON.stringify(data)}`);
                        if (data[200]) {
                            // Redirect to room
                            window.location.replace(`#/room/${data[200]}`)
                        }
                        else {
                            ShowError(data[400]);
                        }
                    });
            });
        });
    }

    return (
        <div className="create-room" id="create-room">
            <ErrorTop text="" />
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-7">
                        <div className="header text-center mt-5">
                            <h1 className="title">Create Room</h1>
                        </div>
                        <form className="form-create-room mt-5 tr-f" onSubmit={onSubmitForm} autoComplete="off">
                            <div className="mb-3">
                                {/* <label htmlFor="room-name" className="form-label">Room Name</label> */}
                                <input type="text" placeholder="Room name" className="form-control" id="room-name" name="room-name" aria-describedby="roomName"
                                    onKeyUp={() => validateOnChange("room-name", 30, "The name must be under 30 characters.", true)} tabIndex="0" required></input>
                            </div>
                            <div className="mb-3">
                                {/* <label htmlFor="room-description" className="form-label">Room description</label> */}
                                <input type="text" placeholder="Description" className="form-control" id="room-description" name="room-description" aria-describedby="roomDescripton"
                                    onKeyUp={() => validateOnChange("room-description", 150, "The description must be under 150 characters.", true)} tabIndex="0" required></input>
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="private-room-ch" name="is-private" onChange={onCheckboxChange}></input>
                                <label className="form-check-label small" htmlFor="private-room-ch">Make room private</label>
                            </div>
                            <div className="mb-1">
                                {/* <label htmlFor="room-password" className="form-label">Password</label> */}
                                <input type="password" placeholder="Password" className="form-control" id="room-password" name="password"
                                    onKeyUp={() => validateOnChange("room-password", 5, "The password must be at least 4 characters.")} tabIndex="0" disabled></input>
                            </div>
                            <div id="password-help" className="form-text">You can't change the password once the room is created.</div>
                            <button type="submit" className="btn button-md mt-3 g-recaptcha" data-sitekey="reCAPTCHA_site_key">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(CreateRoom);
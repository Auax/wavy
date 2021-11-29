import React from 'react';

let isErrorShown = false;

export const ShowError = (text = "Sample error.") => {
    if (!isErrorShown) {
        console.warn(`Showing error [${text}]`)
        let error = document.getElementById("error-top");
        if (error === null) {
            console.error("Couldn't display error!");
            console.error(text);
            return;
        }
        error.classList.remove("d-none");
        let errorText = document.getElementById("error-top-text");
        errorText.innerText = text;
        isErrorShown = !isErrorShown;
    }
}

export const HideError = () => {
    if (isErrorShown) {
        let error = document.getElementById("error-top");
        if (error !== null) {
            error.classList.add("d-none");
            isErrorShown = !isErrorShown;
        }
    }
}

export class ErrorTop extends React.Component {
    render() {
        return (
            <div className="error-top text-center d-none" id="error-top">
                <p id="error-top-text">{this.props.text}</p>
            </div>
        );
    }
};

export default ErrorTop;
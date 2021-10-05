import React from "react";
import Linkify from 'linkify-react';

export const parseMessage = (getter, username) => {
    let user = getter["user"];
    let classDiv = getter["user"] === username ? "message message-from-me d-inline-block" : "message message-from-user d-inline-block";
    let msg = createTextLinks_(getter["msg"]);


    return (
        <div>
            <span className="message-sender me-2">{user}</span>
            <div className="mb-1">
                <div className={classDiv}>
                    {msg}
                </div>
            </div>
        </div>
    )
}

const createTextLinks_ = (text) => {
    // Transform plain text into a link
    return (
        <Linkify tagName="p" className="message-text m-0 d-inline">
            {text}
        </Linkify>
    )
}
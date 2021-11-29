import React from 'react';
import { Link } from "react-router-dom";

const Navigation = () => {

    return (
        <div>
            <nav className="navbar navbar-dark">
                <div className="container-fluid">
                    <a className="navbar-brand ms-2" href="/">Wavy</a>
                    <Link className="navbar-element tr-f me-2" to="/">
                        Home
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navigation;
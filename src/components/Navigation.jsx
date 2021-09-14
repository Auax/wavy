import React from 'react';
import { Link } from "react-router-dom";

const Navigation = () => {

    return (
        <div>
            <nav className="navbar navbar-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand tr-f" to="/">
                        Home
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navigation;
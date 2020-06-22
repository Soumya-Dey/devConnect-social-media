import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="center">
            <i class="fas fa-bug x-large"></i>
            <h1 className="x-large">#404 Error</h1>
            <p className="lead">
                Sorry, The page you thought exists...doesn't!
                <br />
                Heading home would be best for you.
            </p>
            <Link to="/" className="btn btn-primary">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;

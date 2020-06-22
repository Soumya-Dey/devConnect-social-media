import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { addPost } from "../../actions/post";

const PostForm = ({ addPost }) => {
    const [text, setText] = useState("");

    return (
        <div className="post-form">
            <div className="bg-primary p-custom-3 say-div">
                <h3>Say Something...</h3>
            </div>
            <form
                className="form my-1"
                onSubmit={(e) => {
                    e.preventDefault();

                    addPost({ text });
                    setText("");
                }}
            >
                <textarea
                    name="text"
                    cols="30"
                    rows="5"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write something here..."
                    required
                ></textarea>
                <input
                    type="submit"
                    className="btn btn-dark my-1"
                    value="Add Post"
                />
            </form>
        </div>
    );
};

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);

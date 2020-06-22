import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { addComment } from "../../actions/post";

const CommentForm = ({ addComment, postId }) => {
    const [text, setText] = useState("");

    return (
        <div className="post-form">
            <div className="bg-primary p-custom-3 say-div">
                <h3>Leave a Comment...</h3>
            </div>
            <form
                className="form my-1"
                onSubmit={(e) => {
                    e.preventDefault();

                    addComment(postId, { text });
                    setText("");
                }}
            >
                <textarea
                    name="text"
                    cols="30"
                    rows="5"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add your comment here..."
                    required
                ></textarea>
                <input
                    type="submit"
                    className="btn btn-dark my-1"
                    value="Add Comment"
                />
            </form>
        </div>
    );
};

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
};

export default connect(null, { addComment })(CommentForm);

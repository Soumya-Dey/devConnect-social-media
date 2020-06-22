import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getGithubRepos } from "../../actions/profile";

const ProfileGithub = ({ getGithubRepos, githubUsername, githubRepos }) => {
    useEffect(() => {
        getGithubRepos(githubUsername);
    }, [getGithubRepos, githubUsername]);

    return (
        <div className="profile-github">
            <h2 className="text-primary my-1">
                <i className="fab fa-github"></i> &nbsp;Github Repos
            </h2>
            {githubRepos.length > 0 ? (
                <Fragment>
                    {githubRepos.map((repo) => (
                        <div
                            key={repo._id}
                            className="repo bg-white p-custom my-1"
                        >
                            <div>
                                <h4>
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {repo.name}
                                    </a>
                                </h4>
                                <p>{repo.description}</p>
                            </div>
                            <div>
                                <ul>
                                    <li className="badge badge-primary">
                                        Stars: {repo.stargazers_count}
                                    </li>
                                    <li className="badge badge-dark">
                                        Watchers: {repo.watchers_count}
                                    </li>
                                    <li className="badge badge-light">
                                        Forks: {repo.forks_count}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </Fragment>
            ) : (
                <h4>No repositories found...</h4>
            )}
        </div>
    );
};

ProfileGithub.propTypes = {
    getGithubRepos: PropTypes.func.isRequired,
    githubUsername: PropTypes.string.isRequired,
    githubRepos: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    githubRepos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);

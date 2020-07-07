import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.css";
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Forgot from "./components/auth/Forgot";
import Reset from "./components/auth/Reset";
import Alert from "./components/layouts/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import CreateOrUpdateProfile from "./components/profile-forms/CreateOrUpdateProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
import NotFound from "./components/layouts/NotFound";
import PrivateRoute from "./components/routes/PrivateRoute";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";

if (localStorage.token) setAuthToken(localStorage.token);

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />

                    <Switch>
                        <Route exact path="/" component={Landing} />

                        <section className="container">
                            <Alert />
                            <Switch>
                                <Route
                                    exact
                                    path="/register"
                                    component={Register}
                                />
                                <Route exact path="/login" component={Login} />
                                <Route
                                    exact
                                    path="/profiles"
                                    component={Profiles}
                                />
                                <Route
                                    exact
                                    path="/profile/:userId"
                                    component={Profile}
                                />

                                <PrivateRoute
                                    exact
                                    path="/dashboard"
                                    component={Dashboard}
                                />
                                <PrivateRoute
                                    exact
                                    path="/create-profile"
                                    component={CreateOrUpdateProfile}
                                />
                                <PrivateRoute
                                    exact
                                    path="/add-experience"
                                    component={AddExperience}
                                />
                                <PrivateRoute
                                    exact
                                    path="/add-education"
                                    component={AddEducation}
                                />
                                <PrivateRoute
                                    exact
                                    path="/posts"
                                    component={Posts}
                                />
                                <PrivateRoute
                                    exact
                                    path="/posts/:postId"
                                    component={Post}
                                />
                                <Route
                                    exact
                                    path="/forgot"
                                    component={Forgot}
                                />
                                <Route
                                    exact
                                    path="/reset/:resetPasswordId"
                                    component={Reset}
                                />
                                <Route component={NotFound} />
                            </Switch>
                        </section>
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;

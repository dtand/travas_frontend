import React from "react";
import AlertTemplate from "react-alert-template-basic";
import LoginForm from "./login_form";
import SocialMedia from "./social_media";

const options = {
  timeout: 3000,
  position: "top center"
};

export default class LoginArea extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="card card-login mx-auto mt-5 transparentBackground">
          <div className="card-header accountInfoHeader">Login</div>
          <div className="card-body">
            <LoginForm template={AlertTemplate} {...options}/>
            <div className="text-center">
              <a
                className="d-block small mt-3"
                href="www.travas.io/signup.html"
              >
                Signup?
              </a>
              <a className="d-block small" href="forgot-password.html">
                Forgot Password?
              </a>
            </div>
          </div>
          <SocialMedia />
        </div>
      </div>
    );
  }
}
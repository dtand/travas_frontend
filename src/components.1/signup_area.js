import React from "react";
import SignupForm from "./signup_form";
import SocialMedia from "./social_media";

export default class SignupArea extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="card card-login mx-auto mt-5 transparentBackground">
          <div className="card-header accountInfoHeader">Signup</div>
          <div className="card-body text-center">
            <SignupForm />
          </div>
          <SocialMedia />
        </div>
      </div>
    );
  }
}


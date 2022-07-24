import React from "react";
import SignupArea from "./signup_area";
import AlphaSummary from "./alpha_summary"

/**
 * CSS Specific
 */
const HEADER_STYLES = {
  color: "white"
}

export default class SignupMain extends React.Component {
  render() {
    return (
      <div>
        <br />
        <div className="container">
          <h1 className="text-center" style={ HEADER_STYLES }>
            TRAVAS PLATFORM ALPHA v1.0.0
          </h1>
          <h4 className="text-center" style={ HEADER_STYLES }>
            <i> Welcome to the private alpha! </i>
          </h4>
        </div>
        <br />
        <br />
        <AlphaSummary />
        <SignupArea />
        {}
        {}
      </div>
    );
  }
}

import React from "react";
import AlphaSummary from "./alpha_summary";
import LoginArea from "./login_area";

/**
 * CSS Specific
 */
const HEADER_STYLES = {
  color: "white"
}

/**
 * Main login component - renders login page
 */
export default class LoginMain extends React.Component {
  render() {
    return (
      <div>
        <br />
        <div className="container">
          <h1 className="text-center" style={ HEADER_STYLES } >
            TRAVAS PLATFORM ALPHA v1.0.0
          </h1>
          <h5 className="text-center" style={ HEADER_STYLES }>
            <i> Join the trader's canvas for today, tomorrow, and yesterday </i>
          </h5>
        </div>
        <br />
        <br />
        <AlphaSummary />
        <LoginArea />
      </div>
    );
  }
}

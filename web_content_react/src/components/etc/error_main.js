import React from "react";

/**
 * CSS Specific
 */
const HEADER_STYLE = {
  color: "white",
  marginTop: window.innerHeight / 3
}

const LARGE = {
  fontSize: "70px"
}


export default class ErrorMain extends React.Component {
  render() {
    return (
      <div className="container" style={ HEADER_STYLE }>
        <h1 className="text-center" style={ LARGE }>
          ERROR CONNECTING TO SERVERS...
        </h1>
        <br/>
        <h2 className="text-center">
          Oops! It looks like something went wrong with the Travas Servers. What a shame, 
          please wait while the server works itself out and come back later.
        </h2>
      </div>
    );
  }
}

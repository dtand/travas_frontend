import React from "react";


const MARGINS = {
  marginTop: window.innerHeight / 5
}

const TEXT_COLOR = {
  color: "white"
}

const TEXT_COLOR_DARKER = {
  color: "whitesmoke"
}

export default class LoginImages extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div style={ MARGINS }>
        <h1 style={ TEXT_COLOR } className="text-center">
          TRAVAS, INC
        </h1>
        <br/>
        <br/>
        <h5 className="text-center" style={ TEXT_COLOR_DARKER }>
          <i>
            The Travas platform is a product of Travas, Inc - a cryptocurrency
             research and development firm specializing in trading products. For
             more information on Travas, feel free to check out some of our 
             company resources below.
          </i>
        </h5>
        <br/>
        <br/>
        <br/>
        <div style={ TEXT_COLOR } className="text-center">
          <h2> <a style={ TEXT_COLOR } href="http://travas.io">TRAVAS.IO</a></h2> 
          <i className="fa fa-circle-thin"/> 
          <h2> <a style={ TEXT_COLOR } href="http://travas.io/blog">BLOG</a></h2>
          <i className="fa fa-circle-thin"/>
          <h2> <a style={ TEXT_COLOR } href="http://travas.io/Issue3.pdf">NEWSLETTER</a></h2>
          <i className="fa fa-circle-thin"/>
          <h2><a style={ TEXT_COLOR } href="http://travas.io/blog/contact">CONTACT US</a></h2>
        </div>
      </div>
    );
  }
}


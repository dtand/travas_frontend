import React from "react";
import SocialMedia from "../generic/social_media";

const PARENT_MARGINS = {
  marginLeft: "15px",
  marginRight: "5px"
}

const BORDER_MARGINS = {
  marginBottom: "10px",
}

const SOCIAL_MARGINS = {
  marginTop: "10px"
}

export default class LoginTitle extends React.Component {
  
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        <div className="text-center border-bottom"
             style={ PARENT_MARGINS }>
          <h1 className="text-secondary" style={ BORDER_MARGINS }>
            { this.props.title }
          </h1>
        </div>
        <div style={ SOCIAL_MARGINS }>
          <SocialMedia/>
        </div>
      </div>
    );
  }
}
import React from "react";
import HoverIcon from "./hover_icon";

const MARGINS = {
  marginLeft: "15px",
  marginRight: "15px"
}

export default class SocialMedia extends React.Component {
  render() {
    return (
      <div>
        <ul className="list-inline list-social text-center">
          <li className="text-secondary list-inline-item social-twitter" 
              style={ MARGINS }>
            <h4>
              <a href="https://twitter.com/travasresearch">
                <HoverIcon icon="fa-twitter"/>
              </a>
            </h4>
          </li>
          <li className="text-secondary list-inline-item social-twitter"
              style={ MARGINS }>
              <h4>
            <a href="https://facebook.com/travasresearch">
              <HoverIcon icon="fa-facebook"/>
            </a>
            </h4>
          </li>
          <li className="text-secondary list-inline-item social-instagram"
              style={ MARGINS }>
              <h4>
            <a href="https://instagram.com/travasresearch">
              <HoverIcon icon="fa-instagram"/>
            </a>
            </h4>
          </li>
          <li className="text-secondary list-inline-item social-telegram"
              style={ MARGINS }>
              <h4>
            <a href="https://web.telegram.org/#/im?p=g226968229">
              <HoverIcon icon="fa-telegram"/>
            </a>
            </h4>
          </li>
          <li className="text-secondary list-inline-item social-youtube"
              style={ MARGINS }>
              <h4>
            <a href="https://www.youtube.com/channel/UClVLyv6bL-PJdgrODzmvXMA">
              <HoverIcon icon="fa-youtube"/>
            </a>
            </h4>
          </li>
          <li className="text-secondary list-inline-item social-reddit"
              style={ MARGINS }>
              <h4>
            <a href="https://reddit.com/r/Travas">
              <HoverIcon icon="fa-reddit"/>
            </a>
            </h4>
          </li>
        </ul>
      </div>
    );
  }
}

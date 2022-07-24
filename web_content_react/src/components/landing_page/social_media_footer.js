import React from "react";
import Constants from "../../js/Constants";

const MARGINS = {
  marginLeft: "5px",
  marginRight: "5px"
}

export default class SocialMediaFooter extends React.Component {
  render() {
    return (
      <div>
        <ul className={ Constants.IS_MOBILE ? "list-inline list-social text-center" : "list-inline list-social text-left" }>
          <li className="text-white list-inline-item social-twitter margin-right-5">
            <h4>
              <a className="footer-item" href="https://twitter.com/travasresearch">
                <i className="fa fa-twitter"/>
              </a>
            </h4>
          </li>
          <li className="text-white list-inline-item social-twitter"
              style={ MARGINS }>
              <h4>
            <a className="footer-item" href="https://facebook.com/travasresearch">
              <i className="fa fa-facebook"/>
            </a>
            </h4>
          </li>
          <li className="text-white list-inline-item social-instagram"
              style={ MARGINS }>
              <h4>
            <a className="footer-item" href="https://instagram.com/travasresearch">
              <i className="fa fa-instagram"/>
            </a>
            </h4>
          </li>
          <li className="text-white list-inline-item social-telegram"
              style={ MARGINS }>
              <h4>
            <a className="footer-item" href="https://t.me/joinchat/Jw1UkA2HQqVndYW6iVzsJA">
              <i className="fa fa-telegram"/>
            </a>
            </h4>
          </li>
          <li className="text-white list-inline-item social-youtube"
              style={ MARGINS }>
              <h4>
            <a className="footer-item" href="https://www.youtube.com/channel/UClVLyv6bL-PJdgrODzmvXMA">
              <i className="fa fa-youtube"/>
            </a>
            </h4>
          </li>
          <li className="text-white list-inline-item social-reddit"
              style={ MARGINS }>
              <h4>
            <a className="footer-item" href="https://reddit.com/r/Travas">
              <i className="fa fa-reddit"/>
            </a>
            </h4>
          </li>
          <li className="text-white list-inline-item social-reddit"
              style={ MARGINS }>
              <h4>
            <a className="footer-item" href="https://www.linkedin.com/company/travas/about/">
              <i className="fa fa-linkedin"/>
            </a>
            </h4>
          </li>
        </ul>
      </div>
    );
  }
}

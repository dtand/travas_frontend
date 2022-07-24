import React from "react";

export default class SocialMedia extends React.Component {
  render() {
    return (
      <div>
        <ul
          className="list-inline list-social text-center"
          style={{
            verticalAlign: "bottom"
          }}
        >
          <li className="list-inline-item social-twitter">
            <a
              href="https://twitter.com/travasresearch"
              style={{
                background: "white"
              }}
            >
              <i
                className="fa fa-twitter"
                style={{
                  color: "#2d4159"
                }}
              />
            </a>
          </li>
          <li className="list-inline-item social-facebook">
            <a
              href="https://facebook.com/travasresearch"
              style={{
                background: "white"
              }}
            >
              <i
                className="fa fa-facebook"
                style={{
                  color: "#2d4159"
                }}
              />
            </a>
          </li>
          <li className="list-inline-item social-instagram">
            <a
              href="https://instagram.com/travasresearch"
              style={{
                background: "white"
              }}
            >
              <i
                className="fa fa-instagram"
                style={{
                  color: "#2d4159"
                }}
              />
            </a>
          </li>
          <li className="list-inline-item social-telegram">
            <a
              href="https://web.telegram.org/#/im?p=g226968229"
              style={{
                background: "white"
              }}
            >
              <i
                className="fa fa-telegram"
                style={{
                  color: "#2d4159"
                }}
              />
            </a>
          </li>
          <li className="list-inline-item social-youtube">
            <a
              href="https://www.youtube.com/channel/UClVLyv6bL-PJdgrODzmvXMA"
              style={{
                background: "white"
              }}
            >
              <i
                className="fa fa-youtube"
                style={{
                  color: "#2d4159"
                }}
              />
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

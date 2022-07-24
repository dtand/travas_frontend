import React from "react";
import ApiController from "../js/ApiController"

const AVI_PATH  = "userContent/";

const IMG_STYLE = {
  width: "128px",
  height: "128px"
}

export default class UserDescription extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        "username": "",
        "avi": "" 
      }
      this.onLoadUserSuccess = this.onLoadUserSuccess.bind(this);
    }

    async onLoadUserSuccess(response){
      this.setState({
        username: response.username.toUpperCase(),
        avi: AVI_PATH + response.username.toLowerCase() + ".png"
      })
    }

    componentDidMount(){
      ApiController.doPostWithToken("user_profile",{},this.onLoadUserSuccess);
    }

    render() {
      return (
        <div>
          <li>
            <br/>
          </li>
          <li className="text-center">
            <img id="avi" style={ IMG_STYLE } src={ require("../userContent/daniel.png") }/>
          </li>
          <li className="text-center">
            <h3 id="username"> { this.state.username } </h3>
          </li>
        </div>
      );
    }
  }
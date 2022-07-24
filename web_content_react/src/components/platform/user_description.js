import React from "react";

export default class UserDescription extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        "username": "",
        "avi": "" 
      }
    }

    getUsername(){
      const length = this.props.username.length;
      if(length <= 6){
        return (<h1 className="text-white">
        <span class="fa fa-user"/> { this.props.username.toUpperCase() } 
      </h1>);
      }
      else if(length <= 8){
        return (<h2 className="text-white">
        <span class="fa fa-user"/> { this.props.username.toUpperCase() } 
      </h2>);
      }
      else if(length <= 12){
        return (<h3 className="text-white">
        <span class="fa fa-user"/> { this.props.username.toUpperCase() } 
      </h3>);
      }
      return (<h4 className="text-white">
        <span class="fa fa-user"/> { this.props.username.toUpperCase() } 
      </h4>);
    }

    render() {
      return (
        <div>
          <br/><br/><br/><br/>
          <li className="text border-bottom" style={{marginLeft:"15px", marginRight:"5px"}}>
            { this.getUsername() }
          </li>
        </div>
      );
    }
  }
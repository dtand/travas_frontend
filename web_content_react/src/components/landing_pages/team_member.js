import React from "react";

export default class TeamMember extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
      return (
          <div>
            <img width={ 300 } 
                 height={ 350 }
                 style={ {
                     display: "inline"
                 } }
                 src={ this.props.imagePath }/>
            <div className="border-bottom margin-left-25 margin-right-25">
                <h3 className="text-uppercase margin-bottom-10 margin-top-10">
                    { this.props.fullName }
                </h3>
                <i>
                    <h6 className="text-uppercase">
                        { this.props.title }
                    </h6>
                </i>
            </div>
            <div className="margin-top-5">
                <ul className="list-inline list-social text-center">
                    <li className="text-secondary list-inline-item social-linkedin">
                        <h5><a className="fa fa-linkedin" href={ this.props.linkedin }/></h5>
                    </li>
                    <li className="text-secondary list-inline-item social-twitter">
                        <h5><a className="fa fa-twitter" href={ this.props.twitter }/></h5>
                    </li>  
                </ul>
            </div>
            <div className="container">
                <p className="text-left text-secondary margin-top-10 about body-text">
                    { this.props.description }
                </p>
                <p className="text-left text-uppercase text-secondary margin-top-10 about body-text">
                    { this.props.email }
                </p>
            </div>
          </div>
    );
  }
}
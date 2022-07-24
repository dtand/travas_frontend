import React from "react";
import Constants from "../../js/Constants";

const BODY_BACKGROUND = {
    backgroundColor: "white"
}


const BODY_MARGINS = {
    marginTop: "4px",
    marginLeft: "100px",
    marginRight: "100px"
}

const INNER_MARGINS = {
    marginTop: "50px"
}

export default class FAQItem extends React.Component {

    state={
        showAnswer: false
    }

    render() {

      const self = this;

      return (
        <span className="text-left about">
            <h3 className="clickable" onClick={ () => { 
                self.setState({
                    showAnswer: !self.state.showAnswer
                });
            }}> { this.props.question } { 
                this.state.showAnswer ?
                     <span> <i className="fa fa-caret-up"/></span> : 
                     <span> <i className="fa fa-caret-down"/></span>
            } 
            </h3>
            { this.state.showAnswer && 
                <div className="container">
                    <p className="text-black"> { this.props.answer }</p>
                </div>
            }
            <br/>
        </span>
    );
  }
}
import React from "react";

const STYLE={
    backgroundColor: "rgb(236, 245, 251)",
    maxWidth: "30%",
    marginRight: "3px",
    marginLeft: "3px",
    marginBottom: "15px"
  }

export default class AlertsFilterBox extends React.Component {

    constructor(props){
      super(props);
    }

    render(){
        return(
        <div className="col-md-4 text-center text-primary style_prevu_kit rounded clickable" 
                 style={ STYLE }
                 onClick={ this.props.onClick }>
            <br/>
            <h1 className="text-black"> { this.props.filterName } </h1>
            <br/>
            <h2 className="text-black"> <i className={ this.props.filterIcon }/> { this.props.messageCount } </h2>
        </div>
      );
    }
}
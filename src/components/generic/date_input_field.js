import React from "react";

const STYLE = {
  marginRight: "10px",
}

const PADDING = {
  paddingLeft: "5px"
}

export default class DateInputField extends React.Component {
  
  constructor(props){
    super(props);
  }

  render() {
    return (
    <label for={ this.props.id } style={ STYLE }>
      { this.props.label }
      <input type="date" 
             name="date" 
             value={ this.props.defaultValue }
             id={ this.props.id }
             min={ this.props.minDate ? this.props.minDate : "2000-01-01" }
             max={ new Date().toJSON().split('T')[0] }/>
    </label> 
    );
  }
}


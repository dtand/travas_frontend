import React from "react";

export default class SimpleToggle extends React.Component {
  
  constructor(props){
    super(props);
  }
  
  render() {
    return (
      <div onClick={ this.props.onChange } class="custom-control custom-checkbox">
        <input onClick={ this.props.onChange } 
               type="checkbox" 
               class="custom-control-input"
               checked={ this.props.active } />
        <label class="custom-control-label"> 
          { this.props.label } 
        </label>
      </div>
    );
  }
}


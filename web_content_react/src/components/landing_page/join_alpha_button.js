import React from "react";

export default class JoinAlphaButton extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      hovered: false
    }
    this.onHover  = this.onHover.bind(this);
    this.offHover = this.offHover.bind(this);
  }

  onHover(){
    this.setState({
      hovered: true
    });
  }

  offHover(){
    this.setState({
      hovered: false
    });
  }

  render() {

    const btnClass = this.state.hovered ? 
                     "btn-join-primary" : 
                     "btn-join-secondary";

    return (
      <span class="text-center center">
        <button onMouseEnter={ this.onHover }
                onMouseLeave={ this.offHover }
                onMouseDown={ () => { window.location = "signup" } }
                class={ "border rounded text-center btn btn-lg " + btnClass } >
          <div class="text-center">
            <i>
              { this.props.text }
            </i>
          </div>
        </button>
      </span>
    );
  }
}


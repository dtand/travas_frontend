import React from "react";

const FLOAT_RIGHT_STYLE = {
  right: "50px",
}

const BUTTON_STYLE = {
  width: "160px",
}

const BUTTON_STYLE_MINI = {
  width: "5px",
  height: "25px",
  color: "black",
  bottom: "10px",
  right: "7px"
}

const DROPDOWN_STYLE = {
  maxHeight: "60vh",
  overflowY: "auto",
  position: "absolute",
  willChange: "transform",
  marginTop: "5px",
}

export default class ExchangeDropdown extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          clicked: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    async handleClick(){
      this.setState({
        clicked: !this.state.clicked
      })
    }

    async handleMouseOut(){
      this.setState({
        clicked: false
      })
    }
    
    render(){

      const dropdown = this.props.dropdownList.map((exchange,index) => 
          <a key={ exchange.toUpperCase() }
             className="dropdown-item"
             onClick={ this.props.onClickRow ? () => this.props.onClickRow(exchange) : function(){} }
             href="#" 
             data-toggle="modal"
             data-target="#chooseMarketModalCenter">
               { exchange.toUpperCase() }
          </a> 
        );

      return(
        <div id={ this.props.id }
             className={"btn-group"}>
            <button type="button" 
                    style={ this.props.mini ? BUTTON_STYLE_MINI : BUTTON_STYLE }
                    className={ this.props.mini ? "btn btn-link dropdown-toggle" : "btn btn-primary dropdown-toggle" }
                    data-toggle="dropdown" 
                    aria-haspopup="true" 
                    aria-expanded={ !this.state.clicked }
                    onClick={ this.handleClick } >
              { this.props.buttonText } 
            </button>
          <div class={ this.state.clicked ? "dropdown-menu show" : "dropdown-menu" }
               style={ DROPDOWN_STYLE }
               onMouseLeave={ this.handleMouseOut }>
              <h6 class="dropdown-item" href="#">
              <strong>{ this.props.header }</strong></h6>
              <div class="dropdown-divider"></div>
              {dropdown}
          </div>
        </div>
      );
    }
}
import React from "react";
import ReactTooltip from "react-tooltip"

const FLOAT_RIGHT_STYLE = {
  right: "50px",
}

const BUTTON_STYLE = {
  width: "160px"
}

const BUTTON_STYLE_HUGE = {
  width: "256px",
  height: "64px",
  fontSize: "24px"
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
  overflowX: "visible",
  willChange: "transform",
  marginTop: "5px",
  transform: "translate(0px)"
}

const DROPDOWN_STYLE_FLIPPED = {
  maxHeight: "60vh",
  overflowY: "auto",
  overflowX: "visible",
  willChange: "transform",
  marginTop: "5px",
  transform: "translate(-150px)"
}

const DROPDOWN_STYLE_FLIPPED_HALF = {
  maxHeight: "60vh",
  overflowY: "auto",
  overflowX: "visible",
  willChange: "transform",
  marginTop: "5px",
  transform: "translate(-75px)"
}

const MAX_HEADER_LENGTH = 10;

export default class Dropdown extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          clicked: false,
          tooltipHover: false,
          selectedTooltip: []
        }

        this.toggleTooltip  = this.toggleTooltip.bind(this);
        this.handleClick    = this.handleClick.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.onClickRow     = this.onClickRow.bind(this);
        this.initTooltips   = this.initTooltips.bind(this);
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

    onClickRow(value,index){
      let parameter = this.props.mappedData ? this.props.mappedData[index] : value;
      if(this.props.mappedData){
        parameter.dropdownValue = value;
      }
      if(this.props.exitOnClick){
        this.setState({
          clicked: false
        });
      }
      this.props.onClickRow(parameter,index);
    }

    generateHeader(){
      if(this.props.buttonText.length > MAX_HEADER_LENGTH){
        return this.props.buttonText.substring(0,MAX_HEADER_LENGTH) + "...";
      }
      return this.props.buttonText;
    }

    updateStyle(dropdownStyle){
      if(this.state.tooltipHover){
        /**return{
          maxHeight: "60vh",
          overflowY: "visible",
          willChange: "transform",
          marginTop: "5px"
        }**/
        return dropdownStyle;
      } 
      return dropdownStyle;
    }

    initTooltips(){
      let tooltipState = [];
      for(let i=0;i<this.props.dropdownList.length;i++){
        tooltipState.push(false);
      }
      this.setState({
        selectedTooltip: tooltipState
      });
    }

    toggleTooltip(index){
      this.state.selectedTooltip[index] = !this.state.selectedTooltip[index];
    }

    getMenuClass(){
      
      let className = "";

      if(this.state.clicked){
        className = "border-2-secondary dropdown-menu show";
      }
      else{
        className = "border dropdown-menu";
      }

      if(this.props.additionalClass){
        className += (" " + this.props.additionalClass);
      }

      return className;
    }

    componentDidMount(){
      if(this.props.tooltips && this.state.selectedTooltip.length === 0){
        this.initTooltips();
      }
    }
    
    render(){

      const self = this;
      const dropdown = this.props.dropdownList.map((value,index) => 
          <span key={ typeof value === "string" ? value.toUpperCase() : value }
                className="dropdown-item clickable"
                onClick={ this.props.onClickRow ? () => self.onClickRow(value,index): function(){} }
                data-toggle="modal"
                data-target={ this.props.dataTarget }>
                    <div>
                    { 
                      ( this.props.tooltips && 
                        this.props.tooltips[index] ) ?
                          ( typeof value === "string" ? 
                            <span> 
                              <i onClick={ () => self.toggleTooltip(index) }
                                 className="text-secondary clickable fa fa-info-circle"/> 
                              {" "}{ value.toUpperCase() }
                            </span> : 
                            <span> 
                              <i onClick={ () => self.toggleTooltip(index) }
                                 className="text-secondary clickable fa fa-info-circle"/> 
                              {" "}{ value }
                            </span> )
                            :
                            ( typeof value === "string" ? 
                              value.toUpperCase() : 
                              value )

                    }{ this.props.tooltips && 
                       this.props.tooltips[index] &&
                       this.state.selectedTooltip[index] &&
                      <div style={ { marginLeft:"20px"} }>
                        { this.props.tooltips[index] }
                      </div>

                    }
                    </div>
          
          </span> 
        );

      let actions = <div/>

      if(this.props.actions){
        actions = this.props.actions.map((value) => 
          <span className="dropdown-item clickable">
            {value}
          </span>);
      }
      
      let buttonStyle = this.props.styleOverride ? this.props.styleOverride : BUTTON_STYLE;
      
      if(this.props.huge){
        buttonStyle = BUTTON_STYLE_HUGE;
      }
      
      const buttonClass = this.props.classOverride ? 
                            this.props.classOverride : 
                              this.props.mini ? "btn btn-link dropdown-toggle" : 
                                                "btn btn-primary dropdown-toggle";
      let dropdownStyle = DROPDOWN_STYLE;

      if(this.props.flipped){
        dropdownStyle = DROPDOWN_STYLE_FLIPPED;
      }
      else if(this.props.flippedHalf){
        dropdownStyle = DROPDOWN_STYLE_FLIPPED_HALF;
      }

      dropdownStyle = this.updateStyle(dropdownStyle);

      return(

        <div id={ this.props.id }
             className="btn-group">
            <button type="button" 
                    style={ this.props.mini ? BUTTON_STYLE_MINI : buttonStyle }
                    className={ buttonClass }
                    data-toggle="dropdown" 
                    aria-haspopup="true" 
                    aria-expanded={ !this.state.clicked }
                    onClick={ this.handleClick } >
              { this.generateHeader() } 
            </button>
          <div className={ this.props.dropdownWrapper ? this.props.dropdownWrapper : "" }>
            <div className={ this.getMenuClass() }
                style={ dropdownStyle }
                onMouseLeave={ this.handleMouseOut }>
                <h6 className="text-center margin-top-5 margin-bottom-5"  style={{ 
                      overflowX: "hidden"
                  }}>
                  <strong className="text-black">{ this.props.header }</strong>
                </h6>
                <div class="dropdown-divider"></div>
                { dropdown }
                { actions }
            </div>
          </div>
        </div>
      );
    }
}
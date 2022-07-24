import React from "react";
import Constants from "../../js/Constants";
import IconHeader from "../generic/icon_header";

export default class IndicatorsHeader extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            toggled: [true,true]
        }
    }

    toggle = (index) => {
        let toggled = this.state.toggled;
        toggled[index] = !toggled[index];
        this.setState({
            toggled: toggled
        });

        //Update TA filter
        if(index === 0){
            this.props.updateDropdownFilter("ta",toggled[index]);
        }

        //Update OLHCV filter
        else{
            this.props.updateDropdownFilter("ohlcv",toggled[index]);
        }
    }

    render(){

      const self = this;
      const toggles = ["INDICATORS (TA)","OHLCV"];

      const toggleList = toggles.map((indicator,index) =>
            <div className="row">
                <div className="col-sm-8">
                    <label className="margin-right-5" for={ indicator+"-toggle" }>
                        <h6 className="text-black">
                            <strong>{ indicator }</strong>
                        </h6>
                    </label>
                </div>
                <div className="col-sm-2">
                    <input key={ indicator+"-toggle" }
                            id={ indicator+"-toggle" }
                            type="checkbox" 
                            className="clickable"
                            checked={ this.state.toggled[index] }
                            value={ indicator }
                            onChange={ () => this.toggle(index) }/>
                </div>
            </div>
      ); 

      return(
            <div className="row" style={{ 
                    overflowX: "hidden"
                }}>
                <div className="text-black col-md-12 margin-bottom-5 margin-left-5 text-left text-center">
                    SELECT YOUR INDICATOR
                </div>
                <div className="col-md-12 margin-left-5 margin-top-5 text-black text-left" style={ { fontSize: "12px" } }>
                    <div className="margin-top-5 margin-left-5">
                        { toggleList } 
                    </div> 
                </div>
            </div>
        );
    }
}
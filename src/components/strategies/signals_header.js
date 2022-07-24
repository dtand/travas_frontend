import React from "react";
import Constants from "../../js/Constants";
import IconHeader from "../generic/icon_header";

export default class SignalsHeader extends React.Component{
    
    constructor(props){
        super(props);
    }

    render(){

      const self = this;

      const toggleList = Constants.SIGNAL_CLASSES.map((signalClass) =>
            <div className="row">
                <div className="col-sm-6">
                    <label className="margin-right-5" for={ signalClass+"-"+this.props.panelType }>
                        <h6 className="text-black">
                            <strong>{ signalClass }</strong>
                            <br/>
                            <i>{ Constants.SIGNAL_CLASS_DESCRIPTIONS[signalClass] }</i>
                        </h6>
                    </label>
                </div>
                <div className="col-sm-1">
                    <input key={ signalClass+"-"+this.props.panelType }
                            id={ signalClass+"-"+this.props.panelType }
                            type="checkbox" 
                            className="clickable"
                            checked={ this.props.toggledClasses.includes(signalClass) }
                            value={ signalClass }
                            onChange={ () => this.props.toggleClass(signalClass) }/>
                </div>
            </div>
      ); 

      return(
            <div className="row" style={{ 
                    overflowX: "hidden"
                }}>
                <div className="text-black col-md-12 margin-bottom-5 margin-left-5 text-left text-center">
                    SELECT YOUR SIGNAL
                </div>
                <div className="col-md-12 margin-left-5 margin-top-5 text-black text-left" style={ { fontSize: "12px" } }>
                    <div className="margin-top-5 margin-left-5">
                        { toggleList } 
                    </div> 
                </div>
                <div className="col-md-12 text-black text-left" style={ { fontSize: "12px" } }>
                    <div className="row margins-10">
                        <div className="col-sm-4">
                            <span className="buy-square">
                                <i className={ this.props.toggledSignals.includes("buy") ? "clickable fa fa-circle" : "clickable fa fa-circle-o" }
                                   onClick={ () => this.props.toggleSignal("buy") }/>
                            </span> RECC. BUY
                        </div>
                        <div className="col-sm-4">
                            <span className="sell-square">
                                <i className={ this.props.toggledSignals.includes("sell") ? "clickable fa fa-circle" : "clickable fa fa-circle-o" }
                                   onClick={ () => this.props.toggleSignal("sell") }/>
                            </span> RECC. SELL
                        </div>
                        <div className="col-sm-4">
                            <span className="neutral-square">
                            <i className={ this.props.toggledSignals.includes("neutral") ? "clickable fa fa-circle" : "clickable fa fa-circle-o" }
                               onClick={ () => this.props.toggleSignal("neutral") }/>
                            </span> NEUTRAL
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
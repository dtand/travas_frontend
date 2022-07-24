import React from "react";
import Constants from "../../js/Constants"
import ParameterInputList from "../generic/parameter_input_list"
import Dropdown from "../generic/dropdown"
import SignalsHeader from "./signals_header";

export default class SignalSelectPanel extends React.Component {

  constructor(props){
    super(props);
  }

  generateSignalName(title){
    return <h1 className={ this.props.titleClass } 
                id={ this.props.signalId }>
                 {  title.toUpperCase() } 
            </h1>
  }
  
  render() {
    return (
      <div>
        <br/>
        <div className="row margin-right-5">
          <div className="signal-background-text">
            { this.props.backgroundText }
          </div>
          <div className="col-md-2 text-left margin-bottom-5 margin-left-15">
             <Dropdown id={ this.props.dropdownId } 
                       classOverride={ this.props.buttonClass }
                       dropdownList={ this.props.dropdownData }
                       mappedData={ this.props.mappedData }
                       header={ <SignalsHeader panelType={ this.props.backgroundText } 
                                               toggledClasses={ this.props.toggledClasses }
                                               toggleClass={ this.props.toggleClass }
                                               toggledSignals={ this.props.toggledSignals }
                                               toggleSignal={ this.props.toggleSignal }/> }
                       onClickRow={ this.props.onSelectSignal }
                       buttonText={ "SIGNALS" }
                                    
                      dropdownWrapper={ "width-256" }/> 
          </div>
        </div>
          <br/>
          <div className={ "col-md-12" } >
            <strong>
              { typeof this.props.selectedSignal === "string" ? 
              this.generateSignalName(this.props.selectedSignal) : 
              this.generateSignalName(this.props.selectedSignal.signal) } 
            </strong>  
          </div>
          <div className="col-md-12 margin-top-5">
            <p> { typeof this.props.selectedSignal === "string" ? 
                  Constants.SIGNAL_METADATA[this.props.selectedSignal].description :
                  Constants.SIGNAL_METADATA[this.props.selectedSignal.signal].description} </p>
          </div>
          <div className={ "col-md-12 margin-top-10" }>
            <h3 className="text-black"> PARAMETERS </h3>
          </div>
          <div className="col-md-12 margin-left-5 margin-top-5">
            <ParameterInputList signal={ this.props.selectedSignal }
                                historicalParameterValues={ this.props.historicalParameterValues }
                                appendParameter={this.props.appendParameter}
                                updateCallback={ this.props.updateCallback }/>
          </div>
          <br/><br/>
        </div>
    );
  }
}


import React from "react";
import Constants from "../../js/Constants"
import ParameterInputSpinner from "./parameter_input_spinner"

export default class ParameterInputList extends React.Component {

  constructor(props){
    super(props);
  }

  getParameters(){
    return typeof this.props.signal === "string" ? 
            Constants.SIGNAL_METADATA[this.props.signal].parameters :
            Constants.SIGNAL_METADATA[this.props.signal.signal].parameters
  }

  convertToKey(parameter){
    let split = parameter.split('-');
    for(let w=1;w<split.length;w++){
      split[w] = split[w].charAt(0).toUpperCase() + split[w].substr(1);
    }
    return split.join('');
  }
  getParameterInput(parameter){
    if( typeof this.props.signal === "string"){
      return(
      <ParameterInputSpinner key={ parameter }
                             max={ Constants.INDICATOR_METADATA[parameter].max }
                             step={ Constants.INDICATOR_METADATA[parameter].step }                                    
                             inputId={ this.props.signal + "-" + parameter + "-input" } 
                             parameter={ parameter }
                             defaultValue={ this.props.historicalParameterValues.has(parameter) ?
                              this.props.historicalParameterValues.get(parameter) : 
                              Constants.INDICATOR_METADATA[parameter].defaultValue } 
                             min={ Constants.INDICATOR_METADATA[parameter].min }
                             signalId={ this.props.signal + "-" + parameter }
                             precision={ Constants.INDICATOR_METADATA[parameter].precision }
                             appendParameter={this.props.appendParameter}
                             onChangeCallback={ this.props.updateCallback }/>
      );
    }
    else{
      const key = Constants.INDICATOR_METADATA[parameter].key;
      return(
        <ParameterInputSpinner key={ parameter } 
                               max={ Constants.INDICATOR_METADATA[parameter].max }
                               step={ Constants.INDICATOR_METADATA[parameter].step }                                    
                               inputId={ this.props.signal.signal + "-" + parameter + "-input" } 
                               parameter={ parameter }
                               defaultValue={ this.props.historicalParameterValues.has(parameter) ?
                                this.props.historicalParameterValues.get(parameter) : 
                                this.props.signal[key] } 
                               min={ Constants.INDICATOR_METADATA[parameter].min }
                               signalId={ this.props.signal + "-" + parameter }
                               precision={ Constants.INDICATOR_METADATA[parameter].precision }
                               appendParameter={this.props.appendParameter}
                               onChangeCallback={ this.props.updateCallback }/>
        );
    }
  }
  render() {

    const inputList = this.getParameters().map((parameter) => 
      <div className="col-md-6">
          { this.getParameterInput(parameter) }
      </div>  
    );

  return (
      <div className="row">
        { inputList.length !== 0 && inputList }
        { inputList.length === 0 && <h2 className="margin-top-10 text-secondary text-center">
          This signal does not require any parameter settings.
        </h2> }
      </div>
    );
  }
}
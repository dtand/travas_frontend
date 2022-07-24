import React from "react";
import Constants from "../../js/Constants";
import ValueSpinner from "./value_spinner";

export default class IndicatorFunction extends React.Component {

    constructor(props){
        super(props);
        this.state={
            value: Constants.INDICATOR_METADATA[this.props.indicator.name].defaultValue
        }
    }

    onUpdateValue = (value,index) => {
        let values = this.state.value;
        values[index] = value;
        this.setState({
            value: values
        });
        this.props.onUpdateValue(values);
    }

    getValueSpinners(){

        const length = this.props.indicator.indicators.length;
        return this.props.indicator.indicators.map((value,index) =>
            <ValueSpinner indicator={ value }
                          defaultValue={ Constants.INDICATOR_METADATA[value].defaultValue }
                          min={ Constants.INDICATOR_METADATA[value].min }
                          max={ Constants.INDICATOR_METADATA[value].max }
                          step={ Constants.INDICATOR_METADATA[value].step }
                          index={ index }
                          onUpdateValue={ length === 1 ? this.props.onUpdateValue : this.onUpdateValue }/>
        );
    }

    render() {
    return(
        <div>
            { this.getValueSpinners() }
        </div>
    )}
}
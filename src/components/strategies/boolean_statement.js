import React from "react";
import Constants from "../../js/Constants";
import IndicatorFunction from "./indicator_function";
import AdvancedIndicators from "../../js/AdvancedIndicators";
import Dropdown from "../generic/dropdown"
import IndicatorsHeader from "./indicators_header";

export default class BooleanStatement extends React.Component {


    /**
     * Sets state for left hand side and right hand side args
     * @param {*} props 
     */
    constructor(props){
        super(props);
        this.state = {
            lhsValue: Constants.INDICATOR_METADATA[this.props.lhs.name].defaultValue,
            rhsValue: Constants.INDICATOR_METADATA[this.props.rhs.name].defaultValue,
            toggled: false,
        }
    }

    getBooleanStatement = () => {
        return this.generateBooleanStatement(this.state.lhsValue,this.state.rhsValue)
    }

    /**
     * Returns the generated boolean statement for this specific statement
     */
    generateBooleanStatement = (lhsValue,rhsValue) => {
        const lhs = Constants.INDICATOR_METADATA[this.props.lhs.name].toToken(lhsValue);
        const op  = this.props.operator === "IS LESS THAN" ? "<" : ">";
        const rhs = Constants.INDICATOR_METADATA[this.props.rhs.name].toToken(rhsValue);
        return lhs + " " + op + " " + rhs;
    }

    updateLhsValue = (value) => {
        this.setState({
            lhsValue: value
        });
        this.props.updateBooleanStatement(this.generateBooleanStatement(value,this.state.rhsValue),this.props.index,value);
    }

    updateRhsValue = (value) => {
        this.setState({
            rhsValue: value
        });
        this.props.updateBooleanStatement(this.generateBooleanStatement(this.state.lhsValue,value),this.props.index,value);
    }

    getOperandMappedData = () => {
        let list = [];

        for(let d=0;d<this.props.dropdownData.length;d++){
            list.push({
                operand: this.props.index
            });
        }

        return list;
    }

    componentDidUpdate(){
        if(this.props.updateEntireStatement){
            this.props.updateBooleanStatement(this.generateBooleanStatement(this.state.lhsValue,this.state.rhsValue),this.props.index);
        }
    }

    render() {
        
        const self = this;

    return(
        <div className="clickable border indicator-logic-box text-center"> 
            <div className="row margins-5">
            { this.state.toggled && 
                <div className="col-md-10 text-center margin-top-20">
                    <h5>{ this.generateBooleanStatement(this.state.lhsValue,this.state.rhsValue) }</h5>
                </div>
            }{ !this.state.toggled && 
                <div className="col-md-10"/>
            }
            <div className="col-md-1 margin-top-20">
                <button class="close" 
                        type="button" 
                        aria-label="Close" 
                        onClick={ () => { self.setState( { toggled: !self.state.toggled } ) } }>
                    <h4 aria-hidden="true">
                        { this.state.toggled ? <i className="fa fa-plus"/> : <i className="fa fa-minus"/> }
                    </h4>
                </button>
            </div>
            <div class="col-md-1 margin-top-20">
                <button class="close" 
                        type="button" 
                        aria-label="Close" 
                        onClick={ this.props.remove }>
                    <h4 aria-hidden="true">
                        <i className="fa fa-close"/>
                    </h4>
                </button>
            </div>
            <br/>
            { !this.state.toggled &&
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <h3 className="text-black">
                                { this.props.lhs.name }
                                { Constants.INDICATOR_METADATA[this.props.lhs.name] && 
                                <IndicatorFunction indicator={ this.props.lhs } onUpdateValue={ this.updateLhsValue }/>
                                }
                                { !Constants.INDICATOR_METADATA[this.props.lhs.name] && this.props.lhs.name }
                            </h3>
                        </div>
                        <br/>
                        <div className="col-md-4 text-center">
                            <h3 className="text-secondary">
                                { this.props.operator }    
                                <Dropdown className={"btn-group float-right"}
                                            buttonText={ "" }
                                            mini={ true }
                                            header="OPERATORS"
                                            mappedData={[
                                                { operator: this.props.index },
                                                { operator: this.props.index }
                                            ]}
                                            flippedHalf={ true }
                                            onClickRow={ this.props.updateOperator }
                                            dropdownList={ AdvancedIndicators.operators }/>
                            </h3>
                        </div>
                        <br/>
                        <div className="col-md-4 text-center margin-top-5">
                            <h3 className="text-black">
                                { this.props.rhs.name }
                                <Dropdown className={"btn-group float-right"}
                                        buttonText={ "" }
                                        mini={ true }
                                        flippedHalf={ true }
                                        mappedData={ this.getOperandMappedData() }
                                        header={ <IndicatorsHeader updateDropdownFilter={ this.props.updateDropdownFilter }/> }
                                        onClickRow={ this.props.updateOperand }
                                        dropdownList={ this.props.dropdownData }/>
                                { Constants.INDICATOR_METADATA[this.props.rhs.name] && 
                                <IndicatorFunction indicator={ this.props.rhs } onUpdateValue={ this.updateRhsValue }/>
                                }
                                { !Constants.INDICATOR_METADATA[this.props.rhs.name] && this.props.rhs.name }
                            </h3>
                        </div>
                    </div>
                </div>
            }
            </div>
            
            <br/>
        </div>
    )}
}
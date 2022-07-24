import React from "react";
import { DropTarget } from 'react-dnd';
import BooleanStatement from "./boolean_statement";
import AdvancedIndicators from "../../js/AdvancedIndicators";
import Dropdown from "../generic/dropdown"
import IconHeader from "../generic/icon_header"
import ModalController from "../../js/ModalController";
import NotificationController from "../../js/NotificationController";

const MAX_RULES = 10;

export default class DesignArea extends React.Component {

    constructor(props){
        super(props);
        this.state={
            indicators: [],
            indicatorsRhs: [], 
            operators: [],
            conjunctions: [],
            statements: [],
            areaClass: "design-area",
            ta: true,
            ohlcv: true,
            updateEntireStatement: 0,
            completeStatement: "",
            signalName: "None",
            signalType: "Buy"
        }
    }

    /**
     * Appends an indicator to the design area and a conjunction
     * if there is more than one indicator
     * @param {indicator to add} indicator 
     */
    addIndicator = (indicator) =>{

        //Check max rules
        if(this.state.indicators.length >= MAX_RULES){
            NotificationController.displayNotification(
                "RULE CAPACITY EXCEEDED",
                "Currently only " + MAX_RULES + " are allowed per signal.",
                "error"
            );
            return;
        }

        //Grab all statement components
        let indicators = this.state.indicators;
        let indicatorsRhs = this.state.indicatorsRhs;
        let operators  = this.state.operators;
        let conjunctions = this.state.conjunctions;

        if(indicators.length !== 0){
            conjunctions.push({
                type: "conjunction",
                name: "AND"
            })
        }

        //Add selected indicator and default RHS
        indicators.push(indicator);

        //Add close as RHS if comparable
        if(indicator.comparables.includes("CLOSE")){
            indicatorsRhs.push({
                    name: "CLOSE",
                    indicators: []
            });
        }

        //Add first comparable otherwise
        else{
            indicatorsRhs.push(AdvancedIndicators.getOperand(indicator.comparables[0]));
        }

        //Add default operator
        operators.push("IS GREATER THAN");

        //Update
        this.setState({
            indicators: indicators,
            indicatorsRhs: indicatorsRhs,
            operators: operators,
            conjunctions: conjunctions,
            completeStatement: this.createCompleteStatement(),
            updateEntireStatement: indicators.length-1
        });
    }

    /**
     * Called to updated a specific conjunction
     */
    updateConjunction = (value) => {

        let conjunctions = this.state.conjunctions;
        conjunctions[value.conjunction] = { 
            name: value.dropdownValue,
            type: "conjunction"
        }
        this.setState({
            conjunctions: conjunctions,
            updateEntireStatement: value.conjunction
        });
    }

    /**
     * Called to updated a specific conjunction
     */
    updateOperator = (value) => {

        let operators = this.state.operators;

        operators[value.operator] = value.dropdownValue;

        this.setState({
            operators: operators,
            updateEntireStatement: value.operator
        });
    }

    /**
     * Updates the left hand side value
     */
    updateIndicator = (value) => {
        let indicators = this.state.indicators;
        this.state.indicators[value.operand] = AdvancedIndicators.getOperand(value.dropdownValue);

        this.setState({
            indicators: indicators,
            updateEntireStatement: value.operand
        });
    }

    /**
     * Upddate operand (rhs value)
     */
    updateOperand = (value) => {
        let indicatorsRhs = this.state.indicatorsRhs;
        this.state.indicatorsRhs[value.operand] = AdvancedIndicators.getOperand(value.dropdownValue);

        this.setState({
            indicatorsRhs: indicatorsRhs,
            updateEntireStatement: value.operand
        });
    }

    /**
     * Called on reset to clear the design area
     */
    onReset = () => {
        this.setState({
            indicators: [],
            indicatorsRhs: [],
            operators: [],
            conjunctions: [],
            statements: [],
            completeStatement: ""
        });
    }

    /**
     * Called to remove a specific rule
     */
    removeRule = (index) => {

        //Grab all statement components
        let indicators = this.state.indicators;
        let indicatorsRhs = this.state.indicatorsRhs;
        let operators  = this.state.operators;
        let conjunctions = this.state.conjunctions;
        let statements = this.state.statements;

        //Remove rule
        indicators.splice(index,1);
        indicatorsRhs.splice(index,1);
        operators.splice(index,1);
        conjunctions.splice(index,1);
        statements.splice(index,1);

        //Update - we still have statements
        if(indicators.length > 0){
            this.setState({
                indicators: indicators,
                indicatorsRhs: indicatorsRhs,
                operators: operators,
                conjunctions: conjunctions,
                updateEntireStatement:  0
            });
        }

        //Update, reset conditional statement
        else{
            this.setState({
                indicators: indicators,
                indicatorsRhs: indicatorsRhs,
                operators: operators,
                conjunctions: conjunctions,
                updateEntireStatement:  -1,
                completeStatement: ""
            });
        }
    }

    /**
     * Sets a filter for the dropdown list for indicators and olhcv
     */
    updateDropdownFilter = (name,value) => {
        if(name === "ta"){
            this.setState({
                ta: value
            });
        }
        else if(name === "ohlcv"){
            this.setState({
                ohlcv: value
            });
        }
    }


    /**
     * Builds indicator dropdown list 
     */
    buildIndicatorDropdown = (index) => {

        let dropdownData = [];
        const lhs = this.state.indicators[index];

        if(this.state.ta){
            for(let i=0;i<AdvancedIndicators.indicators.length;i++){
                
                const indicator = AdvancedIndicators.indicators[i].name;

                //Current LHS can be compared to RHS
                if(lhs.comparables.includes(indicator)){
                    dropdownData.push(indicator);
                }
            }
        }
        if(this.state.ohlcv){
            for(let i=0;i<AdvancedIndicators.variables.length;i++){
                
                const variable = AdvancedIndicators.variables[i].name;

                //Current LHS can be compared to RHS
                if(lhs.comparables.includes(variable)){
                    dropdownData.push(variable);
                }
            }     
        }

        return dropdownData;
    }


    /**
     *  Called to concatenate and generate the boolean statement 
     */
    createCompleteStatement = () => {
        let completeStatement = "";
        for(let s=0;s<this.state.statements.length;s++){
            completeStatement += this.state.statements[s];
            if(s != this.state.statements.length-1){
                completeStatement += ( " " + this.state.conjunctions[s].name + " " );
            }
        }
        return completeStatement;
    }

    /**
     * Call to update entire boolean statement
     */
    updateBooleanStatement = (statement,index,value) =>{
        let statements    = this.state.statements
        let indicators    = this.state.indicators;
        indicators.values = value;
        statements[index] = statement;
        this.setState({
            statements: statements, 
            completeStatement: this.createCompleteStatement(),
            indicators: indicators,
            updateEntireStatement: -1
        });
    }

    /**
     * Called to generate payload for saving signal
     */
    generatePayload = (name,description,type) => {
        let payload = {
            name: name,
            description: description,
            code: this.state.completeStatement,
            signalType: type,
            signals: this.getSignals(this.state.indicators,this.state.indicatorsRhs)
        }
        return payload;
    }

    /**
     * Returns signal objects required for advanced signal payload
     */
    getSignals = (lhsIndicators,rhsIndicators) => {

        let signals = [];
        let set     = new Set();

        for(let l=0;l<lhsIndicators.length;l++){
            const lhs = lhsIndicators[l];
            if(AdvancedIndicators.isVariable(lhs.name)){
                continue;
            }
            let json  = {
                signal: lhs.name,
            }
            for(let i=0;i<lhs.indicators.length;i++){
                const indicator = lhs.indicators[i];
                json[indicator.toLowerCase()] = lhs.values[i]; 
            }
            if(set.has(JSON.stringify(json))){
                continue;
            }
            set.add(JSON.stringify(json));
            signals.push(json);
        }

        for(let r=0;r<rhsIndicators.length;r++){
            const rhs = rhsIndicators[r];
            if(AdvancedIndicators.isVariable(rhs.name)){
                continue;
            }
            let json  = {
                signal: rhs.name,
            }
            for(let j=0;j<rhs.indicators.length;j++){
                const indicator = rhs.indicators[j];
                json[indicator.toLowerCase()] = rhs.values[j]; 
            }
            if(set.has(JSON.stringify(json))){
                continue;
            }
            set.add(JSON.stringify(json));
            signals.push(json);
        }

        return signals;

    }

    /**
     * Called to handle drag exit/enter events event
     **/    
    componentWillReceiveProps = (nextProps) => {
        if (!this.props.isOver && nextProps.isOver) {
          // You can use this as enter handler
        }
    
        if (this.props.isOver && !nextProps.isOver) {
          this.setState({
              areaClass: "design-area"
          });
        }
    
        if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
          // You can be more specific and track enter/leave
          // shallowly, not including nested targets
        }
    }


    /**
     * Called when modal is submitted with final parameters
     */
    onSaveSignal = () => {
        const modalData = ModalController.getData("saveSignalModal");
        const payload   = this.generatePayload(modalData.name,modalData.description,modalData.signalType);
        alert(JSON.stringify(payload));
    }

    /**
     * Called when user clicks save button to popup final modal with data
     */
    onClickSave = () => {

        //Check if no rules exist
        if(this.state.indicators.length === 0){
            NotificationController.displayNotification(
                "NO RULES CREATED",
                "You have no rules created for this signal, please add at least one rule before continuing.",
                "error"
            );
            return;
        }

        //Show submission modal
        ModalController.showModal(
            "saveSignalModal",{
                defaultDescription: this.state.completeStatement,
                callback: this.onSaveSignal
            }
        )
    }


    render() {

        const { connectDropTarget } = this.props;

        const booleanBoxes = this.state.indicators.map( (value,index) => 
            <div className="row">
                <div className="col-md-10 margin-top-10 text-left" key={ value + index }>
                    <BooleanStatement lhs={ value }
                                      dropdownData={ this.buildIndicatorDropdown(index) }
                                      remove={ () => this.removeRule(index) }
                                      index={ index }
                                      updateIndicator={ this.updateIndicator }
                                      updateOperator={ this.updateOperator }
                                      updateOperand={ this.updateOperand }
                                      updateBooleanStatement={ this.updateBooleanStatement }
                                      operator={ this.state.operators[index] }
                                      rhs={ this.state.indicatorsRhs[index] }
                                      updateDropdownFilter={ this.updateDropdownFilter }
                                      updateEntireStatement={ this.state.updateEntireStatement === index }/>
                </div>
                { index < this.state.conjunctions.length &&             
                    <div className="col-md-2 margin-top-10 text-left" key={ value + index }>
                        <h1 className="text-secondary boolean-conjunction">
                        { this.state.conjunctions[index].name }
                        <Dropdown className={"btn-group float-right"}
                                    buttonText={ "" }
                                    mini={ true }
                                    header="CONJUNCTIONS"
                                    mappedData={[
                                        { conjunction: index },
                                        { conjunction: index }
                                    ]}
                                    onClickRow={ this.updateConjunction }
                                    flipped={ true }
                                    dropdownList={ AdvancedIndicators.conjunctions }/>
                        </h1>
                    </div>
                }
            </div>
        );

        return( connectDropTarget(
            <div className="design-area-wrapper"> 
                <div className="row">
                    <div className="col-md-12">
                        <span className="margin-right-5">
                        <Dropdown id="groupsDropdown"
                                    dropdownList={ [] }
                                    header={ "MY SIGNALS" }
                                    onClickRow={ () => {} }
                                    buttonText={ "MY SIGNALS" }
                                    additionalClass="width-2x overflow-x-hidden"/>
                        </span>
                        <span className="margin-right-5">
                        <button onClick={ this.onClickSave }
                                className="btn btn-primary text-center"
                                style={{width:"160px"}}> 
                            <IconHeader iconClass="fa fa-share-square-o" 
                                        header="SAVE" 
                                        anchor="left" 
                                        textClass="text-center"/> 
                        </button>
                        </span>
                        <span>
                            <button onClick={ this.onReset }
                                    className="btn btn-secondary text-center"
                                    style={{width:"160px"}}> 
                                <IconHeader iconClass="fa fa-refresh" 
                                            header="RESET" 
                                            anchor="left" 
                                            textClass="text-center"/> 
                            </button>
                        </span>
                    </div>
                    <br/>
                    <div className="col-md-12 margin-left-10 margin-top-10 margin-right-50 code-container">
                        <p className="margins-10">
                            <strong> SIGNAL RULES: </strong>{ this.state.completeStatement !== "" && this.state.completeStatement ? this.state.completeStatement : "No statements selected" }
                        </p>
                    </div>
                 </div>
                <br/>
                <div className="col-md-12">
                    { this.state.indicators.length === 0 && 
                        <div className={ this.state.areaClass } onMouseLeave={ () => this.setState( { areaClass: "design-area" } ) }>
                            <div className={ this.state.areaClass === "design-area" ? "design-overlay" : "design-overlay-hovered" }/>
                                <br/><br/>
                                <h1 className="text-secondary bot-title text-center">
                                    Drag and drop <span className="text-primary">INDICATORS</span> 
                                    <br/> or <span className="text-primary">OCHLV</span> variables 
                                    <br/> here to begin designing.
                                </h1>
                        </div>
                    }
                    { this.state.indicators.length > 0 &&
                    <div className={ this.state.areaClass } onMouseLeave={ () => this.setState( { areaClass: "design-area" } ) }>
                        <div className={ this.state.areaClass === "design-area" ? "design-overlay" : "design-overlay-hovered" }/>
                        { booleanBoxes }
                    </div>
                    }
                </div>
            </div>));
    }
}
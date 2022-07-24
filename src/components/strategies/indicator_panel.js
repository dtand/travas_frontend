import React from "react";
import DraggableIndicator from "./draggable_indicator";
import AdvancedIndicators from "../../js/AdvancedIndicators";

export default class IndicatorPanel extends React.Component {

    constructor(props){
        super(props);
        this.state={
            selectedPanel: "indicators"
        }
        const self = this;
    }
    render() {

    const panelItems = this.state.selectedPanel === "indicators" ?
                        AdvancedIndicators.indicators :
                        AdvancedIndicators.variables;

    const indicators = panelItems.map((value,index) => 
        <div className="margin-top-15 margin-bottom-15">
            <DraggableIndicator indicator={ value }/>
        </div>
    );

    const self = this;

    return(
        <div className="indicator-panel border-right"> 
            <h6 className="margins-left-50 margin-top-15 clickable"> 
                <span className={ this.state.selectedPanel === "indicators" ? "text-primary clickable" : "text-secondary clickable" }
                      onClick={ () => { self.setState( { selectedPanel: "indicators" } ) } }>
                    INDICATORS (TA)
                </span> | 
                {" "} 
                <span className={ this.state.selectedPanel === "ochlv" ? "text-primary clickable" : "text-secondary clickable" }
                      onClick={ () => { self.setState( { selectedPanel: "ochlv" } ) } }>
                    OHLCV
                </span>
            </h6>
            <div className="text-center">
                { indicators }
                <br/><br/><br/><br/><br/><br/><br/>
            </div>
        </div>);
    }
}
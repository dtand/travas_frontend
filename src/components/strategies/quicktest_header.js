import React from "react";

const DEFAULT_INTERVAL  = "1h";
const DEFAULT_STOP_LOSS = "5%";
let lastInterval = DEFAULT_INTERVAL;
let lastStopLoss = DEFAULT_STOP_LOSS;

export default class QuickTestHeader extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            interval: lastInterval,
            stopLoss: lastStopLoss
        }

        this.intervals  = ["5m","30m","1h","4h","1d"];
        this.stopLosses = ["1%","3%","5%","10%","100%"];
    }

    componentDidMount(){
        if(this.state.interval !== DEFAULT_INTERVAL || this.state.stopLoss !== DEFAULT_STOP_LOSS){
            this.props.updateQuicktest(this.state);
        }
    }

    render(){

      const self = this;
      const toggleList = this.intervals.map((interval) =>
        <span>
            <label for={ interval+"-quicktest" }>
                { interval }&nbsp;
            </label>
            <input key={ interval+"-quicktest" }
                id={ interval+"-quicktest-input" }
                type="checkbox" 
                className="clickable"
                checked={ this.state.interval === interval }
                value={ this.state.interval }
                onChange={ () => { 
                    self.setState( { interval: interval } );  
                    lastInterval = interval;
                    self.props.updateQuicktest({
                        interval: interval,
                        stopLoss: this.state.stopLoss
                    });
                }}/>&nbsp;
        </span>
      );

      return(
            <div className="row">
                <div className="text-black col-md-12 margin-bottom-5 margin-left-5 text-center">
                    TEST CONFIGURATION
                </div>
                <div className="col-md-12 margin-left-5 margin-top-5 text-black text-left" style={ { fontSize: "12px" } }>
                    <div className="col-md-12">INTERVAL </div> <div className="col-md-12 margin-top-5 margin-left-5">{ toggleList } </div> 
                </div>
            </div>
        );
    }
}
import React from "react";
import LineWithFocusChart from "../generic/line_with_focus_chart";
import GlobalStateController from "../../js/GlobalStateController"
import d3 from 'd3';
import Constants from "../../js/Constants";

const WIDTH_CONSTANT=2.5;

const HEIGHT_CONSTANT = 1.59

export default class QuicktestChart extends React.Component{


    constructor(props){
        super(props);
        GlobalStateController.registeredComponentWithState(this,"platformToggled");
    }

    buildDatum(){
        if(Object.keys(this.props.backtest).length === 0){
            return [];
        }
        const backtest = this.props.backtest;
        let values = [];
        let buys   = [];
        let sells  = [];
        let bh     = [];
        let p = 0;
        for(let i = 0; i < backtest.loggedReturns.length; i++) {
              
            const yValue = Number(backtest.loggedReturns[i]); 

            const dataPoint = {
                x: new Date(backtest.timestamps[i]),
                y: yValue,
                z: backtest.loggedActions[i],
                w: backtest.loggedActions[i] === "SELL" ? backtest.percentGains[p++] : 0
            };

            values.push(dataPoint);
            bh.push({
                x: new Date(backtest.timestamps[i]),
                y: backtest.loggedBuyAndHold[i], 
            });
            if(dataPoint.z === "BUY"){
                buys.push(dataPoint);
            }
            else{
                buys.push({});
            }
            
            if(dataPoint.z === "SELL"){
                sells.push(dataPoint);
            }
            else{
                sells.push({});
            }

            
        }
        return [{
            key: "backtest",
            values: values,
            color: '#007bff',
            area: true,
        },
        {
            key: "buy and hold",
            values: bh,
            color: 'rgba(14, 54, 95, 1)',
            area: false,
            disabled: true
        },
        {
            key: "buy signals",
            values: buys,
            classed: "buy-series",
            area: false,
        },
        {
            key: "sell signals",
            values: sells,
            classed: "sell-series",
            area: false,
        }];
    }

    getGraphInfo(){
        if(Object.keys(this.props.backtest).length !== 0){
        return (<strong className="graph-info-lg text-secondary">
          FINAL NETWORTH: { this.props.backtest.finalNetworth } 
          {" | "} 
          ROI: { this.props.backtest.returnOnInvestment }
          {" | "} 
          WIN RATE: { this.props.backtest.winRatio } 
          {" | "} 
          EXPECTANCY: { this.props.backtest.expectancy.toFixed(2) } 
          <br/>
          PROFIT FACTOR: { this.props.backtest.profitFactor.toFixed(2) } 
          {" | "} 
          MAX DRAWDOWN: { this.props.backtest.maxDrawdown } 
          {" | "} 
          TOTAL TRADES: { this.props.backtest.numTrades } 
        </strong>);
        }
        else{
            return (<strong className="graph-info-lg text-secondary">
            FINAL NETWORTH: { this.props.params.initialInvestment } 
            {" | "} 
            ROI: { "0.00%" }
            {" | "} 
            WIN RATE: { "0.00" } 
            {" | "} 
            EXPECTANCY: { "0.00" } 
            <br/>
            PROFIT FACTOR: { "1.00" } 
            {" | "} 
            MAX DRAWDOWN: { "0.00" } 
            {" | "} 
            TOTAL TRADES: { "0" } 
          </strong>);
        }
      }

    render(){
        return(
            <div style={ { width: "100%" } }>
                { !Constants.IS_MOBILE && this.getGraphInfo() } 
                <LineWithFocusChart 
                    type="lineWithFocusChart"
                    showLegend={ true }
                    datum={ this.buildDatum() }
                    height={ window.innerHeight / HEIGHT_CONSTANT }
                    width={ !Constants.IS_MOBILE ? (window.innerWidth / WIDTH_CONSTANT) : window.innerWidth }
                    showXAxis={ !Constants.IS_MOBILE }
                    showYAxis={ !Constants.IS_MOBILE  }
                    precision={ 2 }
                    focusHeight={ 50 }
                    tooltip={{contentGenerator: function(data){
                        const x = d3.time.format('%d/%m/%y')(new Date(data.point.x));
                        const y = data.point.y.toFixed(2);
                        const z = data.point.z;
                        const w = data.point.w;

                        if(z === "BUY"){
                        return "<h4 class='text-success border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - BUY</h4>" +
                                "<h5 class='text-left' style='margin-left:10px'> Networth: " + y + "</h5>";
                        }
                        else if(z === "SELL" && parseFloat(w) >= 0){
                        return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - SELL</h4>" +
                                "<h5 class='text-left' style='margin-left:10px'> Networth: " + y + "</h5>" +
                                "<h5 class='text-left' style='margin-left:10px;margin-right:10px'> Gain: " + "<span class='text-success'>" + w + "</span>" + "</h5>";
                        }
                        else if(z === "SELL" && parseFloat(w) < 0){
                        return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - SELL</h4>" +
                                "<h5 class='text-left' style='margin-left:10px'> Networth: " + y + "</h5>" +
                                "<h5 class='text-left' style='margin-left:10px;margin-right:10px'> Loss: " + "<span class='text-danger'>" + w + "</span>" + "</h5>";
                        }
                        return "<h4 class='text-primary border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - HOLD</h4>" +
                                "<h5 class='text-left' style='margin-left:10px;margin-right:10px'> Networth: " + y + "</h5>";
                    }}}/>
            </div>
        )
    }

}
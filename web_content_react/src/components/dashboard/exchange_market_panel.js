import React from "react";
import LastPriceTick from "./last_price_tick";
import ExchangeMarketTitle from "../backtest/market_exchange_title";
import LineWithFocusChart from "../generic/line_with_focus_chart";
import Loader from "../generic/loader";
import GlobalStateController from "../../js/GlobalStateController"
import d3 from 'd3';
import Utils from "../../js/Utils"

const EXIT_BUTTON_STYLE = {
    right: "30px"
}

const EXIT_BUTTON_STYLE_GRID = {
    marginTop: "10px",
    right: "15px"
}

const MARGINS      = { left: 100, right: 50, top: 50, bottom: 50 };
const MARGINS_GRID = { left: 0, right: 0, top: 10, bottom: 10 };


const WIDTH_CONSTANT_TOGGLED=2.75;

const WIDTH_CONSTANT=3.25;

const HEIGHT_CONSTANT=1.35;

const HEIGHT_CONSTANT_GRID=1.75;


export default class ExchangeMarketPanel extends React.Component {

    constructor(props){
        super(props);
        this.closeGraph = this.closeGraph.bind(this);

        
        this.state={
            domain:{
            min: Number.MAX_SAFE_INTEGER,
            max: 0
          }
        }
        const self = this;
        GlobalStateController.registeredComponentWithState(self,"platformToggled");
    }

    getLastPrice(){
        return this.props.candles.lastPrice.close;
    }
      
    getLastClose(){
        const priceData = this.props.candles.priceData;
        if( !priceData || priceData.length === 0){
            return 0;
        }
        return priceData[priceData.length-1].close;
    }

    closeGraph(){
        this.props.closeGraph(this.props.graphId-1);
    }

    componentDidUpdate(){
        Utils.clearTooltips();
    }

    buildDatum(){

        let values = [];
        
        for( let i = 0; i < this.props.candles.priceData.length; i++ ){
            values.push({
                x: new Date(this.props.candles.priceData[i].timestamp),
                y: parseFloat(this.props.candles.priceData[i].close),
                open: parseFloat(this.props.candles.priceData[i].open),
                high: parseFloat(this.props.candles.priceData[i].high),
                low: parseFloat(this.props.candles.priceData[i].low),
                volume: parseFloat(this.props.candles.priceData[i].volume)
            })
            this.state.domain.min = Math.min(this.state.domain.min,this.props.candles.priceData[i].close);
            this.state.domain.max = Math.max(this.state.domain.max,this.props.candles.priceData[i].close);
        }

        return [{
            values: values,
            color: "#007bff",
			area: true
        }]
    }

    render(){

        const colorStyle = {
            backgroundColor : this.props.color
        }

        return(
            <div className="col-md-12 text-center" 
                    style= { colorStyle }
                    id={this.props.graphId + "-panel"}>
                { !this.props.grid && <br/> }
                { this.props.candles.length != 0 &&
                  <div>
                    <div class="float-right" style={ this.props.grid ? EXIT_BUTTON_STYLE_GRID : EXIT_BUTTON_STYLE }>
                        <button className="close"
                                onClick={ this.closeGraph }>
                        <h5 className="text-danger">REMOVE <i className="fa fa-minus-circle"/></h5>
                        </button>
                    </div>
                    { this.props.grid && <div><br/><br/></div>}
                    <ExchangeMarketTitle graphId={ this.props.graphId }
                                        exchange={ this.props.ticker.exchange }
                                        base={ this.props.ticker.base }
                                        quote={ this.props.ticker.quote }
                                        interval={ this.props.interval }/>
                    <LastPriceTick graphId={ this.props.graphId }
                                lastPrice={ this.getLastPrice() != 0 ? this.getLastPrice() : ""  }
                                closePrice={ this.getLastClose() != 0 ? this.getLastClose() : "" }/>
                    <br/>
                    
                        <LineWithFocusChart 
                                            showYAxis={false}
                                            showLegend={ false }
                                            graphId={ this.props.graphId }
                                            datum={ this.buildDatum() }
                                            margins={ this.props.grid ? MARGINS_GRID : MARGINS }
                                            precision={ 8 }
                                            showLegend={ false }
                                            focusHeight={ 75 }
                                            height={ this.props.grid ? (window.innerHeight / HEIGHT_CONSTANT_GRID) : (window.innerHeight / HEIGHT_CONSTANT) }
                                            width={window.innerWidth / (GlobalStateController.getValue("platformToggled") ? WIDTH_CONSTANT : WIDTH_CONSTANT_TOGGLED )}
                                            tooltip={{contentGenerator: function(data){
                                                const x = d3.time.format('%d/%m/%y')(new Date(data.point.x));
                                                const close = parseFloat(data.point.y).toFixed(4);
                                                const open = parseFloat(data.point.open).toFixed(8);
                                                const high = parseFloat(data.point.high).toFixed(8); 
                                                const low = parseFloat(data.point.low).toFixed(8); 
                                                const volume = parseFloat(data.point.volume).toFixed(2); 

                                                return  ("<div style='margin-left:10px;margin-right:10px;margin-top:10px;margin-bottom:10px'>"+
                                                         "<h2 class='text-primary border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + "</h4>" +
                                                         "<h6 class='text-left text-black' style='margin-left:10px'> Open: " + open + "</h6>" +
                                                         "<h6 class='text-left text-black' style='margin-left:10px'> Close: " + close + "</h6>" +
                                                         "<h6 class='text-left text-black' style='margin-left:10px'> High: " + high + "</h6>" +
                                                         "<h6 class='text-left text-black' style='margin-left:10px'> Low: " + low + "</h6>" +
                                                         "<h6 class='text-left text-black' style='margin-left:10px'> Volume: " + volume + "</h6>" +
                                                         "</div>");
                                              }}}/>
                    </div>
                }
                {
                    this.props.candles.length === 0 &&
                    <div>
                        <Loader loadingMessage=""/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    </div>
                }
            </div>
    )};
}
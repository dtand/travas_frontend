import React from "react";
import LastPriceTick from "./last_price_tick";
import ExchangeMarketTitle from "./market_exchange_title";
import LineWithFocusChart from "./line_with_focus_chart";

const EXIT_BUTTON_STYLE = {
    right: "10px"
}

export default class ExchangeMarketPanel extends React.Component {

    constructor(props){
        super(props);
        this.closeGraph = this.closeGraph.bind(this);
    }

    getLastPrice(){
        return this.props.candles.lastPrice.close;
    }
      
    getLastClose(){
        const priceData = this.props.candles.priceData;
        return priceData[priceData.length-1].close;
    }

    closeGraph(){
        this.props.closeGraph(this.props.graphId-1);
    }

    render(){

        const colorStyle = {
            backgroundColor : this.props.color
        }

        return(
            <div className="col-md-12 text-center" 
                    style= { colorStyle }
                    id={this.props.graphId + "-panel"}>
                <br/>
                <div class="float-right" style={ EXIT_BUTTON_STYLE }>
                    <button class="btn btn-danger"
                            onClick={ this.closeGraph }>
                      X
                    </button>
                </div>
                <ExchangeMarketTitle graphId={ this.props.graphId }
                                     exchange={ this.props.ticker.exchange }
                                     base={ this.props.ticker.base }
                                     quote={ this.props.ticker.quote }
                                     interval={ this.props.interval }/>
                <LastPriceTick graphId={ this.props.graphId }
                               lastPrice={ this.getLastPrice() }
                               closePrice={ this.getLastClose() }/>
                <br/>
                <LineWithFocusChart graphId={ this.props.graphId }
                                    candles={ this.props.candles.priceData }
                                    graphParams={ this.props.graphParams }
                                    margins={ { left: 100, right: 100, top: 50, bottom: 50 } }
                                    height={ 600 }/>
            </div>
    )};
}
import React from "react"
import ExchangeMarketPanel from "./exchange_market_panel"
import ApiController from "../js/ApiController";
import DashboardTickerRow from "./dashboard_ticker_row";

const EVEN_COLOR = "#fafcff";
const ODD_COLOR  = "#f7f4ff";
const INTERVAL   = 60000;

export default class ExchangeMarketsGrid extends React.Component {

    constructor(props){
        super(props);
        this.state={
            selectedMarkets: [],
            candles: [],
            intervals: [],
            activeMarkets: []
        }

        this.onUserDashboardSuccess = this.onUserDashboardSuccess.bind(this);
        this.addMarket = this.addMarket.bind(this);
        this.removeMarket = this.removeMarket.bind(this);
    }

    addMarket(market){
        let add = true;
        let m = 0;
        for( m; m < this.state.activeMarkets.length; m++){
            if(market.index === this.state.activeMarkets[m].index){
                add = false;
                break;
            }
        }
        if(add){
            this.state.activeMarkets.unshift(market);
        }
        else{
            this.state.activeMarkets[m] = market;
        }
        this.setState({
            activeMarkets : this.state.activeMarkets
        })
    }

    removeMarket(index){
        let indexOf = 0;
        for(let m = 0; m < this.state.activeMarkets.length; m++){
            if(index === this.state.activeMarkets[m].index){
                indexOf = m;
                break;
            }
        }
        this.state.activeMarkets.splice(indexOf,1);
        this.setState({
            activeMarkets: this.state.activeMarkets
        })
    }

    getSelectedMarkets(){
        let actualSelectedMarkets = [];
        if(!this.state.selectedMarkets){
            return actualSelectedMarkets;
        }
        for(let i = 0; i < this.state.selectedMarkets.length; i++){
            if(this.state.selectedMarkets[i]){
                let ticker = this.state.tickers[i];
                ticker.index = i;
                actualSelectedMarkets.push({
                    ticker: this.state.tickers[i],
                    interval: this.state.intervals[i],
                    candles: this.state.candles[i],
                    index: i
                });
            }
        }
        return actualSelectedMarkets;
    }

    createGraphParams(index, color, area){
        return {
          "key": this.generateGraphKey(index),
          "color": color,
          "area": area
        }
    }

    generateGraphKey(index){
        return this.state.tickers[index].base.toUpperCase() 
               + "-" + 
               this.state.tickers[index].quote.toUpperCase()
    }

    async onUserDashboardSuccess(response){
        this.setState({
            tickers: response.tickers
        });

        if(!this.state.selectedMarkets) {
            this.setState({
                selectedMarkets: [],
                candles: []
            })
            for( let t = 0; t < this.state.tickers.length; t++ ){
                this.state.selectedMarkets.push(false);
            }
            for( let t = 0; t < this.state.tickers.length; t++ ){
                this.state.candles.push({});
            }
            for( let t = 0; t < this.state.tickers.length; t++ ){
                this.state.intervals.push("1d");
            }
        }
    }

    componentDidMount(){
        const payload = {
            "numSignals": 100
        }
        ApiController.doPostWithToken("user_dashboard", payload, this.onUserDashboardSuccess);
    }
    
    render(){
        if( this.state && this.state.tickers ){

            let lastColor = EVEN_COLOR;

            const exchangePanelList = this.state.activeMarkets.map((market,index) =>
               <div className="row"> 
                    <ExchangeMarketPanel graphId={ market.index+1 }
                                         ticker={ market.ticker }
                                         interval={ market.interval }
                                         color={ index % 2 === 0 ? EVEN_COLOR : ODD_COLOR }
                                         graphParams={ this.createGraphParams(0,"blue",true) }
                                         candles={market.candles}
                                         closeGraph={ this.removeMarket } />
                
                    <br/>
                  </div>
                
            );

          return(
            <div>
                <br/>
                <DashboardTickerRow className="row"
                                    tickers={ this.state.tickers } 
                                    onClickCallbackSelect={ this.addMarket }
                                    onClickCallbackDeselect={ this.removeMarket }
                                    exchangeMarketPanels={ exchangePanelList }/>
                { /**<DashboardTickerRow className="row border-bottom border-4"
                                    tickers={ this.state.tickers } 
                                    onClickCallbackSelect={ this.selectMarket }
                                    onClickCallbackDeselect={ this.deselectMarket }**/ }
                { exchangePanelList }
                <br/><br/><br/><br/>
            </div>
          );
        }
        else {
          return(
            <div className="row"/>
          );
        }
    };
}
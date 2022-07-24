import React from "react"
import ExchangeMarketPanel from "./exchange_market_panel"
import DashboardTickerRow from "./dashboard_ticker_row";

const EVEN_COLOR = "#fafcff";
const ODD_COLOR  = "#f7f4ff";
const INTERVAL   = 60000;

let init = false;

export default class ExchangeMarketsGrid extends React.Component {

    constructor(props){

        super(props);
        this.state={
            selectedMarkets: undefined,
            candles: this.props.candles,
            intervals: this.props.intervals,
            activeMarkets: [0],
            loadingMarkets: [false],
            showTickers: true,
            grid: false
        }
        this.addMarket = this.addMarket.bind(this);
        this.removeMarket = this.removeMarket.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
    }

    toggleLoading(index,flag){
        this.state.loadingMarkets[index] = flag;
        this.setState({
            loadingMarkets: this.state.loadingMarkets
        });
    }

    addMarket(market){
        this.state.activeMarkets = [];
        let add = true;
        let m = 0;
        for( m; m < this.state.activeMarkets.length; m++){
            if(market.index === this.state.activeMarkets[m]){
                return;
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
        });
    }

    removeMarket(index){
        let indexOf = 0;
        for(let m = 0; m < this.state.activeMarkets.length; m++){
            if(index === this.state.activeMarkets[m]){
                indexOf = m;
                break;
            }
        }
        this.state.activeMarkets.splice(indexOf,1);
        this.setState({
            activeMarkets: this.state.activeMarkets
        });
    }

    getSelectedMarkets(){
        let actualSelectedMarkets = [];
        if(!this.state.selectedMarkets){
            return actualSelectedMarkets;
        }
        for(let i = 0; i < this.state.selectedMarkets.length; i++){
            if(this.state.selectedMarkets[i]){
                let ticker = this.props.tickers[i];
                ticker.index = i;
                actualSelectedMarkets.push({
                    ticker: this.props.tickers[i],
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
        return this.props.tickers[index].base.toUpperCase() 
               + "-" + 
               this.props.tickers[index].quote.toUpperCase()
    }

    componentDidMount(){
    }

    componentDidUpdate(){
        init = false;
    }
    
    render(){

        const self = this;

        if(this.props.loadingIndex){
            this.state.loadingMarkets[this.props.loadingIndex] = true;
        }

        if(this.state && this.props.tickers){

            let lastColor = EVEN_COLOR;

            const exchangePanelList = this.state.activeMarkets.map((market,index) =>
               <div className={ this.state.grid ? "col-md-6" : "row"}> 
                    { this.props.tickers && this.props.tickers.length != 0 &&
                    <ExchangeMarketPanel graphId={ market+1 }
                                         ticker={ this.props.tickers[market] }
                                         interval={ this.props.intervals[market] }
                                         color={ EVEN_COLOR }
                                         graphParams={ this.createGraphParams(0,"blue",true) }
                                         candles={ this.props.candles[market] }
                                         closeGraph={ this.removeMarket }
                                         grid={ this.state.grid }/>
                    }
                
                    <br/>
                  </div>
                
            );

          return(
            <div>
                <br/>
                <h1 className="text-black text-center border-bottom"> <strong>Markets</strong> </h1>
                <button class="float-left btn btn-small btn-link"
                        onClick={
                            function(){
                                self.state.showTickers = !self.state.showTickers;
                                self.setState({
                                    showTickers: self.state.showTickers
                                });
                            }
                        }>
                <strong>TICKERS { !this.state.showTickers ? <i class="fa fa-fw fa-plus-square"/> : <i class="fa fa-fw fa-minus-square"/>  }</strong>
                </button>
                <br/><br/>
                { this.state.showTickers && 
                <DashboardTickerRow className="row"
                                    tickers={ this.props.tickers } 
                                    onClickCallbackSelect={ this.addMarket }
                                    onClickCallbackDeselect={ this.removeMarket }
                                    exchangeMarketPanels={ exchangePanelList }
                                    updateCandles={ this.props.updateCandles }
                                    intervals={ this.props.intervals }
                                    candles={ this.props.candles }
                                    updateCandles={ this.props.updateCandles }
                                    updateInterval={ this.props.updateInterval }/>
                }                 
                <button class="float-left btn btn-small btn-link"
                        onClick={
                            function(){
                                self.state.grid = !self.state.grid;
                                self.setState({
                                    grid: self.state.grid
                                });
                            }
                        }>
                {/**<strong>{ this.state.grid ? "SINGLE" : "GRID" }<i class="fa fa-fw fa-plus-square"/></strong>**/}
                </button>
                <br/><br/>
                <div>    
                    <div className={ this.state.grid ? "row" : ""}>          
                        { exchangePanelList }
                    </div>   
                    <br/><br/><br/><br/>
                </div> 
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
import React from "react";
import QuoteButtonGroup from "../generic/quote_button_group"
import FilterTable from "../generic/filter_table"
import ModalController from "../../js/ModalController"

export default class ExchangeModalBody extends React.Component {

  constructor(props){
    super(props);
    this.state={
      selectedQuotes: this.props.quotes.slice()
    }    

    this.selectMarket = this.selectMarket.bind(this);
    this.onMarketLookupSuccess = this.onMarketLookupSuccess.bind(this);
    this.removeQuote = this.removeQuote.bind(this);
    this.addQuote = this.addQuote.bind(this);
  }

  selectMarket(market){
    const base  = market[0].split("-")[0];
    const quote = market[0].split("-")[1];

    this.setState({
      selectedMarket: market[0],
      selectedBase: base,
      selectedQuote: quote
    });

    ModalController.setData("selectMarketModal",{
      graphId: ModalController.getData("selectMarketModal").graphId,
      exchange: ModalController.getData("selectMarketModal").exchange,
      base: base,
      quote: quote
    });
  }

  removeQuote(quote){
    if(this.state.selectedQuotes.indexOf(quote) != -1){
      let indexOf = this.state.selectedQuotes.indexOf(quote);
      delete this.state.selectedQuotes[indexOf];
    }
    this.setState({
      selectedQuotes: this.state.selectedQuotes
    });
  }

  addQuote(quote){
    if(this.state.selectedQuotes.indexOf(quote) != -1){
      return;
    }
    this.state.selectedQuotes.push(quote);
    this.setState({
      selectedQuotes: this.state.selectedQuotes
    });
  }

  onMarketLookupSuccess(markets){
    this.setState({
      markets: markets,
      quotes: this.buildQuotesList(markets),
      selectedQuotes: this.buildQuotesList(markets)
    });

    if(this.state.selectedQuotes.length === 0){
      for(let q=0;q<this.props.quotes.length;q++){
        this.state.selectedQuotes.push(this.props.quotes[q]);
      }
    }
  }

  buildMarketsList(markets){
    let marketList = []
    for( let q=0; q<markets.length;q++){
      marketList.push(markets[q].base + "-" + markets[q].quote);
    }
    return marketList;
  }

  filterMarketsByQuote(){
    let markets = []
    for( let q=0; q<this.props.markets.length;q++){
      let quote = this.props.markets[q].quote;
      if(this.state.selectedQuotes.indexOf(quote) > -1){
        markets.push(this.props.markets[q]);
      }
    }
    return markets;
  }

  buildTableData(){
    let markets = this.filterMarketsByQuote();
    markets     = this.buildMarketsList(markets);
    let data = [];
    for(let m=0;m<markets.length;m++){
      data.push([markets[m]]);
    }
    return data;
  }

  componentDidMount(){
    if(this.props.markets && this.props.quotes.length === 0){
      this.onMarketLookupSuccess(this.props.markets);
    }
  }

  render() {

    const data = this.props.markets.length != 0 ? this.buildTableData() : [];

    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-8">
              <QuoteButtonGroup quotes={ this.props.quotes }
                                addQuote={ this.addQuote }
                                removeQuote={ this.removeQuote }/>
            </div>
            <br/><br/>
            <div class="col-md-4">
              <h3 id="selectedMarket" 
                  class="float-left">
                  { this.state.selectedMarket ? this.state.selectedMarket : "" }
              </h3>
            </div>
          </div>
          <FilterTable data={ data } 
                       placeholder={ "Search Markets..." }
                       onClick={ this.selectMarket }/>
          </div>
    );
  }
}


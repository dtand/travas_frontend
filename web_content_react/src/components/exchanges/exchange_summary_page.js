import React from "react";
import NVD3Chart from "react-nvd3";
import SimpleToggle from "../generic/simple_toggle";
import FilterTable from "../generic/filter_table";
import ApiController from "../../js/ApiController";
import CSVDownloader from "../../js/CSVDownloader";
import NotificationController from "../../js/NotificationController";
import CryptoIcon from "../generic/crypto_coin";
import Constraints from "../../js/Constraints";

const SMALL_BALANCE = .0001;


export default class ExchangeSummaryPage extends React.Component {

    /**
     * Hide/show bots
     */
    state = {
        showRealBots: false,
        showSimulatedBots: false,
        refreshing: false,
        showSmallBalances: true,
        showSupportedQuotes: true,
    }

    /**
     * Returns running, followed by non running real funded bots on exchange
     */
    getRealBots(){
        
        //all real bots running on exchange
        let botsOn = [];

        //all real bots not running on exchange
        let botsOff = [];


        //Iterate over bots
        for(let b=0;b<this.props.userBots.length;b++){
            
            //Bot object
            const bot = this.props.userBots[b];

            //Add real that match exchange and is ON
            if(!bot.isSimulated && bot.exchange.toLowerCase() === this.props.exchangeName.toLowerCase() && bot.running){
                botsOn.push(bot);
            }

            //Add real that match exchange and is OFF
            else if(!bot.isSimulated && bot.exchange.toLowerCase() === this.props.exchangeName.toLowerCase() && !bot.running){
                botsOff.push(bot);
            }
        }

        return botsOn.concat(botsOff);
    }

    /**
     * Returns running, followed by non running simulated funded bots on exchange
     */
    getSimBots(){
        
        //all real bots running on exchange
        let botsOn = [];

        //all real bots not running on exchange
        let botsOff = [];


        //Iterate over bots
        for(let b=0;b<this.props.userBots.length;b++){
            
            //Bot object
            const bot = this.props.userBots[b];

            //Add real that match exchange and is ON
            if(bot.isSimulated && bot.exchange.toLowerCase() === this.props.exchangeName.toLowerCase() && bot.running){
                botsOn.push(bot);
            }

            //Add real that match exchange and is OFF
            else if(bot.isSimulated && bot.exchange.toLowerCase() === this.props.exchangeName.toLowerCase() && !bot.running){
                botsOff.push(bot);
            }
        }

        return botsOn.concat(botsOff);
    }

    /**
     * Returns user balance of specific currency
     * @param {Currency Sumbol} symbol 
     */
    getBalanceFromCurrency(symbol){
        for(let c=0;c<this.props.wallet.length;c++){
            const balance = this.props.wallet[c];
            if(balance.currency.toLowerCase()===symbol.toLowerCase()){
                return balance.totalBalance;
            }
        }
        return 0;
    }

    /**
     * Returns user available balance of specific currency
     * @param {Currency Sumbol} symbol 
     */
    getAvailableBalanceFromCurrency(symbol){
        for(let c=0;c<this.props.wallet.length;c++){
            const balance = this.props.wallet[c];
            if(balance.currency.toLowerCase()===symbol.toLowerCase()){
                return balance.availableBalance;
            }
        }
        return 0;
    }

    /**
     * Returns the table rows for all supported quote currencie
     */
    getSupportedQuotes(){
        return Object.keys(Constraints[this.props.exchangeName]).map((quote)=> 
            <tr>
                <td>
                    <span className="margin-right-5">
                        <CryptoIcon coinName={ quote.toLowerCase() }/>
                    </span>
                    { quote.toUpperCase() }
                </td>
                <td className="text-right">
                    { this.getBalanceFromCurrency(quote) + " " + quote.toUpperCase() + " (TOTAL)" }
                </td>
                <td className="text-right">
                    { this.getAvailableBalanceFromCurrency(quote) + " " + quote.toUpperCase() + " (AVAILABLE)" }
                </td>
            </tr>
        );
    }

    /**
     * Returns table rows with bot descriptions
     * @param {a list of user bots} bots 
     */
    createBotTable(bots){
        return bots.map((bot)=> 
            <tr>
                <td>
                    { bot.running && 
                      <span className="text-success margin-right-5">
                        (ON) 
                      </span>
                    }{ !bot.running && 
                        <span className="text-danger margin-right-5">
                          (OFF) 
                        </span>
                    }{
                        bot.name.toUpperCase()
                    }
                </td>
                <td className="text-left">
                    { bot.market.toUpperCase() }
                </td>
                <td className="text-right">
                    { bot.roi < 0 ?
                         <span className="text-danger"> ↓{ (bot.roi*100).toFixed(2)+"%" }</span> :
                         bot.roi > 0 ? 
                            <span className="text-success"> ↑{ (bot.roi*100).toFixed(2)+"%" }</span> :
                            <span className="text-secondary"> { (bot.roi*100).toFixed(2)+"%" }</span>
                    }
                </td>
            </tr>
        );
    }

    /**
     * Returns table data for user's balances
     */
    buildTableData(){

        //Return list
        let balances = []

        //Ref to supported quotes list
        const supportedQuotes = Constraints[this.props.exchangeName.toLowerCase()];

        //Iterate over wallet
        for(let c=0;c<this.props.wallet.length;c++){

            //Grab balance
            const balance = this.props.wallet[c];

            //Skip over if balance is too small or already shown in supported quotes
            if(!this.state.showSmallBalances && balance.totalBalance < SMALL_BALANCE ||
               (balance.currency.toUpperCase() in supportedQuotes)){
                continue;
            }

            //Push Table row
            balances.push([
                <CryptoIcon coinName={ balance.currency.toLowerCase() }/>,
                balance.currency.toUpperCase(),
                balance.totalBalance,
                balance.availableBalance
            ]);
        }

        return balances;
    }

   /**
   * Gets exchange info for user (account level)
   */
  refreshExchangeInfo = () => {

    //Ref self
    const self = this;

    //Set loader
    this.setState({
        refreshing: true
    });

    //Call exchange info endpoint
    ApiController.doPostWithToken(
      "exchange_account_info",{
      "exchange": this.props.exchangeName.toLowerCase()
    },

    //On Success
    function(response,exchange){
        self.props.refreshInfo(exchange,response.wallet);
        self.setState({
            refreshing: false
        });
    },

    //Name of exchange
    this.props.exchangeName.toLowerCase(),

    //On fail
    () => {
        self.setState({
            refreshing: false
        });
        NotificationController.displayNotification(
            "ERRROR...",
            "Looks like there was an issue connecting to your exchange.",
            "error"
        );
    }
    
    );

  }

    render(){

        //Ref self
        const self = this;

        //Grab bots by simulated and real
        const realBots = this.getRealBots();
        const simBots  = this.getSimBots();

        return(
            <div class="tab-pane active show">
              <h3 className="clickable text-primary float-right" style={{marginRight:"50px",marginTop:"10px",marginBottom:"10px"}}> 
                <i className={ this.state.refreshing ? "fa fa-spin fa-spinner" : "fa fa-refresh" } onClick={ this.refreshExchangeInfo }/>
              </h3>
              <br/>
              <div className="row">
                <div className="col-md-12">
                  <h1 className="text-black"> 
                    { this.props.exchangeName.toUpperCase() + " SUMMARY" } 
                  </h1>
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <td>
                          MY FUNDED BOTS
                        </td>
                        <td>
                          { realBots.length }
                        </td>
                        <td className="text-right">
                            <i className={ !self.state.showRealBots ? "clickable fa fa-plus" : "clickable fa fa-minus" }
                               onClick={ () => { self.setState( { showRealBots: !self.state.showRealBots } ) } }/>
                        </td>
                      </tr>
                      { 
                          this.state.showRealBots && this.createBotTable(realBots) 
                      }
                      <tr>
                        <td>
                            MY SIMULATED BOTS
                        </td>
                        <td>
                          { simBots.length }
                        </td>
                        <td className="text-right">
                            <i className={ !self.state.showSimulatedBots ? "clickable fa fa-plus" : "clickable fa fa-minus" }
                               onClick={ () => { self.setState( { showSimulatedBots: !self.state.showSimulatedBots } ) } }/>
                        </td>
                      </tr>
                      { 
                          this.state.showSimulatedBots && this.createBotTable(simBots) 
                      }
                    </tbody>
                  </table>
                  <div className="row">
                      <div className="col-md-4">
                            <h1 className="text-black margin-bottom-5"> 
                                { "MY WALLET" } 
                            </h1>
                            <h6 className="clickable text-black margin-bottom-10"> 
                                <strong className="margin-right-5"> TRAVAS SUPPORTED QUOTES </strong><i className={ !self.state.showSupportedQuotes ? "clickable fa fa-plus" : "clickable fa fa-minus" }
                                                            onClick={ () => { self.setState( { showSupportedQuotes: !self.state.showSupportedQuotes } ) } }/>
                            </h6>
                      </div>
                  </div>
                  { this.state.showSupportedQuotes && 
                  <table className="table table-hover">
                    <tbody>
                      {
                        this.getSupportedQuotes()
                      }
                    </tbody>
                  </table> 
                  }
                  <div className="margin-top-10">
                        <span>
                            <h6> All Currencies | </h6>
                            <SimpleToggle active={ this.state.showSmallBalances }
                                label="Show Small Balances"
                                onChange={ () => 
                                    { self.setState( { showSmallBalances: !self.state.showSmallBalances } ) } 
                                }/>
                        </span>
                    <br/>
                    <FilterTable header={[
                                    "SYM",
                                    "CURRENCY",
                                    "TOTAL",
                                    "AVAILABLE",
                                ]}
                                data={ this.buildTableData() }
                                align="left"
                                classOverride="row"
                                searchText="Search balances..."
                                disableClick={ true }/>
                  </div>
                </div>
            </div>
        </div>);        
    }
}
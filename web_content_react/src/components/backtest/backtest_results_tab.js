import React from "react";
import Dropdown from "../generic/dropdown";
import ApiController from "../../js/ApiController";
import IconHeader from "../generic/icon_header";
import NotificationController from "../../js/NotificationController";
import GlobalStateController from "../../js/GlobalStateController";
import BacktestViewSelector from "./backtest_view_selector";
import BacktestNetworthGraph from "./backtest_networth_graph";
import BacktestStreakGraph from "./backtest_streak_graph";
import BacktestToggleSelector from "./backtest_toggle_selector";
import BacktestSummaryPanel from "./backtest_summary_panel";
import BacktestGainsGraph from "./backtest_gains_graph";
import BacktestPortfolioPanel from "./backtest_portfolio_panel";

const MARGIN_TOP = {
  marginTop: "10px"
}

const TAB_MARGIN = {
  marginTop: "5px",
  marginLeft: "15px",
  marginRight: "15px"
}

/**
 * How much fee increments/decrements
 */
const FEE_INC = .01;

/**
 * Total fee
 */
const MAX_FEE = 2.00;

/**
 * How much fee slippage increments/decrements
 */
const SLIPPAGE_INC = .05;

/**
 * Total fee
 */
const MAX_SLIPPAGE = 10.00;



/**
 * Global cache used to store historical backtests
 */
let BacktestCache = new Map();

export default class BacktestResultsTab extends React.Component {

  constructor(props){
    super(props);
    this.state={
      domain: {
        min: Number.MAX_SAFE_INTEGER,
        max: 0
      },
      logScale: false,
      buyAndHold: false,
      buySignals: false,
      sellSignals: false,
      showChart: true,
      showTable: true,
      selectedGraph: "summary",
      slippage: 0,
      fees: 0,
      slippageValues: [0,0,0,0,0],
      feeValues: [0,0,0,0,0]
    }

    if(this.props.backtestResults && 
       this.props.backtestResults.length > 0 && 
       !BacktestCache.has(this.generateArchiveId(0))){
      BacktestCache.set(this.generateArchiveId(0),this.props.response);
    }

    const self = this;
    GlobalStateController.registeredComponentWithState(self,"platformToggled");

    this.selectGraph = this.selectGraph.bind(this);
    this.doArchivedBacktest    = this.doArchivedBacktest.bind(this);
    this.onArchivedTestSuccess = this.onArchivedTestSuccess.bind(this);
    this.toggleChart = this.toggleChart.bind(this);
    this.toggleTable = this.toggleTable.bind(this);
    this.toggleLogScale = this.toggleLogScale.bind(this);
    this.toggleBuyAndHold  = this.toggleBuyAndHold.bind(this);
    this.onSaveBotSuccess = this.onSaveBotSuccess.bind(this);
    this.updateFees = this.updateFees.bind(this);
    this.updateSlippage = this.updateSlippage.bind(this);
  }

   
  async updateSlippage(value){
    if(value < 0 || value > MAX_SLIPPAGE){
      return;
    }
    let slippageValues = [];
    this.setState({
      slippage: value
    });

    for(let b=0;b<this.props.backtestResults.length;b++){
      if(Object.keys(this.props.backtestResults[b]).length !== 0){
        slippageValues.push( await this.calculateTotalSlippage(this.props.backtestResults[b],value));
      }
    }
    this.setState({
      slippageValues: slippageValues
    });
  }

  async calculateTotalSlippage(backtest,slippage){
    slippage /= 100;
    let totalSlippage = 0;
    for(let b=0;b<backtest.loggedReturns.length;b++){
      if(backtest.loggedActions[b].toLowerCase() === "buy" ||
      backtest.loggedActions[b].toLowerCase() === "sell"){
        const networth = backtest.loggedReturns[b];
        totalSlippage += networth * slippage;
      }
    }
    return totalSlippage;
  }
 
  async updateFees(value){
    if(value < 0 || value > MAX_FEE){
      return;
    }
    let feeValues = [];
    this.setState({
      fees: value
    });
    for(let b=0;b<this.props.backtestResults.length;b++){
      if(Object.keys(this.props.backtestResults[b]).length !== 0){
        feeValues.push( await this.calculateTotalSlippage(this.props.backtestResults[b],value));
      }
    }
    this.setState({
      feeValues: feeValues
    });
  }

  async calculateTotalFees(backtest,fee){
    fee /= 100;
    let totalFees = 0;
    for(let b=0;b<backtest.loggedReturns.length;b++){
      if(backtest.loggedActions[b].toLowerCase() === "buy" ||
         backtest.loggedActions[b].toLowerCase() === "sell"){
        const networth = (backtest.loggedReturns[b]-totalFees);
        totalFees += networth * fee;
        console.log("NETWORTH: " + networth);
        console.log("TOTAL FEES: " + totalFees);
      }
    }
    return totalFees;
  }


  selectGraph(graph){
    this.setState({
      selectedGraph: graph
    });
  }

  onSaveBotSuccess(response,params){
    NotificationController.displayNotification(
      "BOT SAVED", 
      "New bot " + params.botName + " is now available in your bot manager",
      "info"
    ); 
          
    const userBot = {
      avgRoi: 0,
      exchange: params.exchange,
      id: response.id,
      interval: params.interval,
      isSimulated: params.isSimulated,
      market: params.baseCurrency + "-" + params.counterCurrency,
      name: params.botName,
      numTrades: 0,
      rank: 0,
      roi: 0,
      running: false,
      strategyId: params.strategyId,
      public: false,
      strategy: this.props.getStrategyWithId(params.strategyId),
      totalLosses: 0,
      totalWins: 0,
      tradingLimit: params.tradingLimit,
      winLoss: 0,
      expectancy: 0,
      profitFactor: 0,
      bestTrade: 0,
      worstTrade: 0,
      maxDrawdown: 0,
      score: 0
    }

    this.props.appendBot(userBot);
  }

  toggleChart(){
    this.setState({
      showChart: !this.state.showChart
    });
  }

  toggleTable(){
    this.setState({
      showTable: !this.state.showTable
    });
  }

  getEmptyTests(backtestResults){
    if(!backtestResults){
      return 0;
    }
    let empties = 0;
    for(let b=0;b<backtestResults.length;b++){

      const backtest = backtestResults[b];
      let values     = [];
      let buyAndHold = [];
      
      let p=0;
      if(Object.keys(backtest).length === 0){
        empties++;
      }
    }
    return empties;
  }

  getColumnClasses(backtest,index){
    return[
      "text-nowrap font-weight-bold",
      this.getClassFromValue(backtest.finalNetworth,backtest.initialInvestment),
      this.getClassFromValue(Number(backtest.returnOnInvestment.replace('%','')),0),
      "text-nowrap font-weight-bold",
      this.getClassFromValue(Number(backtest.winRatio.replace('%','')),50),
      this.getClassFromValue(backtest.expectancy,0),
      this.getClassFromValue(backtest.profitFactor,1.0),
      "text-nowrap font-weight-bold",
      "text-nowrap font-weight-bold"
    ]
  }

  getClassFromValue(value, threshold){
    if(value < threshold){
      return "text-danger text-nowrap font-weight-bold";
    }
    else if(value > threshold){
      return "text-success text-nowrap font-weight-bold";
    }
    return "text-nowrap font-weight-bold";
  }

  buildArchiveList(){
    let archiveList = [];
    for(let a=0;a<this.props.archivedTests.length;a++){
      const archive   = this.props.archivedTests[a];
      archiveList.push( "(" + (this.props.archivedTests.length-(a)) + ") " + archive.timestamp);
    }
    return archiveList;
  }

  generateArchiveId(index){
    if(this.props.archivedTests.length === 0){
      return "ARCHIVES";
    }
    const archive = this.props.archivedTests[index];
    return "(" + (this.props.archivedTests.length-(index)) + ") " + archive.timestamp;
    //const strategy  = this.props.getStrategyWithId(archive.parameters.strategyId);
    //return this._generateArchiveId(index+1, archive, strategy);
  }

  generateTestName(index){
    return "BACKTEST #" + (this.props.archivedTests.length-(index));
  }

  _generateArchiveId(index,archive,strategy){
    return "(" + (this.props.archivedTests.length-(index)) + ") " + 
    archive.timestamp + " - " + 
    strategy.name + " (" + 
    archive.parameters.exchange + " " + 
    archive.parameters.candleSize + ")";
  }

  async onArchivedTestSuccess(response,params){
    this.props.loadArchivedResults(response,params.payload,params.index);
  }

  doArchivedBacktest(archive,index){
    const parameters = archive.parameters;
    
    const payload = {
      "backtests": parameters.backtests,
      "archive": false,
    }
   this.props.toggleLoading(true,"Loading Archived Test...");

    if(!this.props.demo){
      ApiController.doPostWithToken("backtest", payload, this.onArchivedTestSuccess,{ 
        payload: payload, 
        index: index 
      });
    }
    else{
      ApiController.doPostWithToken("backtest_public", payload, this.onArchivedTestSuccess,{ 
        payload: payload, 
        index: index 
      });
    }
  }

  toggleLogScale(){
    this.setState({
      logScale: !this.state.logScale
    });
  }

  toggleBuyAndHold(){
    this.setState({
      buyAndHold: !this.state.buyAndHold
    });
  }

  render() {
    const archives = this.buildArchiveList();
    const empties  = this.getEmptyTests(this.props.backtestResults);

    return (
      
      <div class="tab-pane active show" style={ TAB_MARGIN }>
        <br/>
        <div class="row border-2-bottom-secondary" style= { { 
            height: "100px"
          } }>
          <div class="col-md-2">
          {<Dropdown id="archiveDropdown" 
                     style={ MARGIN_TOP }
                     dropdownList={ archives }
                     mappedData={ this.props.archivedTests }
                     header={ <IconHeader iconClass="fa fa-folder-open"  textClass="text-center"  header="ARCHIVES"/> }
                     onClickRow={ this.doArchivedBacktest }
                     buttonText={ this.props.selectedTest != -1 ? this.generateArchiveId(this.props.selectedTest): "ARCHIVES" }/>}
          </div>
            <div class="col-md-8">
            <h1 class="text-center text-black">
              { this.props.selectedTest != -1  && this.props.backtestResults.length != 0 ? this.generateTestName(this.props.selectedTest) : "No Test Selected" }
            </h1>
          </div>
          { this.props.backtestResults && this.props.backtestResults.length > 0 &&
          <div className="col-md-2">
              <div className="row text-black">
                  <div className="col-sm-7">
                    Slippage
                  </div>
                  <div className="col-sm-5">
                    <h5>{ this.state.slippage.toFixed(2) }%</h5>
                  </div>
                  <div className="col-sm-1 text-sm primary-hover">
                      <i className="fa fa-plus clickable" onClick={ () => this.updateSlippage(this.state.slippage+SLIPPAGE_INC) }/>
                  </div>
                  <div className="col-sm-1 text-sm primary-hover">
                      <i className="fa fa-minus clickable" onClick={ () => this.updateSlippage(this.state.slippage-SLIPPAGE_INC) }/>
                  </div>
              </div>
            <div className="row text-black">
              <div className="col-sm-7">
                Fees  
              </div>
              <div className="col-sm-5">
                <h5>{ this.state.fees.toFixed(2)  }%</h5>
              </div>
              <div className="col-sm-1 text-sm primary-hover">
                  <i className="fa fa-plus clickable" onClick={ () => this.updateFees(this.state.fees+FEE_INC) }/>
              </div>
              <div className="col-sm-1 text-sm primary-hover">
                  <i className="fa fa-minus clickable" onClick={ () => this.updateFees(this.state.fees-FEE_INC) }/>
              </div>
            </div>
          </div>
         }
        </div>
        <br/>
        <div className="row">
          <BacktestToggleSelector selectedGraph={ this.state.selectedGraph }
                                  buyAndHold={ this.state.buyAndHold }
                                  logScale={ this.state.logScale }
                                  buySignals={ this.state.buySignals }
                                  sellSignals={ this.state.sellSignals }
                                  parent={ this }/>
                                  
          <BacktestViewSelector selectedGraph={ this.state.selectedGraph }
                                selectGraph={ this.selectGraph }
                                parent={ this }
                                buyAndHold={ this.state.buyAndHold }
                                logScale={ this.state.logScale }
                                buySignals={ this.state.buySignals }
                                sellSignals={ this.state.sellSignals }/>
        </div>
        <br/>
        { this.state.showChart && this.state.selectedGraph === "networth" &&
          <BacktestNetworthGraph backtestResults={ this.props.backtestResults }
                                 slippage={ this.state.slippage/100 }
                                 fee={ this.state.fees/100 }
                                 backtestParams={ this.props.backtestParams }
                                 getStrategyWithId={ this.props.getStrategyWithId }
                                 buyAndHold={ this.state.buyAndHold }
                                 logScale={ this.state.logScale }
                                 buySignals={ this.state.buySignals }
                                 sellSignals={ this.state.sellSignals }/> 
        }
        { this.state.showChart && this.state.selectedGraph === "streak" &&
          <BacktestStreakGraph   backtestResults={ this.props.backtestResults }
                                 fees={ this.state.fees }
                                 slippage={ this.state.slippage }
                                 backtestParams={ this.props.backtestParams }
                                 getStrategyWithId={ this.props.getStrategyWithId }
                                 gainWeighted={ this.state.gainWeighted }/> 
        }
        { this.state.showChart && this.state.selectedGraph === "summary" &&
          <BacktestSummaryPanel backtestResults={ this.props.backtestResults }
                                demo={ this.props.demo }
                                slippageValues={ this.state.slippageValues }
                                fee={ this.state.fees/100 }
                                slippage={ this.state.slippage/100}
                                feeValues={ this.state.feeValues }
                                backtestParams={ this.props.backtestParams }
                                getStrategyWithId={ this.props.getStrategyWithId }
                                onSaveBotSuccess={ this.onSaveBotSuccess }/>
        }        
        { this.state.showChart && this.state.selectedGraph === "% returns" &&
         <BacktestGainsGraph   backtestResults={ this.props.backtestResults }
                               fees={ this.state.fees }
                               slippage={ this.state.slippage }
                               backtestParams={ this.props.backtestParams }
                               getStrategyWithId={ this.props.getStrategyWithId }
                               gainWeighted={ this.state.gainWeighted }/> 
        }
        { this.state.showChart && this.state.selectedGraph === "portfolio" &&
         <BacktestPortfolioPanel  header={ this.generateTestName(this.props.selectedTest) }
                                  backtestResults={ this.props.backtestResults }
                                  fee={ this.state.fees/100 }
                                  slippage={ this.state.slippage/100 }
                                  backtestParams={ this.props.backtestParams }
                                  getStrategyWithId={ this.props.getStrategyWithId }/> 
        }
        <br/>
        <br/>
        <br/>
        { empties === 1 && 
          <h3 className="text-secondary text-center"> 
            *One of your tests performed no trades during this period and has been omitted from the results.
          </h3> 
        }
        { empties > 1 && 
          <h3 className="text-secondary text-center"> 
            *{this.getEmptyTests(this.props.backtestResults)} of your tests performed no trades during this period, and have been omitted from the results.
          </h3> 
        }
        {
          this.props.backtestResults && 
          this.props.backtestResults.failCount > 0 &&
          <h3 className="text-danger">
            It appears that one or more of your tests failed to process as expected, this issue has
            been reported in our logs.
          </h3>
        }
        <br/><br/><br/>
      </div>
    );
  }
}

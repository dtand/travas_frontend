import React from "react";
import TabMenu from "../platform/tab_menu";
import ApiController from "../../js/ApiController"
import BotManager from "./bot_manager"
import BotCreatorTab from "./bot_creator_tab"
import BotMarketTab from "./bot_market_tab";
import ModalController from "../../js/ModalController"
import NotificationController from "../../js/NotificationController"
import UserData from "../../js/UserData"

export default class BotsService extends React.Component {

  constructor(props){
    super(props);
    this.state={
      loading: true,
      quotes: undefined,
      exchangeCount: 0,
      userStrategies: undefined,
      userBots: undefined,
      leaderboardGroup: "global",
      botLeaderboardsDaily: undefined,
      botLeaderboardsWeekly: undefined,
      botLeaderboardsAlltime: undefined,
      botLeaderboardsMonthly: undefined,
      currentTab: 0,
      loadingMessage: "Fetching Bots...",
      filter: "alltime",
      showModal: false,
      page: 0,
      paging: 4
    }

    const self = this;
    this.updateTab              = this.updateTab.bind(this);
    this.onGetBotLeaderboardsAlltimeSuccess = this.onGetBotLeaderboardsAlltimeSuccess.bind(this);
    this.onGetBotLeaderboardsWeeklySuccess = this.onGetBotLeaderboardsWeeklySuccess.bind(this);
    this.onGetBotLeaderboardsDailySuccess = this.onGetBotLeaderboardsDailySuccess.bind(this);
    this.onGetBotLeaderboardsMonthlySuccess = this.onGetBotLeaderboardsMonthlySuccess.bind(this);
    this.getStrategyWithId = this.getStrategyWithId.bind(this);
    this.getBotWithId = this.getBotWithId.bind(this);
    this.watchBot = this.watchBot.bind(this);
    this.onWatchBotSuccess = this.onWatchBotSuccess.bind(this);
    this.removeBotFromWatchList = this.removeBotFromWatchList.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.addStrategy  = this.addStrategy.bind(this);

    this.updateBot={
      
      deleteBot(id){
        const index = self.getBotWithId(id);
        if(index != undefined){
          this.props.removeBot(index);
        }
      },
   
      setRunning(id,value){
        const index = self.getBotWithId(id);
        if(index != undefined){
          let bot = self.props.userBots[index];
          bot.running = value;
          this.props.updateBot(index,bot);
        }
      },

      setIsSimulated(id,value){
        const index = self.getBotWithId(id);
        if(index != undefined){
          let bot = self.props.userBots[index];
          bot.isSimulated = value;
          this.props.updateBot(index,bot);
        }
      },

      setPrivacy(id,value){
        const index = self.getBotWithId(id);
        if(index != undefined){
          let bot = self.props.userBots[index];
          bot.public = value;
          this.props.updateBot(index,bot);
        }
      },

      changeName(id,value){
        const index = self.getBotWithId(id);
        if(index != undefined){
          let bot = self.props.userBots[index];
          bot.name = value;
          this.props.updateBot(index,bot);
        }
      }
    }


    this.updateBot.deleteBot = this.updateBot.deleteBot.bind(this);
    this.updateBot.setRunning = this.updateBot.setRunning.bind(this);
    this.updateBot.setIsSimulated = this.updateBot.setIsSimulated.bind(this);
    this.updateBot.setPrivacy = this.updateBot.setPrivacy.bind(this);
    this.updateBot.changeName = this.updateBot.changeName.bind(this);
    this.onBidBot = this.onBidBot.bind(this);
    this.updateBotName = this.updateBotName.bind(this);

 
    ModalController.setData("bidBotModal",{
      callback: self.onBidBot
    });
  }

  onBidBot(){
    const self  = this;
    const data  = ModalController.getData("bidBotModal");
    const offer = document.getElementById("bidInput").value;
    if(isNaN(offer) || offer == ""){
      NotificationController.displayNotification(
        "INVALID OFFER",
        "Offer value must be a valid integer",
        "error"
      );
      return;
    }
    else if(Number(offer) > this.props.userInfo.availableBalance){
      NotificationController.displayNotification(
        "INSUFFICIENT FUNDS",
        "Offer must be less than current available funds",
        "error"
      );
      return;
    }
    else{
      if(this.props.userInfo.username === data.bot.username){
        NotificationController.displayNotification(
          "ERROR",
          "Cannot bid on your own bot",
          "error"
        );
        return;
      }

      const payload={
        "botOwner": data.bot.username,
        "botId":  data.bot.botId,
        "bid": offer
      };
      ModalController.hideModal("bidBotModal");
      ApiController.doPostWithToken(
        "bot_market_bid", 
        payload, 
        function(response,offer){
          self.props.updateAfterBid(offer);
          ModalController.getData("bidBotModal").onBidBotSuccess(response,offer);
        },
        offer);
    }
    
  }

  getStrategyWithId(id){
    for(let s=0;s<this.props.userStrategies.length;s++){
      const strategy = this.props.userStrategies[s];
      if(strategy.id === id){
        return strategy;
      }
    }
    return undefined;
  }

  getBotWithId(id){
    for(let b=0;b<this.props.userBots.length;b++){
      if(this.props.userBots[b].id === id){
        return b;
      }
    }
    return undefined;
  }

  addStrategy(strategy){
    this.props.userStrategies.push(strategy);
    this.setState({
      userStrategies: this.props.userStrategies
    });
  }

  updatePage(movement){
    let leaderboard = undefined;
    this.setState({
      paging: 0
    });
    if(this.state.filter.toLowerCase() === "alltime" || 
       this.state.filter.toLowerCase() === "all time"){
      leaderboard = this.state.botLeaderboardsAlltime;
    }
    if(this.state.filter.toLowerCase() === "weekly"){
      leaderboard = this.state.botLeaderboardsWeekly;
    }
    if(this.state.filter.toLowerCase() === "daily"){
      leaderboard = this.state.botLeaderboardsDaily;
    }
    if(this.state.filter.toLowerCase() === "monthly"){
      leaderboard = this.state.botLeaderboardsMonthly;
    }

    if(movement === -1 && this.state.page === 0){
      return;
    }
    else if(movement === 1 && leaderboard.length % 100 != 0){
      return;
    }
    else{
      this.state.page += movement;
      if(this.state.leaderboardGroup === "global"){
        ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "alltime"}, this.onGetBotLeaderboardsAlltimeSuccess);
        ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "weekly"}, this.onGetBotLeaderboardsWeeklySuccess);
        ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "daily"}, this.onGetBotLeaderboardsDailySuccess);
        ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "monthly"}, this.onGetBotLeaderboardsMonthlySuccess);
      }
      else{
        ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "alltime", "group": this.state.leaderboardGroup}, this.onGetBotLeaderboardsAlltimeSuccess);
        ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "weekly", "group": this.state.leaderboardGroup}, this.onGetBotLeaderboardsWeeklySuccess);
        ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "daily", "group": this.state.leaderboardGroup}, this.onGetBotLeaderboardsDailySuccess);
        ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "monthly", "group": this.state.leaderboardGroup}, this.onGetBotLeaderboardsMonthlySuccess);     
      }
    }
  }

  setFilter(filter){
    this.state.filter = filter;
  }

  updateGroup(group){
    
    if(group === this.state.leaderboardGroup){
      return;
    }
    else{
      this.state.leaderboardGroup = group
    }

    /**
     * Grab all leaderboards simulated & non-simulated
     */
    if(group.toLowerCase() === "global"){
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "alltime"}, this.onGetBotLeaderboardsAlltimeSuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "weekly"}, this.onGetBotLeaderboardsWeeklySuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "daily"}, this.onGetBotLeaderboardsDailySuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "monthly"}, this.onGetBotLeaderboardsMonthlySuccess);
    }

    /**
     * Grab global and only funded bots
     */
    else if(group.toLowerCase() === "funded bots only"){
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "alltime","fundedBots":true}, this.onGetBotLeaderboardsAlltimeSuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "weekly","fundedBots":true}, this.onGetBotLeaderboardsWeeklySuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "daily","fundedBots":true}, this.onGetBotLeaderboardsDailySuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "monthly","fundedBots":true}, this.onGetBotLeaderboardsMonthlySuccess);
    }

    /**
     * Grab bots by group
     */
    else{
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "alltime", "group": group}, this.onGetBotLeaderboardsAlltimeSuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "weekly", "group": group}, this.onGetBotLeaderboardsWeeklySuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "daily", "group": group}, this.onGetBotLeaderboardsDailySuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "monthly", "group": group}, this.onGetBotLeaderboardsMonthlySuccess);     
    }
  }

  async onGetBotLeaderboardsAlltimeSuccess(response){
    this.state.botLeaderboardsAlltime = response.bots;
    this.setState({
      update: true,
      paging: this.state.paging + 1
    });
  }

  async onGetBotLeaderboardsWeeklySuccess(response){
    this.state.botLeaderboardsWeekly = response.bots;
    this.setState({
      update: true,
      paging: this.state.paging + 1
    });
  }

  async onGetBotLeaderboardsDailySuccess(response){
    this.state.botLeaderboardsDaily = response.bots;
    this.setState({
      update: true,
      paging: this.state.paging + 1
    });
  }

  async onGetBotLeaderboardsMonthlySuccess(response){
    this.state.botLeaderboardsMonthly = response.bots;
    this.setState({
      update: true,
      paging: this.state.paging + 1
    });
  }

  removeBotFromWatchList(botId){
    for(let b=0; b<this.props.watchList.length;b++){
      const bot = this.props.watchList[b].alltime;
      if(bot.botId == botId){
        this.props.removeFromWatchList(b);
      }
    }
  }
  
  async onWatchBotSuccess(response,request){
    if(request.track){
      this.props.appendWatchList({
        "alltime": response.alltime,
        "weekly": response.weekly,
        "daily": response.daily,
        "monthly": response.monthly
      });
    }
    else{
      this.removeBotFromWatchList(request.bot.botId);
    }
    NotificationController.displayNotification(
      "BOT TRACKING CHANGED",
      request.track ? 
        request.bot.botName + " has been added to your watch list" :
        request.bot.botName + " has been removed from your watch list",
      "info"
    );
  }

  watchBot(bot,bot_id,track){
    ApiController.doPostWithToken("track_bot",{
      "botId": bot_id,
      "track": track
    },
    this.onWatchBotSuccess,{
      "bot": bot,
      "track": track
    });
  }

  updateBotName(id,name){
    for(let b=0;b<this.props.userBots.length;b++){
      if(this.props.userBots[b].id === id){
        let bot = this.props.userBots[b];
        bot.name = name;
        this.props.updateBot(b,bot);
      }
    }
  }

  /**
   * Grab parallel list of market volume
   * by bot
   */
  getMarketVolumesByBot(){

    let volumes = [];

    //Iterate bot
    for(let b=0;b<this.props.userBots.length;b++){

      //Grab bot and markets associated with bot's exchange
      const bot     = this.props.userBots[b];
      const markets = this.props.markets.get(bot.exchange.toLowerCase());
      const base    = bot.market.split("-")[0];
      const quote   = bot.market.split("-")[1];

      //Will need to remove this at some point...
      if(!markets){
        return [0,0,0,0,0,0,0,0,0,0];
      }

      //Iterate markets
      for(let m=0;m<markets.length;m++){
        const market = markets[m];
        
        //Found market
        if(market.base.toLowerCase() === base && 
           market.quote.toLowerCase() === quote){
          volumes.push(market.volume);
        }
      }
    }

    return volumes;
  }

  getTab(){

    if(this.state.currentTab === 0 && this.props.userBots.length > 0) {
      return <BotManager userBots={ this.props.userBots }
                         botTemplates={ this.props.botTemplates }
                         updateBot={ this.updateBot }
                         appendBotTemplate={ this.props.appendBotTemplate }
                         volumes={ this.getMarketVolumesByBot() }
                         linkedExchanges={ this.props.linkedExchanges }/>
    }
    else if(this.state.currentTab === 0 && this.props.userBots.length === 0){
      return <div className="container">
                <br/><br/><br/><br/>
                <strong>
                  <h1 className="text-secondary text-center"> You currently have no bots.
                  </h1>
                  <br/>
                  <h1 className="text-secondary text-center">
                    Click on the <span className="clickable text-primary" onClick={ () => this.updateTab(1) }> Factory Tab </span> above to build one!
                  </h1>
                </strong>
             </div>
    }
    else if(this.state.currentTab === 1){
      return  <BotCreatorTab botTemplates={ this.props.botTemplates }
                             addStrategy={ this.addStrategy } 
                             userStrategies={ this.props.userStrategies }
                             markets={ this.props.markets }
                             quotes={ this.props.quotes }
                             appendBot={ this.props.appendBot }
                             getStrategyWithId={ this.getStrategyWithId }
                             selectService={ this.props.selectService }
                             userInfo={ this.props.userInfo }
                             linkedExchanges={ this.props.linkedExchanges }/>
    }
    else if(this.state.currentTab === 2){
      return <BotMarketTab userInfo={ this.props.userInfo }
                           groups={ this.props.userInfo.groups }
                           daily={ this.state.botLeaderboardsDaily }
                           weekly={ this.state.botLeaderboardsWeekly }
                           alltime={ this.state.botLeaderboardsAlltime }
                           monthly={ this.state.botLeaderboardsMonthly }
                           watchList={ this.props.watchList }
                           bids={ this.props.bidOffers.bids }
                           offers={ this.props.bidOffers.offers }
                           removeBid={ this.props.removeBid }
                           removeOffer={ this.props.removeOffer }
                           watchBot={ this.watchBot }
                           updateGroup={ this.updateGroup }
                           updatePage={ this.updatePage }
                           setFilter={ this.setFilter }
                           page={ this.state.page }
                           pagesLoaded={ this.state.paging }/>
    }
  }

  updateTab(newTab){
     this.setState({
       currentTab: newTab,
     });
  }

  buildQuotesList(markets){
    let quotes = []
    let set    = new Set();
    for( let q=0; q<markets.length;q++){
      if(set.has(markets[q].quote)){
        continue;
      }
      else{
        set.add(markets[q].quote);
        quotes.push(markets[q].quote);
      }
    }
    return quotes;
  }

  componentDidMount(){
    ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "alltime"}, this.onGetBotLeaderboardsAlltimeSuccess);
    ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "weekly"}, this.onGetBotLeaderboardsWeeklySuccess);
    ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "daily"}, this.onGetBotLeaderboardsDailySuccess);
    ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "monthly"}, this.onGetBotLeaderboardsMonthlySuccess);
    const self = this;
    ApiController.doPostWithToken("get_market_bids",{
      "buyer": UserData.username,
      "seller": UserData.username
    },
    function(response){
      self.setState({
        offers: response.offers,
        bids: response.bids
      });
    });
  }

  render() {
    const self = this;
    return (
      <div>
      <TabMenu updateTab={ this.updateTab }
               currentTab={ this.state.currentTab } 
               tabs={ [
        { 
          name: "MY BOTS"
        },
        {
          name: "FACTORY"
        },
        { 
          name: "MARKET"
        } ] }/>
      <div class="tab-content">
        { 
          this.getTab()
        }
      </div>
    </div>
    );
  }
}


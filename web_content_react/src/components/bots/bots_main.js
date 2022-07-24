import React from "react";
import TabMenu from "../platform/tab_menu";
import PlatformTemplate from "../platform/platform_template";
import BacktestSettingsTab from "./backtest_settings_tab";
import ApiController from "../../js/ApiController"
import Constants from "../../js/Constants"
import BacktestResultsTab from "./backtest_results_tab";
import Loader from "../generic/loader";
import BotManager from "./bot_manager"
import BotCreatorTab from "./bot_creator_tab"
import BotMarketTab from "./bot_market_tab";
import ModalController from "../../js/ModalController"
import ShareModalBody from "../modals/share_modal_body"
import MakeBetModalBody from "../make_bet_modal_body"
import ShowBidsModalBody from "../modals/show_bids_modal_body"
import ShowOffersModalBody from "../modals/show_offers_modal_body"
import ChangeBotNameModalBody from "../modals/change_bot_name_modal_body"
import Modal from "../modal"
import DeleteBotModalBody from "../modals/delete_bot_modal_body"
import NotificationController from "../../js/NotificationController"
import UserData from "../../js/UserData"

const MODAL_ID_DELETE           = "deleteBotModal";
const MODAL_ID_SHARE            = "shareBotModal";
const MODAL_ID_BID              = "bidBotModal";
const MODAL_ID_SHOW_BIDS        = "showBidsModal";
const MODAL_ID_SHOW_OFFERS      = "showOffersModal";
const MODAL_ID_CHANGE_BOT_NAME  = "changeBotNameModal";

export default class BotsMain extends React.Component {

  constructor(props){
    super(props);
    this.state={
      loading: true,
      markets: new Map(),
      quotes: new Map(),
      exchangeCount: 0,
      userStrategies: undefined,
      userBots: undefined,
      leaderboardGroup: "global",
      botLeaderboardsDaily: undefined,
      botLeaderboardsWeekly: undefined,
      botLeaderboardsAlltime: undefined,
      botLeaderboardsMonthly: undefined,
      watchedBots: [],
      currentTab: 0,
      loadingMessage: "Fetching Bots...",
      filter: "alltime",
      showModal: false,
      page: 0
    }

    const self = this;
    this.onGetBotsSuccess       = this.onGetBotsSuccess.bind(this);
    this.onGetStrategiesSuccess = this.onGetStrategiesSuccess.bind(this);
    this.updateTab              = this.updateTab.bind(this);
    this.onGetMarketsSuccess    = this.onGetMarketsSuccess.bind(this);
    this.onGetBotLeaderboardsAlltimeSuccess = this.onGetBotLeaderboardsAlltimeSuccess.bind(this);
    this.onGetBotLeaderboardsWeeklySuccess = this.onGetBotLeaderboardsWeeklySuccess.bind(this);
    this.onGetBotLeaderboardsDailySuccess = this.onGetBotLeaderboardsDailySuccess.bind(this);
    this.onGetBotLeaderboardsMonthlySuccess = this.onGetBotLeaderboardsMonthlySuccess.bind(this);
    this.getStrategyWithId = this.getStrategyWithId.bind(this);
    this.appendBot = this.appendBot.bind(this);
    this.getBotWithId = this.getBotWithId.bind(this);
    this.watchBot = this.watchBot.bind(this);
    this.onWatchBotSuccess = this.onWatchBotSuccess.bind(this);
    this.removeBotFromWatchList = this.removeBotFromWatchList.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.onDeleteBotSuccess = this.onDeleteBotSuccess.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.addStrategy  = this.addStrategy.bind(this);
    this.updateBot={
      
      deleteBot(id){
        const index = self.getBotWithId(id);
        if(index != undefined){
          self.state.userBots.splice(index,1);
        }
        self.setState({
          userBots: self.state.userBots
        });
      },

      setRunning(id,value){
        const index = self.getBotWithId(id);
        if(index != undefined){
          self.state.userBots[index].running = value;
        }
        self.setState({
          userBots: self.state.userBots
        });
      },

      setIsSimulated(id,value){
        const index = self.getBotWithId(id);
        if(index != undefined){
          self.state.userBots[index].isSimulated = value;
        }
        self.setState({
          userBots: self.state.userBots
        });
      },

      setPrivacy(id,value){
        const index = self.getBotWithId(id);
        if(index != undefined){
          self.state.userBots[index].public = value;
        }
        self.setState({
          userBots: self.state.userBots
        });
      }
    }

    this.updateBot.deleteBot = this.updateBot.deleteBot.bind(this);
    this.updateBot.setRunning = this.updateBot.setRunning.bind(this);
    this.updateBot.setIsSimulated = this.updateBot.setIsSimulated.bind(this);
    this.updateBot.setPrivacy = this.updateBot.setPrivacy.bind(this);
    this.onShareBot = this.onShareBot.bind(this);
    this.onShareBotSuccess = this.onShareBotSuccess.bind(this);
    this.onBidBot = this.onBidBot.bind(this);
    this.updateBotName = this.updateBotName.bind(this);
    ModalController.registerModal(MODAL_ID_DELETE, self);
    ModalController.registerModal(MODAL_ID_SHARE, self);
    ModalController.registerModal(MODAL_ID_BID, self);
    ModalController.registerModal(MODAL_ID_SHOW_BIDS, self);
    ModalController.registerModal(MODAL_ID_SHOW_OFFERS, self);
    ModalController.registerModal(MODAL_ID_CHANGE_BOT_NAME, self);
  }

  onShareBotSuccess(response,params){
    NotificationController.displayNotification(
      "BOT SHARED",
      params.botName + " has been shared with group member: " + params.toUser,
      "info"
    );
    ModalController.hideModal("shareBotModal");
  }

  onBidBot(bot,offer){

    if(UserData.username === bot.username){
      NotificationController.displayNotification(
        "ERROR",
        "Cannot bid on your own bot",
        "error"
      );
      return;
    }

    const payload={
      "botOwner": bot.username,
      "botId":  bot.botId,
      "bid": offer
    };

    ApiController.doPostWithToken(
      "bot_market_bid", 
      payload, 
      ModalController.getData(MODAL_ID_BID).onBidBotSuccess,
      offer);
  }

  onShareBot(modalData){
    if(!modalData.toUser || modalData.toUser === ""){
      NotificationController.displayNotification(
        "NO USER SELECTED",
        "You must select a user you would like to share this bot with",
        "error"
      );
      return;
    }
    const payload = {
      "toUser": modalData.toUser,
      "item": "bot",
      "key": modalData.botId
    }
    ApiController.doPostWithToken("share_item", payload, this.onShareBotSuccess, modalData);
  }

  getStrategyWithId(id){
    for(let s=0;s<this.state.userStrategies.length;s++){
      const strategy = this.state.userStrategies[s];
      if(strategy.id === id){
        return strategy;
      }
    }
    return undefined;
  }

  addStrategy(strategy){
    this.state.userStrategies.push(strategy);
    this.setState({
      userStrategies: this.state.userStrategies
    });
  }

  updatePage(movement){
    let leaderboard = undefined;

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
    if(group === "global"){
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "alltime"}, this.onGetBotLeaderboardsAlltimeSuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "weekly"}, this.onGetBotLeaderboardsWeeklySuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "daily"}, this.onGetBotLeaderboardsDailySuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "monthly"}, this.onGetBotLeaderboardsMonthlySuccess);
    }
    else{
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "alltime", "group": group}, this.onGetBotLeaderboardsAlltimeSuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "weekly", "group": group}, this.onGetBotLeaderboardsWeeklySuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "daily", "group": group}, this.onGetBotLeaderboardsDailySuccess);
      ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "monthly", "group": group}, this.onGetBotLeaderboardsMonthlySuccess);     
    }
  }


  async onDeleteBotSuccess(response,payload){
    NotificationController.displayNotification(
      "SAY BYE!",
      payload.botName + " has been removed from your bot manager",
      "info"
    );
    this.updateBot.deleteBot(payload.botId);
    ModalController.hideModal(MODAL_ID_DELETE);
  }
  async onGetStrategiesSuccess(response){
    this.state.userStrategies = response.strategies;
    this.checkInit();
  }

  async onGetBotsSuccess(response){
    this.state.userBots    = response.botSummaries;
    this.state.watchedBots = response.watchList;
    this.checkInit();
  }

  async onGetBotLeaderboardsAlltimeSuccess(response){
    this.state.botLeaderboardsAlltime = response.bots;
    this.checkInit();
  }

  async onGetBotLeaderboardsWeeklySuccess(response){
    this.state.botLeaderboardsWeekly = response.bots;
    this.checkInit();
  }

  async onGetBotLeaderboardsDailySuccess(response){
    this.state.botLeaderboardsDaily = response.bots;
    this.checkInit();
  }

  async onGetBotLeaderboardsMonthlySuccess(response){
    this.state.botLeaderboardsMonthly = response.bots;
    this.checkInit();
  }

  async onGetMarketsSuccess(response,exchange){
    this.state.markets.set(exchange,response.markets);
    this.state.exchangeCount++;
    let quotes = [];
    for(let m=0; m<response.markets.length;m++){
      const quote = response.markets[m].quote;
      if(quotes.indexOf(quote) === -1){
        quotes.push(quote);
      }
    }
    this.state.quotes.set(exchange,quotes);
    this.checkInit();
  }

  async appendBot(bot){
    this.state.userBots.push(bot);
    this.setState({
      userBots: this.state.userBots
    });
  }

  removeBotFromWatchList(botId){
    for(let b=0; b<this.state.watchedBots.length;b++){
      const bot = this.state.watchedBots[b].alltime;
      if(bot.botId == botId){
        if(this.state.watchedBots.length === 1){
          this.state.watchedBots = []
        }
        else{
          this.state.watchedBots.splice(1,b);
        }
      }
    }
    this.setState({
      watchedBots: this.state.watchedBots
    });
  }
  
  async onWatchBotSuccess(response,request){
    if(request.track){
      this.state.watchedBots.push({
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
    this.setState({
      watchedBots: this.state.watchedBots
    });
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

  getBotWithId(id){
    for(let b=0;b<this.state.userBots.length;b++){
      if(this.state.userBots[b].id === id){
        return b;
      }
    }
    return undefined;
  }

  updateBotName(id,name){
    for(let b=0;b<this.state.userBots.length;b++){
      if(this.state.userBots[b].id === id){
        this.state.userBots[b].name = name;
        this.setState({
          update: true
        });
      }
    }
    return undefined;
  }

  checkInit(){
    if( this.state.exchangeCount === Constants.SUPPORTED_EXCHANGES.length &&
        this.state.userStrategies != undefined && 
        this.state.userBots != undefined ) {
          this.setState({
            loading: false
          }); 
      }
  }

  getTab(){

    if(this.state.currentTab === 0 && this.state.userBots.length > 0) {
      return <BotManager userBots={ this.state.userBots }
                         updateBot={ this.updateBot }/>
    }
    else if(this.state.currentTab === 0 && this.state.userBots.length === 0){
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
      return  <BotCreatorTab addStrategy={ this.addStrategy } 
                             userStrategies={ this.state.userStrategies }
                              markets={ this.state.markets }
                              quotes={ this.state.quotes }
                              appendBot={ this.appendBot }
                              getStrategyWithId={ this.getStrategyWithId }/>
    }
    else if(this.state.currentTab === 2){
      return <BotMarketTab daily={ this.state.botLeaderboardsDaily }
                           weekly={ this.state.botLeaderboardsWeekly }
                           alltime={ this.state.botLeaderboardsAlltime }
                           monthly={ this.state.botLeaderboardsMonthly }
                           watchList={ this.state.watchedBots }
                           watchBot={ this.watchBot }
                           updateGroup={ this.updateGroup }
                           updatePage={ this.updatePage }
                           setFilter={ this.setFilter }
                           page={ this.state.page }/>
    }
  }

  getModal(self){

    let id        = undefined;
    let titleId   = undefined;
    let title     = undefined;
    let modalBody = undefined;
    let noSubmission = false;

    if(this.state.modal === "deleteBotModal"){
      id        = MODAL_ID_DELETE;
      titleId   = "deleteBotModalTitle";
      title     = "Confirm Delete Bot";
      modalBody = <DeleteBotModalBody onSubmit={ function(){
            const botToDelete = ModalController.getData(MODAL_ID_DELETE);
            const payload = {
              botId: botToDelete.botId
            }
            const input = document.getElementById("botNameInput").value;
            if(input.toUpperCase() != botToDelete.botName.toUpperCase()){
              NotificationController.displayNotification(
                "INCORRECT NAME",
                "Provided name does not match name of bot to delete",
                "error"
              );
              return;
            }
            ApiController.doPostWithToken("delete_bot",
            payload,
            self.onDeleteBotSuccess,
            {
              "botId": payload.botId,
              "botName": botToDelete.botName
            });
          }}/>
    }
    else if(this.state.modal === "shareBotModal"){
      const data = ModalController.getData(MODAL_ID_SHARE);
      id        = MODAL_ID_SHARE;
      titleId   = "shareBotModalTitle";
      title     = data.botName.length <= 16 ? 
                  "Share Bot " + data.botName :
                  <span className="text-left">Share Bot <br/> 
                    { data.botName }
                  </span>
      modalBody = <ShareModalBody parentId={ MODAL_ID_SHARE }
                                  onSubmit={ function(){
                                    self.onShareBot(data);
                                  }}/>
    }
    else if(this.state.modal === "bidBotModal"){
      const data = ModalController.getData(MODAL_ID_BID);
      id        = MODAL_ID_BID;
      titleId   = "bidBotModalTitle";
      title     = "Submit Offer"
      modalBody = <MakeBetModalBody parentId={ MODAL_ID_BID }
                                  onSubmit={ function(){
                                    const offer = document.getElementById("bidInput").value;
                                    if(isNaN(offer) || offer == ""){
                                      NotificationController.displayNotification(
                                        "INVALID OFFER",
                                        "Offer value must be a valid integer",
                                        "error"
                                      );
                                      return;
                                    }
                                    else if(Number(offer) > UserData.availableBalance){
                                      NotificationController.displayNotification(
                                        "INSUFFICIENT FUNDS",
                                        "Offer must be less than current available funds",
                                        "error"
                                      );
                                      return;
                                    }
                                    else{
                                      self.onBidBot(data.bot, offer);
                                    }
                                  }}/>
    }
    else if(this.state.modal === "showBidsModal"){
      id        = MODAL_ID_SHOW_BIDS;
      titleId   = "showBidsModalTitle";
      title     = "Current Bids"
      noSubmission = true;
      modalBody = <ShowBidsModalBody parentId={ MODAL_ID_SHOW_BIDS }/>
    }
    else if(this.state.modal === "showOffersModal"){
      id        = MODAL_ID_SHOW_OFFERS;
      titleId   = "showOffersModalTitle";
      title     = "Active Offers"
      noSubmission = true;
      modalBody = <ShowOffersModalBody parentId={ MODAL_ID_SHOW_OFFERS }/>
    }
    else if(this.state.modal === "changeBotNameModal"){
      id        = MODAL_ID_CHANGE_BOT_NAME;
      titleId   = "changeBotNameModalTitle";
      title     = "Update Bot Name"
      modalBody = <ChangeBotNameModalBody parentId={ MODAL_ID_CHANGE_BOT_NAME }
                    onSubmit={ 
                      function(){
                        const botName = document.getElementById("botNameInput").value;
                        const botId   = ModalController.getData(MODAL_ID_CHANGE_BOT_NAME).botId;
                        const payload = {
                          "botName": botName,
                          "botId": botId
                        }
                        ApiController.doPostWithToken(
                          "update_bot",
                          payload,
                          function(){
                            NotificationController.displayNotification(
                              "BOT NAME CHANGED",
                              "Bot's name has now been changed to " + botName,
                              "info"
                            );
                            self.updateBotName(botId,botName);
                          }
                        )
                      }
                    }/>
    }

    return <Modal modalId={ id }
            titleId={ titleId }
            title={ title }
            modalBody={ modalBody }
            noSubmission={ noSubmission }/>
  }

  updateTab(newTab){
     this.setState({
       currentTab: newTab,
     });
  }

  componentDidMount(){
    ApiController.doPostWithToken("get_strategies",{},this.onGetStrategiesSuccess);
    ApiController.doPostWithToken("bot_summary",{},this.onGetBotsSuccess);
    ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "alltime"}, this.onGetBotLeaderboardsAlltimeSuccess);
    ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "weekly"}, this.onGetBotLeaderboardsWeeklySuccess);
    ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "daily"}, this.onGetBotLeaderboardsDailySuccess);
    ApiController.doPostWithToken("bot_leaderboards", {"start": this.state.page, "numberToFetch":100,"leaderboard": "monthly"}, this.onGetBotLeaderboardsMonthlySuccess);
    for(let e=0;e<Constants.SUPPORTED_EXCHANGES.length;e++){
      const payload = {
        "exchange": Constants.SUPPORTED_EXCHANGES[e]
      };
      ApiController.doPostWithToken("market_lookup",payload,this.onGetMarketsSuccess,Constants.SUPPORTED_EXCHANGES[e]);
    }
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
      <PlatformTemplate title="Analytics"
                        subtitle="Backtest"
                        serviceComponent={ 
        <div>
          <TabMenu updateTab={ this.updateTab }
                   currentTab={ this.state.currentTab } 
                   tabs={ [
            { 
              name: "MANAGER"
            },
            {
              name: "FACTORY"
            },
            { 
              name: "MARKET"
            } ] }/>
          <div class="tab-content">
            { this.state && 
              !this.state.loading &&
              this.getTab()
            }
            {
              this.state &&
              this.state.loading &&
              <Loader loadingMessage={ this.state.loadingMessage }/>
            }
          </div>
        </div>
      } /> 
      { ModalController.modals[MODAL_ID_DELETE] &&
        this.state.showModal &&
        this.getModal(self)}
      </div>
    );
  }
}


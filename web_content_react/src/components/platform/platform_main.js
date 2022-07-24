import React from "react";

import GlobalStateController from "../../js/GlobalStateController";
import NotificationController from "../../js/NotificationController";
import ModalController from "../../js/ModalController";

import ApiController from "../../js/ApiController";
import PlatformTemplate from "./platform_template";
import Constants from "../../js/Constants";

import ModalFactory from "../modals/modal_factory";
import DashboardService from "../dashboard/dashboard_service";
import StrategiesService from "../strategies/strategies_service";
import BotsService from "../bots/bots_service";
import BacktestService from "../backtest/backtest_service";
import ExchangesService from "../exchanges/exchanges_service";
import GroupsService from "../groups/groups_service";
import SettingsService from "../settings/settings_service";
import Loader from "../generic/loader";

let NotificationSystem = require('react-notification-system');

/**
 * Style specification for loading icon for services
 */
const GLOBAL_LOADER = {
  marginTop: window.innerHeight / 2.25
}

/**
 * Style specification for global loader at entry
 */
const GLOBAL_LOADER_WHITE = {
  marginTop: window.innerHeight / 2.1,
  color: "white"
}

/**
 * Inner style to pull loader to front
 */
const LOADING_PROFILE = {
  position: "absolute",
  zIndex: "9999",
  width: "100%"
}

/**
 * Main entry point platform set of application
 */
export default class PlatformMain extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      service: "Dashboard",        /** Current service filling main content */
      userInfo: undefined,         /** api/user_profile */
      userProfileInfo: undefined,  /** api/user_info */
      botSummary: undefined,       /** api/bot_summary */
      userStrategies: undefined,   /** api/get_strategies */
      userDashboard: undefined,    /** api/user_dashboard */
      markets: undefined,          /** api/market_lookup */
      inHouseSignals: undefined,   /** api/get_signals */
      botTemplates: undefined,     /** api/get_buffered_bots */
      bidOffers: undefined,        /** api/get_market_bids */
      sharedItems: undefined,      /** api/get_shared_items */
      backtestArchives: undefined, /** api/backtest_archives */
      exchangeWallets: new Map()   /** api/exchange_account_info */
    }

    //Statics
    this.markets            = new Map();
    this.numExchanges       = 0;
    this.notificationSystem = null;
    this.selectService      = this.selectService.bind(this);
    GlobalStateController.addState("platformToggled");

    //Alter dashboard/tickers callbacks
    this.updateTicker = this.updateTicker.bind(this);
    this.updateTickerSuccess = this.updateTickerSuccess.bind(this);

    //Alter strategy callbacks
    this.saveStrategy = this.saveStrategy.bind(this);
    this.saveStrategySuccess = this.saveStrategySuccess.bind(this);
    this.deleteStrategy = this.deleteStrategy.bind(this);
    this.deleteStrategySuccess = this.deleteStrategySuccess.bind(this);
    this.appendStrategy = this.appendStrategy.bind(this);

    //Alter bot summary callbacks
    this.appendBot      = this.appendBot.bind(this);
    this.updateBot      = this.updateBot.bind(this);
    this.removeBot      = this.removeBot.bind(this);
    this.appendWatchList = this.appendWatchList.bind(this);
    this.removeFromWatchList = this.removeFromWatchList.bind(this);
    this.appendBotTemplate = this.appendBotTemplate.bind(this);

    //Marketplace callbacks
    this.updateAfterBid = this.updateAfterBid.bind(this);
    this.removeBid      = this.removeBid.bind(this);
    this.removeOffer    = this.removeOffer.bind(this);

    //Backtest Callbacks
    this.appendArchive = this.appendArchive.bind(this);

    //Groups Callbacks
    this.removeSharedItem  = this.removeSharedItem.bind(this);
    this.updateSharedItems = this.updateSharedItems.bind(this);
    this.updateGroup       = this.updateGroup.bind(this);
    this.appendGroup       = this.appendGroup.bind(this);
    this.removeGroup       = this.removeGroup.bind(this);
    this.removeGroupMember = this.removeGroupMember.bind(this);
    this.appendGroupMember = this.appendGroupMember.bind(this);
    this.updateGroupMember = this.updateGroupMember.bind(this);

    //Exchange key callbacks
    this.addExchangeKey    = this.addExchangeKey.bind(this);
    this.removeExchangeKey = this.removeExchangeKey.bind(this);

    //Update reference exchange info
    this.updateExchangeInfo = this.updateExchangeInfo.bind(this);
    this.getExchangeInfo    = this.getExchangeInfo.bind(this);

    //Beta consent callbacks
    this.updateConset = this.updateConsent.bind(this);

    //Register self with all modals
    ModalController.registerModal("selectMarketModal", this);
    ModalController.registerModal("saveStrategyModal", this);
    ModalController.registerModal("saveSignalModal", this);
    ModalController.registerModal("deleteStrategyModal", this);
    ModalController.registerModal("shareStrategyModal", this);
    ModalController.registerModal("deleteBotModal", this);
    ModalController.registerModal("shareBotModal", this);
    ModalController.registerModal("bidBotModal", this);
    ModalController.registerModal("showBidsModal", this);
    ModalController.registerModal("showOffersModal", this);
    ModalController.registerModal("changeBotNameModal", this);
    ModalController.registerModal("createGroupModal", this);
    ModalController.registerModal("deleteGroupModal", this);
    ModalController.registerModal("removeUserModal", this);
    ModalController.registerModal("promoteUserModal", this);
    ModalController.registerModal("mobileWarningModal", this);
    ModalController.registerModal("addExchangeKeysModal", this);
    ModalController.registerModal("removeExchangeKeysModal", this);
    ModalController.registerModal("betaConsentModal", this);
  }
  
  /**
   * Callback for toggling sidenav
   */
  toggleNav(){
    this.setState({
      toggled: !this.state.toggled
    });
    GlobalStateController.pingState("platformToggled",this.state.toggled);
  }

  /**
   * Calls endpoint to grab user profile information - on success,
   * calls all other endpoints to grab additional user information
   * @param {*} self 
   */
  async getUserProfile(self){

    //Present modal saying no mobile view available
    if(Constants.IS_MOBILE){
      ModalController.showModal("mobileWarningModal");
      return;
    }

    //Grab user profile
    ApiController.doPostWithToken(
      
      /** Endpoint */
      "user_profile",
      
      /** Empty parameters */           
      {},
      
      /** On Success */
      function(response){     
        
        //Set user information state
        self.setState({
          userInfo: response
        });

        //If user hasn't consented to terms, present this modal
        if(!response.betaConsent){

          //Show the beta consent form embedded in modal
          ModalController.showModal(
            "betaConsentModal",{
              accepted: false
            });
        }

        //Load dashboard
        if(self.state.userDashboard){

          //Only reset fade if modal isn't active
          if(!ModalController.activeModal){
            document.getElementById("page-top").style.opacity = 1.0;
            document.getElementById("page-top").style.backgroundColor = "white";
          }
        }

        //Grab user info
        self.getUserInfo(self);

        //Grab exchange wallet information
        for(let e=0;e<self.state.userInfo.linkedExchanges.length;e++){
          const exchange = self.state.userInfo.linkedExchanges[e].name;
          self.getExchangeInfo(exchange);
        }

        //Grab user dashboard info
        self.getUserDashboard(self);

        //Grab all supported markets
        self.getMarkets(self);

        //Grab user bot information
        self.getBotSummary(self);

        //Grab all user bot templates
        self.getBotTemplates(self);

        //Grab all user strategies
        self.getStrategies(self);

        //Get all current marketplace bids and offers
        self.getBidOffers(self,response.username);

        //Grab all archived backtests
        self.getBacktestArchives(self);

        //Grab all notifications - items shared with user
        self.getSharedItems(self);

        //Grab list of inhouse trading signals
        self.getInHouseSignals(self);
      }
    );
  }

  /**
   * Update group state ie. admin
   * @param {*} groupIndex 
   */
  async updateGroup(groupIndex,group){
    let userInfo = this.state.userInfo;
    userInfo.groups[groupIndex] = group;
    this.setState({
      userInfo: userInfo
    });   
  }

  /**
   * Call to remove group from groups list
   * @param {*} groupIndex 
   */
  async removeGroup(groupIndex){
    let userInfo = this.state.userInfo;
    userInfo.groups.splice(groupIndex,1);
    this.setState({
      userInfo: userInfo
    });   
  }

  /**
   * Call to add a group to the list
   * @param {*} groupIndex 
   */
  async appendGroup(group){
    let userInfo = this.state.userInfo;
    userInfo.groups.push(group);
    this.setState({
      userInfo: userInfo
    });   
  }

  /**
   * Updates a user in a group - premote or demote
   */
  async updateGroupMember(groupIndex,memberIndex,member){
    let userInfo = this.state.userInfo;
    userInfo.groups[groupIndex][memberIndex] = member;
    this.setState({
      userInfo: userInfo
    });
  }

  /**
   * Updates a user in a group - premote or demote
   */
  async updateGroupMember(groupIndex,memberIndex,member){
    let userInfo = this.state.userInfo;
    userInfo.groups[groupIndex][memberIndex] = member;
    this.setState({
      userInfo: userInfo
    });
  }

  /**
   * Remove a user from a group
   */
  async removeGroupMember(groupIndex,memberIndex){
    let userInfo = this.state.userInfo;
    userInfo.groups[groupIndex].members.splice(memberIndex,1);
    this.setState({
      userInfo: userInfo
    });
  }

  /**
   * Push user to group
   */
  async appendGroupMember(groupIndex,member){
    let userInfo = this.state.userInfo;
    userInfo.groups[groupIndex].push(member);
    this.setState({
      userInfo: userInfo
    });
  }

  /**
   * Calls endpoint to grab user profile information
   * for settings page
   * @param {*} self 
   */
  async getUserInfo(self){
    ApiController.doPostWithToken(
      "user_info",
      {
        user: this.state.userInfo.username
      },
      function(response){
        self.setState({
          userProfileInfo: response
        });
      }
    );
  }

  /**
   * Calls endpoint to grab user dashboard info
   * @param {*} self 
   */
  async getUserDashboard(self){
    ApiController.doPostWithToken(
      "user_dashboard",
      {},
      function(response){
        self.setState({
          userDashboard: response
        });
        if(self.state.userInfo){
          //Only reset fade if modal isn't active
          if(!ModalController.activeModal){
            document.getElementById("page-top").style.opacity = 1.0;
            document.getElementById("page-top").style.backgroundColor = "white";
          }
        }
      }
    );
  }

  /**
   * Called to update user dashboard tickers in app
   */
  async updateTicker(){
    const data = ModalController.getData("selectMarketModal");
    if(!data.base || !data.quote){
      NotificationController.displayNotification(
        "NO MARKET SELECTED",
        "Please select a market before continuing",
        "error"
      );
      return;
    }
    ModalController.hideModal("selectMarketModal");
    const payload = {
      tickerBox: data.graphId,
      ticker:{
        "exchange": data.exchange,
        "base": data.base,
        "quote": data.quote
      }
    }
    ApiController.doPostWithToken(
      "update_tickers",
      payload,
      this.updateTickerSuccess,
      payload
    );
  }

  /**
   * Called after tickers API completes
   * @param {*} response 
   * @param {*} params 
   */
  async updateTickerSuccess(response,params){
    let userDashboard = this.state.userDashboard;
    userDashboard.tickers[params.tickerBox-1] = params.ticker;
    this.setState({
      userDashboard: userDashboard,
      updateTicker: params.tickerBox
    });
  }

  /**
   * Calls API to get all of a users bots and watched bots
   * @param {*} self 
   */
  async getBotSummary(self){
    ApiController.doPostWithToken(
      "bot_summary",
      {},
      function(response){
        self.setState({
          botSummary: response
        });
      }
    );
  }

  /**
   * Called after a bot has updated its state
   */
  async updateBot(index,bot){
    this.state.botSummary.botSummaries[index] = bot;
    this.setState({
      botSummary: this.state.botSummary
    }); 
  }

  /**
   * Called after a bot has been saved
   */
  async appendBot(bot){
    this.state.botSummary.botSummaries.push(bot)
    this.setState({
      botSummary: this.state.botSummary
    }); 
  }

   /**
   * Called after a bot has been deleted
   */
  async removeBot(index){
    this.state.botSummary.botSummaries.splice(index,1);
    this.setState({
      botSummary: this.state.botSummary
    }); 
  }

  /**
   * Add a bot to current watched bots
   */
  async appendWatchList(bot){
    let botSummary = this.state.botSummary;
    botSummary.watchList.push(bot);
    this.setState({
      botSummary: botSummary
    });
  }

  /**
   * Removes a bot from watch list after unwatching in app
   * @param {*} index 
   */
  async removeFromWatchList(index){
    let botSummary = this.state.botSummary;
    if(this.state.botSummary.watchList.length === 1){
      botSummary.watchList = [];
    }
    else{
      botSummary.watchList.splice(index,1);
    } 
    this.setState({
      botSummary: botSummary
    });
  }

  /**
   * Grabs all of a users' bot templates
   * @param {*} self 
   */
  async getBotTemplates(self){
    ApiController.doPostWithToken(
      "get_buffered_bots",
      {},
      function(response){
        self.setState({
          botTemplates: response.bufferedBots
        });
      }
    );
  }

  /**
   * Adds a new bot template to templated bots
   */
  async appendBotTemplate(template){
    template.base  = template.market.split("-")[0];
    template.quote = template.market.split("-")[1];
    let templates = this.state.botTemplates;
    templates.push(template);
    this.setState({
      botTemplates: templates
    });  
  }

  /**
   * Calls API to grab all user's strategies
   * @param {*} self 
   */
  async getStrategies(self){
    ApiController.doPostWithToken(
      "get_strategies",
      {},
      function(response){
        self.setState({
          userStrategies: response.strategies
        });
      }
    );
  }

  /**
   * appends a new strategy to the saved strategies
   */
  async appendStrategy(strategy){
    let strategies = this.state.userStrategies;
    strategies.push(strategy);
    this.setState({
      userStrategies: strategies
    });
  }

  /**
   * Calls the save strategy api
   */
  async saveStrategy(){
    const payload = ModalController.getData("saveStrategyModal");
    if(payload.strategyName.length === 0){
      NotificationController.displayNotification(
        "ERROR",
        "Strategy name cannot be blank",
        "error"
      );
      return;
    }
    ModalController.hideModal("saveStrategyModal");
    ApiController.doPostWithToken(
      "save_strategy",
      payload,
      this.saveStrategySuccess,
      payload
    );
  }

  /**
   * Called after strategy has been saved
   * and updates list in app
   */
  async saveStrategySuccess(response,params){
    this.state.userStrategies.push({
      buySignals: params.buySignals,
      stopLoss: params.stopLoss,
      sellSignals: params.sellSignals,
      name: params.strategyName,
      description: params.description,
      id: response.id
    });
    NotificationController.displayNotification(
      "STRATEGY SAVED",
      params.strategyName + " is now available in your manager",
      "info"
    );
    this.setState({
      userStrategies: this.state.userStrategies
    });
  }

  /**
   * Calls the delete strategy endpoint
   */
  async deleteStrategy(){
    const data    = ModalController.getData("deleteStrategyModal");
    const payload = {
      strategyId: data.strategyId,
    }
    const input = document.getElementById("strategyNameInput").value;
    if(input.toUpperCase() != data.strategyName.toUpperCase()){
      NotificationController.displayNotification(
        "ERROR",
        "Inserted name does not match strategy name",
        "error"
      );
      return;
    }
    ModalController.hideModal("deleteStrategyModal");
    ApiController.doPostWithToken(
      "delete_strategy",
      payload,
      this.deleteStrategySuccess,
      data
    );
  }

  /**
   * Called after strategy has been successfuly
   * deleted and splices list in app
   */
  async deleteStrategySuccess(response,data){
    NotificationController.displayNotification(
      "STRATEGY DELETED",
      data.strategyName + " has been removed from your profile",
      "info"
    );
    this.removeStrategyById(data.strategyId);
  }

  /**
   * Helper method which finds strategy with id
   * and removes from state
   */
  removeStrategyById(id){
    for(let s=0;s<this.state.userStrategies.length;s++){
      if(this.state.userStrategies[s].id === id){
        this.state.userStrategies.splice(s,1);
        this.setState({
          userStrategies: this.state.userStrategies
        });
        return;
      } 
    }
  }

  /**
   * Grabs all user's bids and offers for bot market
   * @param {*} self 
   */
  async getBidOffers(self,username){
    ApiController.doPostWithToken(
      "get_market_bids",
      {
        "buyer": username,
        "seller": username
      },
      function(response){
        self.setState({
          bidOffers: response
        });
      }
    );
  }

  /**
   * Splice bid from bid offers object, if amount
   * is given it is subtracted from available balance
   */
  async removeBid(index,amount){
    let bids = this.state.bidOffers;
    bids.bids.splice(index,1);
    let userInfo = this.state.userInfo;
    userInfo.availableBalance += amount;
    this.setState({
      bidOffers: bids,
      userInfo: userInfo
    });
  }

  /**
   * Splice offer from bid offers object, if amount
   * is given, it is subtracted from availableBalance
   */
  async removeOffer(index,amount){
    let offers = this.state.bidOffers;
    offers.offers.splice(index,1);
    let userInfo = this.state.userInfo;
    userInfo.availableBalance += amount;
    userInfo.totalBalance += amount;
    this.setState({
      bidOffers: offers,
      userInfo
    });
  }

  /**
   * Called after a bid is made to grab new user's bids
   * and update user's available balance in place
   */
  async updateAfterBid(bid){
    const self = this;
    let userInfo = this.state.userInfo;
    userInfo.availableBalance -= bid;
    this.setState({
      userInfo: userInfo
    });
    ApiController.doPostWithToken(
      "get_market_bids",{
      "buyer": this.state.userInfo.username,
      "seller": this.state.userInfo.username
    },
    function(response){
      self.setState({
        bidOffers: response
      });
    });
  }

  /**
   * Returns all of a user's archived backtests
   */
  async getBacktestArchives(self){
    ApiController.doPostWithToken(
      "backtest_archives",
      {},
      function(response){
        self.setState({
          backtestArchives: response.archives
        });
      }
    );
  }

  /**
   * Call to add an archived backtest
   * @param {*} archive 
   */
  async appendArchive(archive){
    let archives = this.state.backtestArchives;
    archives.unshift(archive);
    this.setState({
      backtestArchives: archives
    });
  }

  /**
   * Grabs a user's shared items 
   */
  async getSharedItems(self){
    ApiController.doPostWithToken(
      "get_shared_items",
      {},
      function(response){
        self.setState({
          sharedItems: response
        });
      }
    );
  }

  /**
   * Remove shared items based on item type
   * @param {*} type 
   * @param {*} index 
   */
  removeSharedItem(type,index){
    let sharedItems = this.state.sharedItems;
    if(type === "strategy"){
      sharedItems.strategies.splice(index,1);
    }
    else if(type === "bot"){
      sharedItems.bots.splice(index,1);
    }
    else if(type === "invite"){
      sharedItems.invites.splice(index,1);
    }
    this.setState({
      sharedItems: sharedItems
    });
  }

  /**
   * Remove shared items based on item type
   * @param {*} type 
   * @param {*} index 
   */
  updateSharedItems(type,item){
    let sharedItems = this.state.sharedItems;
    if(type === "strategy"){
      sharedItems.strategies.append(item);
    }
    else if(type === "backtest"){
      sharedItems.backtests.append(item);
    }
    else if(type === "invite"){
      sharedItems.invites.append(item);
    }
    this.setState({
      sharedItems: sharedItems
    });
  }

  /**
   * Gets exchange info for user (account level)
   */
  getExchangeInfo(exchange){

    //Ref self
    const self = this;

    //Call exchange info endpoint
    ApiController.doPostWithToken(
      "exchange_account_info",{
      "exchange": exchange
    },

    //On Success
    function(response,exchange){

      //Grab current wallets
      let exchangeWallets = self.state.exchangeWallets;

      //Update <exchange> wallet
      exchangeWallets.set(exchange.toLowerCase(),response.wallet);

      //Update state
      self.setState({
        exchangeWallets: exchangeWallets
      });

    },
    exchange
    );

  }

  /**
   * Updates exchange info
   */
  updateExchangeInfo(exchange,wallet){

    //Grab current wallets
    let exchangeWallets = this.state.exchangeWallets;

    //Update <exchange> wallet
    exchangeWallets.set(exchange.toLowerCase(),wallet);

    //Update state
    this.setState({
      exchangeWallets: exchangeWallets
    });
  }

  /**
   * Remove exchange key 
   * @param {*} exchange 
   */
  removeExchangeKey(exchange){
    let userInfo = this.state.userInfo;
    let exchangeWallets = this.state.exchangeWallets;

    for(let e=0;e<userInfo.linkedExchanges.length;e++){
      if(userInfo.linkedExchanges[e].name.toLowerCase() === exchange.toLowerCase()){
        userInfo.linkedExchanges.splice(e,1);
      }
    }

    exchangeWallets.delete(exchange.toLowerCase());

    this.setState({
      userInfo: userInfo,
      exchangeWallets: exchangeWallets
    });
  }

  /**
   * Add an exchange key
   * @param {*} exchange 
   */
  addExchangeKey(exchange){
    let userInfo = this.state.userInfo;
    userInfo.linkedExchanges.push({
      name: exchange,
      isActive: true
    });
    this.setState({
      userInfo: userInfo
    });
    this.getExchangeInfo(exchange);
  }

   /**
   * Updates user consent flag
   * @param {*} exchange 
   */
  updateConsent(value){
    let userInfo = this.state.userInfo;
    userInfo.betaConsent = value;
    this.setState({
      userInfo: userInfo
    });
  }

  /**
   * Returns all pre-set in house buy and sell signals
   * @param {*} self 
   */
  async getInHouseSignals(self){
    ApiController.doPost(
      "get_signals",
      {},
      function(response){
        self.setState({
          inHouseSignals: response
        });
      }
    );
  }

  /**
   * Grabs all Travas supported markets by exchange
   * @param {*} self 
   */
  async getMarkets(self){
    for(let e=0;e<Constants.SUPPORTED_EXCHANGES.length;e++){
      ApiController.doPostWithToken(
        "market_lookup",
        {
          "exchange": Constants.SUPPORTED_EXCHANGES[e]
        },
        function(response){
          const exchange = Constants.SUPPORTED_EXCHANGES[e];
          self.markets.set(exchange,response.markets);
          self.numExchanges++;
          if(self.numExchanges === Constants.SUPPORTED_EXCHANGES.length){
            self.setState({
              markets: self.markets
            });
          }
        }
      );
    }
  }

  /**
   * Helper method to generate list of quotes by exchange
   */
  getQuotesFromMarkets(){
    let quotesMap = new Map();
    for(let e=0;e<Constants.SUPPORTED_EXCHANGES.length;e++){
      const exchange = Constants.SUPPORTED_EXCHANGES[e];
      let quotes = [];
      let markets = this.state.markets.get(exchange);
      for(let m=0; m<markets.length;m++){
        const quote = markets[m].quote;
        if(quotes.indexOf(quote) === -1){
          quotes.push(quote);
        }
      }
      quotesMap.set(exchange,quotes);
    }
    return quotesMap;
  }

  /**
   * Called when component mounts, calls all APIs to 
   * grab root level data
   */
  componentDidMount(){
    this.notificationSystem = this.refs.notificationSystem;
    NotificationController.setNotificationSystem(this.notificationSystem);
    document.getElementsByTagName("body")[0].style.backgroundColor = "black";
    document.getElementById("page-top").style.opacity = .5;
    const self = this;
    this.getUserProfile(self);
  }

  /**
   * Updates current selected service within the set
   * {'Dashboard','Strategies','Bots','Backtest','Groups','Settings'}
   * @param {*} service 
   */
  selectService(service){
    if(service === this.state.service){
      return;
    }
    window.scrollTo(0, 0);
    this.setState({
      service: service
    });
  }

  /**f
   * Returns react component associated with current
   * selected service
   */
  getService(){

    //Nothing - loading....
    if(!this.state.userInfo || !this.state.userDashboard){
      return <div/>
    }

    //User is on dashboard
    else if(this.state.service === "Dashboard" && 
            this.state.userDashboard && 
            this.state.markets){
      return <DashboardService  updateTicker={ this.state.updateTicker }
                                tickers={ this.state.userDashboard.tickers }/>
    }

    //User is on strategies
    else if(this.state.service === "Strategies" && 
            this.state.userStrategies && 
            this.state.userDashboard &&
            this.state.inHouseSignals){
      return <StrategiesService inHouseSignals={ this.state.inHouseSignals }
                                userStrategies={ this.state.userStrategies }
                                appendStrategy={ this.appendStrategy }
                                tickers={ this.state.userDashboard.tickers }/>
    }

    //User is on bots
    else if(this.state.service === "Bots" && 
            this.state.userInfo &&
            this.state.userStrategies &&
            this.state.botSummary && 
            this.state.botTemplates &&
            this.state.bidOffers &&
            this.state.markets){
      return <BotsService userStrategies={ this.state.userStrategies }
                          userBots={ this.state.botSummary.botSummaries }
                          watchList={ this.state.botSummary.watchList }
                          botTemplates={ this.state.botTemplates }
                          markets={ this.state.markets }
                          quotes={ this.getQuotesFromMarkets() }
                          bidOffers={ this.state.bidOffers }
                          userInfo={ this.state.userInfo }
                          appendBot={ this.appendBot }
                          updateBot={ this.updateBot }
                          removeBot={ this.removeBot }
                          appendWatchList={ this.appendWatchList }
                          removeFromWatchList={ this.removeFromWatchList }
                          appendBotTemplate={ this.appendBotTemplate }
                          updateAfterBid={ this.updateAfterBid }
                          removeBid={ this.removeBid }
                          removeOffer={ this.removeOffer }
                          selectService={ this.selectService }
                          linkedExchanges={ this.state.userInfo.linkedExchanges }
                          wallets={ this.state.exchangeWallets }/>
    }

    //User is on backtest
    else if(this.state.service === "Backtest" && 
            this.state.backtestArchives && 
            this.state.botSummary &&
            this.state.userInfo &&
            this.state.userStrategies && 
            this.state.markets){
      return <BacktestService  markets={ this.state.markets }
                               quotes={ this.getQuotesFromMarkets() }
                               userStrategies={ this.state.userStrategies }
                               appendBot={ this.appendBot }
                               appendArchive={ this.appendArchive }
                               archivedTests={ this.state.backtestArchives }
                               selectService={ this.selectService }/>
    }

    //User is on exchanges
    else if(this.state.service === "Exchanges" &&
            this.state.userInfo && 
            this.state.exchangeWallets &&
            this.state.exchangeWallets.size === this.state.userInfo.linkedExchanges.length &&
            this.state.botSummary){
      return <ExchangesService  selectService={ this.selectService }
                                wallets={ this.state.exchangeWallets }
                                linkedExchanges={ this.state.userInfo.linkedExchanges }
                                userBots={ this.state.botSummary.botSummaries }
                                refreshInfo={ this.updateExchangeInfo }/>
    }

    //User is on groups
    else if(this.state.service === "Groups" &&
            this.state.sharedItems && 
            this.state.userInfo ){
              return <GroupsService sharedItems={ this.state.sharedItems }
                                    userInfo={ this.state.userInfo }
                                    removeSharedItem={ this.removeSharedItem }
                                    updateGroup={ this.updateGroup }
                                    appendGroup={ this.appendGroup }
                                    appendGroupMember={ this.appendGroupMember }
                                    removeGroup={ this.removeGroup }
                                    updateGroupMember={ this.updateGroupMember }
                                    removeGroupMember={ this.removeGroupMember }
                                    appendStrategy={ this.appendStrategy }
                                    appendBot={ this.appendBot }/>
    }

    //User is on settings
    else if(this.state.service === "Settings" &&
            this.state.userProfileInfo && 
            this.state.userInfo ){
        return <SettingsService userProfileInfo={ this.state.userProfileInfo }
                                userInfo={ this.state.userInfo }/>
    }

    //User is on mobile device
    else if(!Constants.IS_MOBILE){
      return <Loader loadingMessage={ "Loading " + this.state.service + "..." } 
                     styleOverrid={ GLOBAL_LOADER }/>
    }
    
  }

  /**
   * Renders main platform component with selected
   * component as main content
   */
  render() {
    const self = this;
    return (
      <div className="text-black"> 
          { ( !this.state.userInfo || 
              !this.state.userDashboard ) &&
            <div style={ LOADING_PROFILE }>
            { !Constants.IS_MOBILE && 
              !ModalController.activeModal &&
              <Loader classOverride="text-center text-white"
                      styleOverride={ GLOBAL_LOADER_WHITE } 
                      loadingMessage="Fetching Profile..."/>
            }
          </div>
          }
          <PlatformTemplate tickers={ this.state.userDashboard ? 
                              this.state.userDashboard.tickers :
                              undefined
                            }
                            updateTicker={ this.state.updateTicker }
                            username={ this.state.userInfo ? 
                            this.state.userInfo.username : "" }
                            verified={ this.state.userInfo ? 
                              this.state.userInfo.verified : true }
                            email={ this.state.userInfo ? 
                              this.state.userInfo.email : undefined
                            }
                            selectedService={ this.state.service }
                            selectService={ this.selectService }
                            serviceComponent={ 
                              <div className="margin-top-10">
                                { this.getService() }
                              </div>
                            } /> 
      <ModalFactory platform={ self } selectService={ this.selectService } userInfo={ this.state.userInfo }/>
      <div className="float-right">
          <NotificationSystem ref="notificationSystem"/>
      </div>
      </div>
    );
  }

  /**
   * Called after render, must reset all commands
   * that were sent to children classes
   */
  componentDidUpdate(){
    if(this.state.updateTicker){
      this.setState({
        updateTicker: false
      });
    }
  }
}

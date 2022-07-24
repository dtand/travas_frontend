import React from "react"
import ApiController from "../../js/ApiController";
import ModalController from "../../js/ModalController";
import NotificationController from "../../js/NotificationController";
import CSVDownloader from "../../js/CSVDownloader";
import Constraints from "../../js/Constraints.js";

export default class BotButtonNav extends React.Component {

  constructor(props){
    super(props);

    this.state={
      makingTemplate: false,
      deleting: false,
      changingVisibility: false,
      sharing: false,
      changingName: false,
      changingMode: false
    }

    const self = this;

    this.onDeleteBot = this.onDeleteBot.bind(this);
    this.onDeleteBotConfirmed = this.onDeleteBotConfirmed.bind(this);
    
    ModalController.setData("deleteBotModal",{
      callback: self.onDeleteBotConfirmed
    });

    this.onShareBotConfirmed = this.onShareBotConfirmed.bind(this);
    
    ModalController.setData("shareBotModal",{
      callback: self.onShareBotConfirmed
    });

    this.onChangeBotNameConfirmed = this.onChangeBotNameConfirmed.bind(this);
    
    ModalController.setData("changeBotNameModal",{
      callback: self.onChangeBotNameConfirmed
    });

    this.saveTemplate           = this.saveTemplate.bind(this);
    this.onChangePrivacy        = this.onChangePrivacy.bind(this);
    this.onChangePrivacySuccess = this.onChangePrivacySuccess.bind(this);
    this.onChangeMode           = this.onChangeMode.bind(this);
    this.onChangeModeSuccess    = this.onChangeModeSuccess.bind(this);
    this.onDeleteBot            = this.onDeleteBot.bind(this);
    this.onDeleteBotSuccess     = this.onDeleteBotSuccess.bind(this);
  }

  handleMouseOver(action){
    this.props.setAction(action); 
  }

  onDeleteBot(){
    if(this.props.bot.running){
      NotificationController.displayNotification(
        "BOT IS RUNNING",
        "Bot cannot be deleted while it is running, please turn the bot off and try again",
        "error"
      );
      return;
    }
    ModalController.updateData(
      "deleteBotModal",{
        "botId": this.props.bot.id,
        "botName": this.props.bot.name
      }
    );
    ModalController.showModal("deleteBotModal");
  }

  async onDeleteBotConfirmed(){
    const botToDelete = ModalController.getData("deleteBotModal");
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
    ApiController.doPostWithToken(
      "delete_bot",
      payload,
      this.onDeleteBotSuccess,
      {
        "botId": payload.botId,
        "botName": botToDelete.botName
      });
  }

  async onDeleteBotSuccess(response,payload){
    NotificationController.displayNotification(
      "SAY BYE!",
      payload.botName + " has been removed from your bot manager",
      "info"
    );
    this.props.deleteBot(payload.botId);
    ModalController.hideModal("deleteBotModal");
  }
  
  onShareBotConfirmed(){
    const modalData = ModalController.getData("shareBotModal");
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
    ApiController.doPostWithToken(
      "share_item", 
      payload, 
      this.onShareBotSuccess, 
      modalData
    );
  }

  onShareBotSuccess(response,params){
    NotificationController.displayNotification(
      "BOT SHARED",
      params.botName + " has been shared with group member: " + params.toUser,
      "info"
    );
    ModalController.hideModal("shareBotModal");
  }

  onChangeMode(){

    //Return, can't update while running
    if(this.props.bot.running){

        //Present error message
        NotificationController.displayNotification(
          "BOT RUNNING",
          "This action cannot be performing while the bot is running",
          "error"
        );
        return;
    }

    //Return, can't update while running
    if(this.props.bot.isSimulated &&
       this.props.bot.numTrades > 0){

      //Present error message
      NotificationController.displayNotification(
        "BOT RUNNING",
        "Bot mode cannot be changed after a trade has been executed.",
        "error"
      );
      
      return;
    }

    //Check that bot volume and market is supported for live trading
    if(this.props.bot.isSimulated && 
       !Constraints.volumeIsGood(
         this.props.bot.exchange,
         this.props.bot.market.split("-")[1],
         this.props.volume
       )){

        //Present error message
        NotificationController.displayNotification(
          "UNSUPPORTED MARKET",
          "We are sorry, live trading is currently not supported for this market.  This is either due to " +
          "a non-supported exchange or poor 30 day volume",
          "error"
        );

        return;
    }

    let hasKey = false;

    //Iterate and check for key
    for(let k=0;k<this.props.linkedExchanges.length;k++){
      const exchange = this.props.linkedExchanges[k].name.toLowerCase();
      if(exchange === this.props.bot.exchange.toLowerCase()){
        hasKey = true;
        break;
      }
    }

    //Api Key not present
    if(!hasKey){
        
      //Present error message
        NotificationController.displayNotification(
          "NO API KEY",
          "You currently have no API key linked to exchange: " + this.props.bot.exchange + ".  Please " + 
          "go to the accounts tab to add one",
          "error"
        );

        return;
    }

    this.setState({
      changingMode: true
    });

    //Construct payload as opposite of current mode sim/live
    const payload = {
      "botId":this.props.bot.id,
      "isSimulated": !this.props.bot.isSimulated
    }

    //Update bot to simulated or live
    ApiController.doPostWithToken(
      "update_bot",
      payload,
      this.onChangeModeSuccess,
      payload
    );
  }

  saveTemplate(){
    if(this.templateExists(this.props.bot)){
      NotificationController.displayNotification(
        "TEMPLATE EXISTS",
        "A template already exists for this configuration.",
        "info"
      );
      return;
    }
    else{
      this.setState({
        makingTemplate: true
      });
    }
    const payload={
      "botId": this.props.bot.id
    }
    const self = this;
    ApiController.doPostWithToken(
      "template_bot",
      payload,
      function(response){
        NotificationController.displayNotification(
          "TEMPLATE SAVED",
          "Configuration for bot " + self.props.bot.name + " have been stored " +
          " in your templates which are accessible in the Factory tab",
          "info"
        );
        self.setState( { makingTemplate: false } );
        self.props.appendBotTemplate(self.props.bot);
      },
      undefined,
      () => {
        self.setState( { makingTemplate: false } )
      }
    );
  }

  templateExists(bot){
    for(let t=0;t<this.props.botTemplates.length;t++){
      const template = this.props.botTemplates[t];
      const tKey = template.base + "-" + template.quote + 
                   template.interval + 
                   JSON.stringify(template.strategy.buySignals) +
                   JSON.stringify(template.strategy.sellSignals) +
                   JSON.stringify(template.strategy.stopLoss);
      const bKey = bot.market + 
                   bot.interval + 
                   JSON.stringify(template.strategy.buySignals) +
                   JSON.stringify(template.strategy.sellSignals) +
                   JSON.stringify(template.strategy.stopLoss);
      if(tKey.toLowerCase() === bKey.toLowerCase()){
        return true;
      }
    }
    return false;
  }

  onChangePrivacy(){
    const payload = {
      "botId":this.props.bot.id,
      "private": this.props.bot.public
    }
    this.setState({
      changingVisibility: true
    });
    ApiController.doPostWithToken(
      "update_bot",
      payload,
      this.onChangePrivacySuccess,
      payload);
  }

  onChangePrivacySuccess(response,params){
    NotificationController.displayNotification(
      "BOT PRIVACY CHANGED",
      "Bots privacy has successfully been changed to " + (params.private ? "private" : "public"),
      "info"
    );
    this.props.removeAction();
    this.setState({
      changingVisibility: false
    });
    this.props.updateBot.setPrivacy(
      params.botId,
      !params.private
    );
  }

  onChangeModeSuccess(response,params){
    NotificationController.displayNotification(
      "BOT MODE CHANGED",
      params.isSimulated ? 
        "Your bot has been changed to simulation mode" :
        "Your bot has been changed to live trading mode",
      "info"
    );
    this.setState({
      changingMode: false
    });
    this.props.updateBot.setIsSimulated(
      params.botId,
      params.isSimulated
    );
  }

  onChangeBotNameConfirmed(){
    const botName = document.getElementById("botNameInput").value;
    const botId   = ModalController.getData("changeBotNameModal").botId;
    const self    = this;
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
        ModalController.hideModal("changeBotNameModal");
        self.props.updateBot.changeName(botId,botName);
      }
    )
  }

  render() {
    const self = this;
    return (
    <div>
      <span className="clickable bot-tool-item">
        <i  onMouseEnter={ () => this.handleMouseOver("Download Trades CSV") }
            onMouseLeave={ this.props.removeAction }
            onClick={ () => 
              CSVDownloader.downloadBotTradesCsv(self.props.bot.name, 
                                                 self.props.botLogs, 
                                                 self.props.bot )  
            }
            className="fa fa-download"/>
      </span>
      <span className="clickable bot-tool-item">
        <i  onMouseEnter={ () => this.handleMouseOver("Share Bot") }
            onMouseLeave={ this.props.removeAction }
            onClick={ () => {
              ModalController.showModal(
                "shareBotModal",
                {
                  botId: this.props.bot.id,
                  botName: this.props.bot.name,
                  callback: this.onShareBotConfirmed
                }
              );
            }}
            className="fa fa-share"/>
      </span>
      <span className="clickable bot-tool-item">
        <i onMouseEnter={ () => this.handleMouseOver("Delete Bot") }
           onMouseLeave={ this.props.removeAction }
           onClick={ this.onDeleteBot }
           className="fa fa-trash"/>
      </span>
      <span className="clickable bot-tool-item">
        { !this.state.changingMode &&
        <i onMouseEnter={ this.props.bot.isSimulated ? 
                            () => this.handleMouseOver("Upgrade (Live Trading)") :
                            () => this.handleMouseOver("Downgrade (Simulated)") }
           onMouseLeave={ this.props.removeAction }
           onClick={ this.onChangeMode }
           className={ this.props.bot.isSimulated ? "fa fa-level-up" : "fa fa-level-down" }/>
        }
        { this.state.changingMode && 
          <i className="fa fa-spin fa-spinner text-secondary"/>
        }
      </span>
      <span className="clickable bot-tool-item">
        { !this.state.changingVisibility && this.props.bot.public &&
          <i onMouseEnter={ () => this.handleMouseOver("Make Bot Private") }
            onMouseLeave={ this.props.removeAction } 
            onClick={ this.onChangePrivacy }
            className="fa fa-user-secret"/>
        }
        { !this.state.changingVisibility && !this.props.bot.public &&
          <i onMouseEnter={ () => this.handleMouseOver("Make Bot Public") }
            onMouseLeave={ this.props.removeAction } 
            onClick={ this.onChangePrivacy }
            className="fa fa-group"/>
        }
        { this.state.changingVisibility && 
          <i className="fa fa-spin fa-spinner text-secondary"/>
        }
      </span>
      <span className="clickable bot-tool-item">
        <i onMouseEnter={ () => this.handleMouseOver("Change Bot Name") }
           onMouseLeave={ this.props.removeAction }
           onClick={ () => {
            ModalController.showModal(
              "changeBotNameModal",{
                botId: this.props.bot.id,
                callback: this.onChangeBotNameConfirmed
              }
            );
          }}
           className="fa fa-pencil-square-o"/>
      </span>
      <span className="clickable bot-tool-item">
        { !this.state.makingTemplate &&
            <i onMouseEnter={ () => this.handleMouseOver("Save Bot As Template") }
              onMouseLeave={ this.props.removeAction }
              onClick={ this.saveTemplate }
              className="fa fa-male"/>
        }
        { this.state.makingTemplate && 
          <i className="fa fa-spin fa-spinner text-secondary"/>
        }
      </span>
    </div>
    );
  }
}


import React from "react";

import Modal from "../modals/modal";
import ModalController from "../../js/ModalController";

import ExchangeModalBody from "./exchange_modal_body";
import SaveStrategyModalBody from "./save_strategy_modal_body";
import SaveSignalModalBody from "./save_signal_modal_body";
import DeleteStrategyModalBody from "./delete_strategy_modal_body";
import ShareModalBody from "./share_modal_body";
import DeleteBotModalBody from "./delete_bot_modal_body";
import MakeBetModalBody from "./make_bet_modal_body";
import ShowBidsModalBody from "./show_bids_modal_body";
import ShowOffersModalBody from "./show_offers_modal_body";
import ChangeBotNameModalBody from "./change_bot_name_modal_body";
import CreateGroupModalBody from "./create_group_modal_body";
import DeleteGroupModalBody from "./delete_group_modal_body";
import RemoveUserModalBody from "./remove_user_modal_body";
import PromoteUserModalBody from "./promote_user_modal_body";
import IconHeader from "../generic/icon_header";
import DemoLimitsBody from "./demo_limits_body";
import MobileWarningMessage from "./mobile_warning_message";
import ApiController from "../../js/ApiController";
import NotificationController from "../../js/NotificationController";
import AddExchangeKeyModalBody from "./add_exchange_key_modal_body";
import RemoveExchangeKeyModalBody from "./remove_exchange_key_modal_body";
import BetaConsentFormBody from "./beta_consent_form_body";

export default class ModalFactory extends React.Component {

  constructor(props){
    super(props);

    this.selectMarketModalId = "selectMarketModal";
    this.saveStrategyId      = "saveStrategyModal";
    this.saveSignalId        = "saveSignalModal";
    this.deleteStrategyId    = "deleteStrategyModal";
    this.shareStrategyId     = "shareStrategyModal";
    this.deleteBotModalId    = "deleteBotModal";
    this.sharebotModalId     = "shareBotModal";
    this.bidBotModalId       = "bidBotModal";
    this.showBidsModalId     = "showBidsModal";
    this.showOffersModalId   = "showOffersModal";
    this.changeBotNameModalId = "changeBotNameModal";
    this.createGroupModalId = "createGroupModal";
    this.deleteGroupModalId = "deleteGroupModal";
    this.removeUserModalId  = "removeUserModal";
    this.promoteUserModalId = "promoteUserModal";
    this.mobileWarningId    = "mobileWarningModal";
    this.demoLimitsModalId = "demoLimitsModal";
    this.addExchangeKeysId = "addExchangeKeysModal";
    this.removeExchangeKeysId = "removeExchangeKeysModal";
    this.betaConsentFormId = "betaConsentModal";

    this.getModal = this.getModal.bind(this);
    this.platform = this.props.platform;
  }

  getModal(){

    const currModal = ModalController.activeModal;
    const platform  = this.platform;

    /**
     * Select Market - updates market for platform tickers
     */
    if(currModal === this.selectMarketModalId){
      let data =  ModalController.getData(currModal);

      return ( 
        <ExchangeModalBody quotes={ this.platform.getQuotesFromMarkets().get(data.exchange) }
                           markets={ this.platform.state.markets.get(data.exchange) }
                           onSubmit={ this.platform.updateTicker }/>
      );
    }

    /**
     * Save Strategy - Confirm and save strategy for profile
     */
    else if(currModal === this.saveStrategyId){
      return <SaveStrategyModalBody 
                onSubmit={ ModalController.getData(this.saveStrategyId).callback }/>
    }

    /**
     * Save Strategy - Confirm and save strategy for profile
     */
    else if(currModal === this.saveSignalId){
      return <SaveSignalModalBody 
                onSubmit={ ModalController.getData(this.saveSignalId).callback }/>
    }

    /**
     * Delete Strategy - confirm deletion of strategy
     */
    else if(currModal === this.deleteStrategyId){
      return <DeleteStrategyModalBody 
                onSubmit={ this.platform.deleteStrategy }/>
    }

    /**
     * Share Strategy - share a strategy with another user
     */
    else if(currModal === this.shareStrategyId){
      return <ShareModalBody
                parentId={ this.shareStrategyId }
                userInfo={ this.platform.state.userInfo }
                selectService={ this.props.selectService }
                onSubmit={ 
                  this.props.userInfo.groups.length !== 0 ?
                    ModalController.getData(this.shareStrategyId).callback  :
                    undefined
                }/>
    }

    /**
     * Delete Bot - confirm deletion of a bot
     */
    else if(currModal === this.deleteBotModalId){
      return <DeleteBotModalBody onSubmit={ 
        ModalController.getData(this.deleteBotModalId).callback
      }/>
    }

    /**
     * Share Bot - share a bot with another user
     */
    else if(currModal === this.sharebotModalId){
      return <ShareModalBody
                parentId={ this.sharebotModalId }
                userInfo={ this.platform.state.userInfo } 
                onSubmit={ 
                  this.props.userInfo.groups.length !== 0 ?
                  ModalController.getData(this.sharebotModalId).callback :
                  undefined
                }/>
    }

    /**
     * Bit on Bot - Submit a bid for a bot
     */
    else if(currModal === this.bidBotModalId){
      return <MakeBetModalBody
              hideAfterSubmit={ true } 
              parentId={ this.bidBotModalId }
              userInfo={ this.platform.state.userInfo }
              onSubmit={ 
                ModalController.getData(this.bidBotModalId).callback
              }/>
    }

    /**
     * Show Bids - Display all bids a user has in the marketplace
     */
    else if(currModal === this.showBidsModalId){
      return <ShowBidsModalBody parentId={ this.showBidsModalId }/>
    }

    /**
     * Show Offers - shows all offers a user has for his/her public bots
     */
    else if(currModal === this.showOffersModalId){
      return <ShowOffersModalBody parentId={ this.showOffersModalId }/>
    }

    /**
     * Change Bot Name, change the name of one of a user's bots
     */
    else if(currModal === this.changeBotNameModalId){
      return <ChangeBotNameModalBody onSubmit={ 
                ModalController.getData(this.changeBotNameModalId).callback
              }/>
    }

    /**
     * Create Group - save a new group and become admin
     */
    else if(currModal === this.createGroupModalId){
      return <CreateGroupModalBody onSubmit={
                ModalController.getData(this.createGroupModalId).createGroupSubmit
              }/>
    }

    /**
     * Delete Group - delete a new group and become admin
     */
    else if(currModal === this.deleteGroupModalId){
      return <DeleteGroupModalBody onSubmit={
                ModalController.getData(this.deleteGroupModalId).deleteGroupSubmit
              }/>
    }

    /**
     * Remove User - remove a user from a group & confirm
     */
    else if(currModal === this.removeUserModalId){
      return <RemoveUserModalBody onSubmit={
               ModalController.getData(this.removeUserModalId).removeUserSubmit
              }/>
    }

    /**
     * Remove User - remove a user from a group & confirm
     */
    else if(currModal === this.promoteUserModalId){
      return <PromoteUserModalBody onSubmit={
               ModalController.getData(this.promoteUserModalId).promoteUserSubmit
              }/>
    }

    /**
     * Demo Limits - pings user to signup for demo
     */
    else if(currModal === this.demoLimitsModalId){
      return <DemoLimitsBody submitOverride={ 
                              <IconHeader iconClass="fa fa-sign-in" 
                                anchor="left" 
                                header="SIGNUP"/>
                            }
                             onSubmit={ () => { 
                               const data = ModalController.getData(this.demoLimitsModalId);
                               window.localStorage.setItem( "signupData", {
                                 strategies: data.userStrategies,
                                 archivedTests: data.archivedTests
                               });
                               window.location = "../signup" 
                              } 
                            }/>
    }

    /**
     * Message presented when logging into platform via mobile
     */
    else if(currModal === this.mobileWarningId){
      return <MobileWarningMessage blockClose={ true }/>
    }

    /**
     * Add exchange API keys to account
     */
    else if(currModal === this.addExchangeKeysId){
      return <AddExchangeKeyModalBody 
              onSubmit={ () => { 
                const data = ModalController.getData("addExchangeKeysModal");
                ModalController.activeModalComponent.setState({
                  loading: true
                });
                ApiController.doPostWithToken(
                  "add_exchange_keys",
                  {
                    "publicKey": data.publicKey,
                    "privateKey": data.privateKey,
                    "exchange": data.exchange
                  },
                  function(response,exchange){
                    ModalController.activeModalComponent.setState({
                      loading: false
                    });
                    ModalController.hideModal("addExchangeKeysModal");
                    NotificationController.displayNotification(
                      "EXCHANGE LINKED",
                      "Api key has been added, live trading is now enable for exchange: " + exchange.toUpperCase(),
                      "success"
                    );
                    platform.addExchangeKey(exchange);
                  },
                  data.exchange,
                  () => {
                    ModalController.activeModalComponent.setState({
                      loading: false
                    });
                  }
                );
              } }/>
    }

    /**
     * Remove exchange API keys to account
     */
    else if(currModal === this.removeExchangeKeysId){
      return <RemoveExchangeKeyModalBody 
              onSubmit={ () => { 
                const data = ModalController.getData("removeExchangeKeysModal");
                ModalController.activeModalComponent.setState({
                  loading: true
                });
                ApiController.doPostWithToken(
                  "remove_exchange_keys",
                  {
                    "exchange": data.exchange
                  },
                  function(response,exchange){
                    ModalController.activeModalComponent.setState({
                      loading: false
                    });
                    ModalController.hideModal("addExchangeKeysModal");
                    NotificationController.displayNotification(
                      "API KEY REMOVE",
                      "Api key has been added, live trading is disabled for exchange " + exchange.toUpperCase(),
                      "info"
                    );
                    platform.removeExchangeKey(exchange);
                  },
                  data.exchange,
                  () => {
                    ModalController.activeModalComponent.setState({
                      loading: false
                    });
                  }
                );
              } }/>
    }

     /**
     * Consent to beta terms
     */
    else if(currModal === this.betaConsentFormId){
      return <BetaConsentFormBody onSubmit={ () => { 

            //Grab modal data
            const data = ModalController.getData("betaConsentModal");

            //If consent form was accepted - perform API call
            if(data.accepted){

              //Set loader
              ModalController.activeModalComponent.setState({
                loading: true
              });

              //Hit beta consent endpoint
              ApiController.doPostWithToken(
                "beta_consent",
                { },

                //On success
                function(response){

                  //Stop loader
                  ModalController.activeModalComponent.setState({
                    loading: false
                  });

                  //Hide this modal
                  ModalController.hideModal("betaConsentModal");

                  //Present success message to user
                  NotificationController.displayNotification(
                    "LIVE TRADING ENABLED",
                    "Thank you for joining our beta! Live trading is now available in the bots service",
                    "info"
                  );

                  //Update global platform state
                  platform.updateConsent(true);
                },
                {},
                () => {
                  ModalController.activeModalComponent.setState({
                    loading: false
                  });
                }
              );
            }

            //Consent Not Accepted
            else{
              //Present error message
              NotificationController.displayNotification(
                "ERROR",
                "Terms must be accepted to enabled live trading",
                "error"
              );
            }
      } }/>
    }

  } 

  getTitleFromModal(){

    const currModal = ModalController.activeModal;

    if(currModal === this.selectMarketModalId){
      return <IconHeader iconClass="fa fa-bar-chart-o" 
                         anchor="left" 
                         header="SELECT MARKET"/>;
    }
    else if(currModal === this.saveStrategyId){
      return <IconHeader iconClass="fa fa-line-chart" 
      anchor="left" 
      header="SAVE STRATEGY"/>;
    }
    else if(currModal === this.saveSignalId){
      return <IconHeader iconClass="fa fa-line-chart" 
      anchor="left" 
      header="SAVE SIGNAL"/>;
    }
    else if(currModal === this.deleteStrategyId){
      return <IconHeader iconClass="fa fa-line-chart" 
      anchor="left" 
      header="DELETE STRATEGY"/>;
    }
    else if(currModal === this.shareStrategyId){
      return <IconHeader iconClass="fa fa-line-chart" 
      anchor="left" 
      header="SHARE STRATEGY"/>;
    }
    else if(currModal === this.deleteBotModalId){
      return <IconHeader iconClass="fa fa-cog" 
      anchor="left" 
      header="DELETE BOT"/>;
    }
    else if(currModal === this.sharebotModalId){
      return <IconHeader iconClass="fa fa-cog" 
      anchor="left" 
      header="SHARE BOT"/>;
    }
    else if(currModal === this.bidBotModalId){
      return <IconHeader iconClass="fa fa-cog" 
      anchor="left" 
      header="BID ON BOT"/>;
    }
    else if(currModal === this.showBidsModalId){
      return <IconHeader iconClass="fa fa-money" 
      anchor="left" 
      header="MY BIDS"/>;
    }
    else if(currModal === this.showOffersModalId){
      return <IconHeader iconClass="fa fa-money" 
      anchor="left" 
      header="MY OFFERS"/>;
    }
    else if(currModal === this.changeBotNameModalId){
      return <IconHeader iconClass="fa fa-cog" 
      anchor="left" 
      header="UPDATE BOT NAME"/>;
    }
    else if(currModal === this.createGroupModalId){
      return <IconHeader iconClass="fa fa-users" 
      anchor="left" 
      header="CREATE GROUP"/>;
    }
    else if(currModal === this.deleteGroupModalId){
      return <IconHeader iconClass="fa fa-users" 
      anchor="left" 
      header="DELETE GROUP"/>;
    }
    else if(currModal === this.removeUserModalId){
      return <IconHeader iconClass="fa fa-user" 
      anchor="left" 
      header="REMOVE USER"/>;
    }
    else if(currModal === this.promoteUserModalId){
      return <IconHeader iconClass="fa fa-level-up" 
      anchor="left" 
      header="PROMOTE USER"/>;
    }
    else if(currModal === this.demoLimitsModalId){
      return <IconHeader iconClass="fa fa-sign-in" 
      anchor="left" 
      header="SIGNUP"/>;
    }
    else if(currModal === this.mobileWarningId){
      return <IconHeader iconClass="fa fa-mobile" 
                         anchor="left" 
                         header="COMING SOON (MOBILE)"/>;
    }
    else if(currModal === this.addExchangeKeysId){
      return <IconHeader iconClass="fa fa-key" 
                         anchor="left" 
                         header="ADD API KEY(S)"/>;    
    }
    else if(currModal === this.removeExchangeKeysId){
      return <IconHeader iconClass="fa fa-key" 
                         anchor="left" 
                         header="REMOVE API KEY(S)"/>;    
    }
    else if(currModal === this.betaConsentFormId){
      return <IconHeader iconClass="fa fa-form" 
                         anchor="left" 
                         header="BETA CONSENT FORM"/>;    
    }
  }

  render() {
    return (
      <div>
        { ModalController.activeModal && 
          <Modal modalId={ ModalController.activeModal } 
                 titleId={ ModalController.activeModal + "Title" } 
                 title={ this.getTitleFromModal() }
                 modalBody={ this.getModal() }/>
        }
      </div>
    );
  }
}

import React from "react";
import FilterTable from "../generic/filter_table";
import IconHeader from "../generic/icon_header";
import ApiController from "../../js/ApiController"
import BotMarketSelected from "./bot_market_selected";
import BotMarketFilters from "./bot_market_filters";
import ModalController from "../../js/ModalController"
import NotificationController from "../../js/NotificationController"
import Loader from "../generic/loader";

const TAB_MARGIN = {
  marginTop: "5px",
  marginLeft: "20px",
  marginRight: "20px"
}

export default class BotMarketTab extends React.Component {

  constructor(props){
   
    super(props);

    this.state={
      selectedBot: this.props.alltime ? this.props.alltime[0] : undefined,
      selectedBotRank: 1,
      filter: "alltime",
      loadingGraph: true,
      clearTableSelect: false
    }

    this.notificationSystem = undefined;
    this.onBotLogsSuccess = this.onBotLogsSuccess.bind(this);
    this.selectBot = this.selectBot.bind(this);
    this.changeLeaderboard = this.changeLeaderboard.bind(this);
    this.onBidBotSuccess = this.onBidBotSuccess.bind(this);
    this.cancelBid = this.cancelBid.bind(this);
    this.dismissBid = this.dismissBid.bind(this);
    this.cancelOffer = this.cancelOffer.bind(this);
    this.acceptOffer = this.acceptOffer.bind(this);
  }

  onBidBotSuccess(response,offer){
    NotificationController.displayNotification(
      "OFFER PLACED",
      "Your offer of " + offer + " has been posted",
      "info"
    );
  }

  cancelOffer(offer,callback,index){
    const self = this;
    if(this.state.blockDecline){
      return;
    }
    ApiController.doPostWithToken("sell_bot",{
      "buyer": offer.buyer,
      "botId": offer.botId,
      "decline": true
    },
    function(response){
      NotificationController.displayNotification(
        "OFFER DECLINED",
        "Users offer of " + offer.bid + " has been declined",
        "info"
      );
      callback();
      self.props.removeOffer(index,0);
    });
  }

  acceptOffer(offer,callback,index){
    const self = this;
    if(this.state.blockAccept){
      return;
    }
    ApiController.doPostWithToken("sell_bot",{
      "buyer": offer.buyer,
      "botId": offer.botId
    },
    function(response){
      NotificationController.displayNotification(
        "CONFIGURATION SOLD",
        "Bot configuration has been sold to " + offer.buyer + " at amount " + offer.bid,
        "info"
      );
      callback();
      self.props.removeOffer(index,offer.bid);
    });
  }

  cancelBid(bid,callback,index){
    const payload = {
      "cancel": true,
      "buyer": bid.buyer,
      "botOwner": bid.seller,
      "botId": bid.botId,
      "bid": bid.bid
    }
    const self = this;
    ApiController.doPostWithToken(
      "bot_market_bid",
      payload,
      function(response, params){
        NotificationController.displayNotification(
          "BID CANCELLED",
          "Bid has been removed for bot" + params.botName,
          "info"
        );
        callback();
        self.props.removeBid(index,bid.bid);
      },
      {
        "botName": bid.metrics.botName,
        "bid": bid.bid
      }
    );
  }

  dismissBid(bid,callback,index){
    const self = this;
    const payload = {
      "dismiss": true,
      "buyer": bid.buyer,
      "botOwner": bid.seller,
      "botId": bid.botId,
      "bid": bid.bid
    }
    ApiController.doPostWithToken(
      "bot_market_bid",
      payload,
      function(response, params){
        callback();
        self.props.removeBid(index,0);
      },{
        "botName": bid.metrics.botName,
        "bid": bid.bid
      }
    );
  }

  selectBot(bot,index,clear,filter){
    this.state.selectedBot = bot;
    this.state.selectedBotRank = index+1;
    ApiController.doPostWithToken("bot_logs",{
      "botOwner": bot.username,
      "botId": bot.botId,
      "period": filter ? filter : this.state.filter
      }, this.onBotLogsSuccess);
    this.setState({
      loadingGraph: true,
      clearTableSelect: clear
    });
  }

  changeLeaderboard(leaderboard){
    this.props.setFilter(leaderboard);
    this.setState({
      filter: leaderboard
    });
    const bots = this.getLeaderboard(leaderboard);
    this.selectBot(bots[0],0,true,leaderboard);
  }

  getLeaderboard(leaderboard){
    if(leaderboard === "daily"){
      return this.props.daily;
    }

    else if(leaderboard === "weekly"){
      return this.props.weekly;
    }

    else if(leaderboard === "monthly"){
      return this.props.monthly;
    }

    return this.props.alltime;
  }

  getRankText(entry,rank){
    if(entry.movement > 0){
      return(<span className="text-secondary">
        <strong className="text-success">
          ↑{entry.movement}
        </strong>
      </span>);
    }
    else if(entry.movement < 0){
      return(<span className="text-secondary">
        <strong className="text-danger">
          ↓{Math.abs(entry.movement)}
        </strong>
      </span>);
    }
    return <span className="text-secondary"/>
  }

  buildTableData(){
    
    let leaderboard = this.getLeaderboard(this.state.filter);
    let table = [];


    for(let l=0;l<leaderboard.length;l++){
      const entry = leaderboard[l];
      table.push([
        "#" + entry.rank,
        this.getRankText(entry,entry.rank),
        entry.username.toUpperCase(),
        entry.botName.toUpperCase(),
        entry.exchange.toUpperCase(),
        entry.market.toUpperCase(),
        entry.roi,
        entry.avgRoi,
        entry.winLoss,
        entry.score
      ]);
    }

    return table;
  }

  onBotLogsSuccess(response){
    this.setState({
      loadingGraph: false,
      botLogs: response.botLogs
    });
  }

  componentDidMount(){
    this.notificationSystem = this.refs.notificationSystem;
    if(this.state.selectedBot){
      ApiController.doPostWithToken("bot_logs",{
          "botOwner":this.state.selectedBot.username,
          "botId":this.state.selectedBot.botId
        },
      this.onBotLogsSuccess);
    }
  }

  componentDidUpdate(){
    this.state.clearTableSelect = false;
    if(this.state.selectedBot === undefined && this.props.alltime){
      this.state.selectedBot = this.props.alltime[0];
      ApiController.doPostWithToken("bot_logs",{
        "botOwner":this.state.selectedBot.username,
        "botId":this.state.selectedBot.botId
      },
      this.onBotLogsSuccess);
    }
  }

  render(){  

    const self = this;

    if(this.props.alltime && 
      this.props.daily && 
      this.props.weekly && 
      this.props.monthly){
      return(
        <div class="tab-pane active show" 
              id="settings" 
              style={ TAB_MARGIN }>
          <div className="row">
            <div className="col-md-2">
              <h5 className="clickable" style={ { marginTop: "10px", marginBottom: "10px" } }>
                <a href="#" onClick={ function(){
                  ModalController.showModal( "showBidsModal", {
                    bids: self.props.bids,
                    cancelBid: self.cancelBid,
                    dismissBid: self.dismissBid,
                  });
                }}>
                  { this.props.bids.length + " " }<IconHeader header="MY BIDS" iconClass="fa fa-caret-square-o-up" anchor="right"/>
                </a>
              </h5>
            </div>
            <div className="col-md-2">
              <h5 className="clickable" style={ { marginTop: "10px", marginBottom: "10px" } }>
                <a href="#" onClick={ function(){
                  ModalController.showModal( "showOffersModal", {
                    offers: self.props.offers,
                    cancelOffer: self.cancelOffer,
                    acceptOffer: self.acceptOffer
                  });
                }}>
                { this.props.offers.length + " " }<IconHeader header="MY OFFERS" iconClass="fa fa-caret-square-o-up" anchor="right"/>
                </a>
              </h5>
            </div>
          </div>
            <div>
              <BotMarketSelected  bot={ this.state.selectedBot }
                                  rank={this.state.selectedBotRank }
                                  filter={this.state.filter }
                                  loadingGraph={ this.state.loadingGraph }
                                  botLogs={ this.state.botLogs }
                                  watchBot={ this.props.watchBot }
                                  watchList={ this.props.watchList }
                                  selectBot={ this.selectBot }
                                  onBidBotSuccess={ this.onBidBotSuccess }/>
            </div>
            <br/>
            <div>
              <BotMarketFilters groups={ this.props.groups }
                                onFilterByTime={this.changeLeaderboard }
                                updateGroup={ this.props.updateGroup }
                                updatePage={ this.props.updatePage }
                                page={ this.props.page }
                                pagesLoaded={ this.props.pagesLoaded }/>
            </div>
            <br/>
            <div>
              { <FilterTable header={[
                                    "RANK",
                                    "",
                                    "USER",
                                    "BOT NAME",
                                    "EXCHANGE",
                                    "MARKET",
                                    <IconHeader header="ROI" iconClass="fa fa-sort" anchor="right"/>,
                                    <IconHeader header="AVG ROI" iconClass="fa fa-sort" anchor="right"/>,
                                    <IconHeader header="WIN/LOSS" iconClass="fa fa-sort" anchor="right"/>,
                                    <IconHeader header="SCORE" iconClass="fa fa-sort" anchor="right"/>,
                                  ]}
                                  sortable={[
                                    false,
                                    false,
                                    false,
                                    false,
                                    false,
                                    true,
                                    true,
                                    true,
                                    true,
                                    true,
                                  ]}
                                  data={ this.buildTableData() }
                                  mappedData={ this.getLeaderboard(this.state.filter) }
                                  onClick={ this.selectBot }
                                  align="left"
                                  classOverride="row"
                                  searchText="Search bots..."
                                  clearTableSelect={ this.state.clearTableSelect }
                                  columnCallbacks={{
                                    "6": function(value){
                                      const text = (value*100).toFixed(2) + "%";
                                      if(value>0){
                                        return <span className="text-success">{ "↑" + text }</span>
                                      }
                                      else if(value<0){
                                        return <span className="text-danger">{ "↓" + text }</span>
                                      }
                                      return <span className="text-secondary">{ text }</span>
                                    },
                                    "7": function(value){
                                      const text = (value*100).toFixed(2) + "%";
                                      if(value>0){
                                        return <span className="text-success">{ "↑" + text }</span>
                                      }
                                      else if(value<0){
                                        return <span className="text-danger">{ "↓" + text }</span>
                                      }
                                      return <span className="text-secondary">{ text }</span>
                                    },
                                    "8": function(value){
                                      const text = value.toFixed(2);
                                      if(value>1){
                                        return <span className="text-success">{ text }</span>
                                      }
                                      else if(value<1){
                                        return <span className="text-danger">{ text }</span>
                                      }
                                      return <span className="text-secondary">{ text }</span>
                                    },
                                    "9": function(value){
                                      if(value<=20){
                                        return <span className="text-danger">{ value }</span>
                                      }
                                      else if(value<=40){
                                        return <span className="text-warning">{ value }</span>
                                      }
                                      else if(value<=60){
                                        return <span className="text-secondary">{ value }</span>
                                      }
                                      else if(value<=80){
                                        return <span className="text-primary">{ value }</span>
                                      }
                                      return <span className="text-success">{ value }</span>
                                    }
                                  }}/>
            }
            </div>
          <br/><br/><br/><br/>
      </div>
      );
    }
    else{
      return (
      <div class="tab-pane active show" 
           id="settings" 
           style={ TAB_MARGIN }>
        <Loader loadingMessage="Fetching Leaderboards..."/>
      </div>
      );
    }
  }
}
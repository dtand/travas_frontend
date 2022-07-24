import React from "react";
import TopBotsSummary from "./top_bots_summary";
import BotLeaderboardTable from "../bots/bot_leaderboard_table";
import Loader from "../generic/loader";
import Constants from "../../js/Constants";

const MARGINS_TABLE = {
    marginLeft: "5px",
    merginRight: "5px",
    marginTop: "0px"
}

export default class PlatformLandingBotsDisplay extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedBot: 0,
            current: 0,
            updateCurrent: false
        };
        this.selectBot = this.selectBot.bind(this);
        this.afterBotUpdate = this.afterBotUpdate.bind(this);
    }

  selectBot(bot){
      if(bot && bot.rank){
        this.setState({
            updateCurrent: 0,
            selectedBot: bot.rank-1,
        });
      }
      else{
        this.setState({
            updateCurrent: 0
        });
      }
      this.props.resetBotCallback();
  }

  afterBotUpdate(){
      this.setState({
          updateCurrent: false
      });
  }

  componentDidUpdate(){
      if(this.props.resetBot){
        this.selectBot(this.props.botLeaderboard[0]);
      }
  }

  render() {

      const bot = this.props.botLeaderboard ? this.props.botLeaderboard[this.state.selectedBot] : undefined;
      const hasBots = this.props.botLeaderboard && this.props.botLeaderboard.length > 0;

      return (
          <div>
            <div className="theme-banner-one row">
                <div className="col-md-12 margin-top-100">
                    <div className="row">
                        <div className="col-md-4 margin-left-50">
                            <button className={ this.props.mode === "bots" ? "btn btn-primary" : "btn btn-secondary" } 
                                    onClick={ () => this.props.toggleMode("bots") }>
                                USER BOTS
                            </button>
                            <button className={ this.props.mode === "strategies" ? "btn btn-primary margin-left-5" : "btn btn-secondary margin-left-5" } 
                                    onClick={ () => this.props.toggleMode("strategies") }>
                                STRATEGIES
                            </button>
                        </div>
                        { this.props.mode === "strategies" && bot && hasBots &&
                            <div className="col-md-7">
                                <h3> STRATEGY: { bot.strategy.name.toUpperCase() } </h3>
                                <p>
                                    { bot.strategy.description }
                                </p>
                            </div>
                        }
                    </div>
                </div>
                <div className="col-md-12 margins-50"> 
                    { this.props.botLeaderboard && hasBots &&
                      <TopBotsSummary afterBotUpdate={ this.afterBotUpdate }
                                      updateBot={ this.state.updateCurrent }
                                      bot={ bot }
                                      mode={ this.props.mode }
                                      toggleMode={ this.props.toggleMode }
                                      period={ this.props.period }/>
                    }
                    { this.props.botLeaderboard  && !hasBots && 
                        <div className="text-center" 
                             style={{ height: "512px" }}>
                        <h1>
                            Looks like no bots have made <br/> trades for this period.
                        </h1>
                        </div>
                    }
                </div>
            </div>
            {  this.props.botLeaderboard && !Constants.IS_MOBILE && hasBots &&
                <div className="row text-black" style={ MARGINS_TABLE }>
                    <div className="col-md-12 margins-5">
                        <BotLeaderboardTable 
                          selectBot={ this.selectBot }
                          mode={ this.props.mode }
                          leaderboard={ this.props.botLeaderboard }/>
                    </div>
                </div>
            }
            {  this.props.botLeaderboard && Constants.IS_MOBILE && hasBots &&
                <div className="row margin-left-10 margin-right-10 text-black">
                    <div className="col-lg-12">
                        <BotLeaderboardTable 
                          selectBot={ this.selectBot }
                          mode={ this.props.mode }
                          leaderboard={ this.props.botLeaderboard }/>
                    </div>
                </div>
            }
    </div>
    );
  }
}
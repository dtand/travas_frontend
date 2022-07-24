import React from "react";
import Footer from "./footer";
import PlatformLandingBotsDisplay from "../landing_page/platform_landing_bots_display";
import ApiController from "../../js/ApiController";
import HeaderBots from "./header_bots";
import Constants from "../../js/Constants";
import HeaderMobile from "./header_mobile";
import Loader from "../generic/loader";

export default class LandingPageBots extends React.Component {

    constructor(props){
        super(props);
        this.selectLeaderboard = this.selectLeaderboard.bind(this);
        this.resetBotCallback  = this.resetBotCallback.bind(this);
        this.toggleMode        = this.toggleMode.bind(this);
    }

    state={
        period: "All Time",
        botLeaderboardsDaily: undefined,
        botLeaderboardsWeekly: undefined,
        botLeaderboardsAlltime: undefined,
        botLeaderboardsMonthly: undefined,
        strategiesDaily: undefined,
        strategiesWeekly: undefined,
        strategiesAlltime: undefined,
        strategiesMonthly: undefined,
        selectedLeaderboard: undefined,
        mode: "bots",
        page: 0,
        resetBot: false,
        loading: true,
    }

    toggleMode(mode){

        this.setState({
            mode: mode
        });

        this.selectLeaderboard("All Time",mode);
    }

    resetBotCallback(){
        this.setState({
            resetBot: false
        });
    }

    selectLeaderboard(leaderboard,mode){

        let currentMode = mode ? mode : this.state.mode;

        if(leaderboard === "All Time"){
            if(currentMode === "bots"){
                this.setState({
                    selectedLeaderboard: this.state.botLeaderboardsAlltime,
                    resetBot: true,
                    period: "All Time"
                });
            }
            else{
                this.setState({
                    selectedLeaderboard: this.state.strategiesAlltime,
                    resetBot: true,
                    period: "All Time"
                });
            }
        }
        else if(leaderboard === "Monthly"){
            if(currentMode === "bots"){
                this.setState({
                    selectedLeaderboard: this.state.botLeaderboardsMonthly,
                    resetBot: true,
                    period: "Monthly"
                });
            }
            else{
                this.setState({
                    selectedLeaderboard: this.state.strategiesMonthly,
                    resetBot: true,
                    period: "Monthly"
                });
            }
        }
        else if(leaderboard === "Weekly"){
            if(currentMode === "bots"){
                this.setState({
                    selectedLeaderboard: this.state.botLeaderboardsWeekly,
                    resetBot: true,
                    period: "Weekly"
                });
            }
            else{
                this.setState({
                    selectedLeaderboard: this.state.strategiesWeekly,
                    resetBot: true,
                    period: "Weekly"
                });
            }
        }
        else if(leaderboard === "Daily"){
            if(currentMode === "bots"){
                this.setState({
                    selectedLeaderboard: this.state.botLeaderboardsDaily,
                    resetBot: true,
                    period: "Daily"
                });
            }
            else{
                this.setState({
                    selectedLeaderboard: this.state.strategiesDaily,
                    resetBot: true,
                    period: "Daily"
                });
            }
        }
    }

    getJsonFromUrl(url) {
        if(!url) url = window.location.search;
        var query = url.substr(1);
        var result = {};
        query.split("&").forEach(function(part) {
          var item = part.split("=");
          result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }

    componentDidMount(){
        
        const self = this;
        let count = 0;

        ApiController.doPost(
            "bot_leaderboards", 
            {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "alltime"}, 
            function(response){
                count++;
                self.setState({
                    botLeaderboardsAlltime: response.bots,
                    selectedLeaderboard: response.bots,
                    loading: count < 7
                });
            }
        );

        ApiController.doPost(
            "bot_leaderboards", 
            {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "weekly"}, 
            function(response){
                count++;
                self.setState({
                    botLeaderboardsWeekly: response.bots,
                    loading: count < 7
                });
            }
        );

        ApiController.doPost(
            "bot_leaderboards", 
            {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "daily"}, 
            function(response){
                count++;
                self.setState({
                    botLeaderboardsDaily: response.bots,
                    loading: count < 7
                });
            }
        );

        ApiController.doPost(
            "bot_leaderboards", 
            {"start": this.state.page*100, "numberToFetch":100,"leaderboard": "monthly"}, 
            function(response){
                count++;
                self.setState({
                    botLeaderboardsMonthly: response.bots,
                    loading: count < 7
                });
            }
        );

        ApiController.doPost(
            "strategy_tickers", 
            {"leaderboard": "alltime"}, 
            function(response){
                count++;
                self.setState({
                    strategiesAlltime: response.bots,
                    loading: count < 7
                });
            }
        );

        ApiController.doPost(
            "strategy_tickers", 
            {"leaderboard": "monthly"}, 
            function(response){
                count++;
                self.setState({
                    strategiesMonthly: response.bots,
                    loading: count < 7
                });
            }
        );

        ApiController.doPost(
            "strategy_tickers", 
            {"leaderboard": "weekly"}, 
            function(response){
                count++;
                self.setState({
                    strategiesWeekly: response.bots,
                    loading: count < 7
                });
            }
        );

        ApiController.doPost(
            "strategy_tickers", 
            {"leaderboard": "daily"}, 
            function(response){
                count++;
                self.setState({
                    strategiesDaily: response.bots,
                    loading: count < 7
                });
            }
        );
    }

    render(){
        return(	
        <div>
            <div className="html-top-content landing-page-styles">
            <div className="theme-top-section">
                    { Constants.IS_MOBILE ? 
                        <HeaderMobile/> : 
                        <HeaderBots period={ this.state.period }
                                    selectLeaderboard={ this.selectLeaderboard }/> }
                    <div>
                    <div className="margin-top-25">
                    { !this.state.loading &&
                        <PlatformLandingBotsDisplay botLeaderboard={ this.state.selectedLeaderboard } 
                                                    resetBot={ this.state.resetBot }
                                                    resetBotCallback={ this.resetBotCallback }
                                                    mode={ this.state.mode }
                                                    toggleMode={ this.toggleMode }
                                                    period={ this.state.period }/>
                    }

                    { this.state.loading && 
                      <div className="text-center" 
                           style={ 
                               { 
                                 height: "512px" 
                               } 
                               }>
                        <div style={ {
                            top: "50%",
                            left: "40%",
                            marginTop: window.innerHeight/2,
                            marginBottom: window.innerHeight/2
                        } }>
                            <Loader styleOverride={{}} loadingMessage="Fetching bots..."/> 
                        </div>
                      </div>
                    }
                    </div>
                </div>
                <Footer/>
            </div>
            </div>
        </div>
    )}

}
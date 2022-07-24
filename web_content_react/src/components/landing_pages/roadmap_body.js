import React from "react";
import RoadmapQuarter from "./roadmap_quarter";
import RoadmapQuarterMobile from "./roadmap_quarter_mobile";
import Constants from "../../js/Constants";

const BODY_BACKGROUND = {
    backgroundColor: "white"
}

const BODY_MARGINS = {
    marginTop: "4px",
    marginLeft: "40px",
    marginRight: "40px"
}

export default class RoadmapBody extends React.Component {

    constructor(props){
        super(props);
    }

    createQuarter(side,quarter,year,header,icon,goals){
        if(Constants.IS_MOBILE){
            return <RoadmapQuarterMobile side={ side }
                            quarter={ quarter } 
                            year={ year }
                            header={ header }
                            icon={ icon }
                            goals={ goals }/>
        }
        else{
            return <RoadmapQuarter side={ side }
                            quarter={ quarter } 
                            year={ year }
                            header={ header }
                            icon={ icon }
                            goals={ goals }/>
        }
    }

    render() {
      return (
        <div style={ BODY_BACKGROUND }>
            <div className="row text-center text-secondary">
                <div className="col-md-12" style={ BODY_MARGINS }>
                    <br/><br/><br/>
                    <div className="col-md-12 border-bottom margin-top-50">
                        <h1>
                            Roadmap
                        </h1>
                    </div>
                    <div className="col-md-12 text-center">
                    <div className="container">
                        <div className="margin-top-10">
                            <h1><i className="fa fa-map"/></h1>
                        </div>
                    </div>
                    </div>
                </div>
                <br/>
                    <div className="col-md-12 quarters margin-top-25">
                        { this.createQuarter( "left",
                                        "Q1" ,
                                        "2018",
                                        "Development Phase I",
                                        "fa fa-lightbulb-o large-icon",
                                        <p class="info">
                                            Product Concept Completion <i className="fa fa-check check-mark-white"/> <br/>
                                            Forge Backend Engine (APIs) <i className="fa fa-check check-mark-white"/> <br/>
                                            Forge Bot Trading Engine <i className="fa fa-check check-mark-white"/> <br/>
                                            Initial Frontend Skeleton <i className="fa fa-check check-mark-white"/> <br/>
                                        </p>
                        )}
                        { this.createQuarter( "right",
                                        "Q2" ,
                                        "2018",
                                        "Development Phase II",
                                        "fa fa-database large-icon",
                                        <p class="info">
                                            Complete Unit Testing <i className="fa fa-check check-mark"/> <br/>
                                            Bulk Signal Additions <i className="fa fa-check check-mark"/> <br/>
                                            Initial UI Completion <i className="fa fa-check check-mark"/> <br/>
                                            Internal Deployment    <i className="fa fa-check check-mark"/> <br/>
                                        </p>
                        )}
                        { this.createQuarter( "left",
                                        "Q3" ,
                                        "2018",
                                        <span>Alph Launch & <br/> Company Newsletter</span>,
                                        "fa fa-desktop large-icon",
                                        <p class="info">
                                            Complete Platform Alpha v1.0.0 <i className="fa fa-check check-mark-white"/> <br/>
                                            Deploy Private Alpha <i className="fa fa-check check-mark-white"/> <br/>
                                            Newsletter Launch (September) <i className="fa fa-check check-mark-white"/> <br/>
                                            Continuious UI Optimization    <i className="fa fa-check check-mark-white"/> <br/>
                                        </p>
                        )}
                        { this.createQuarter( "right",
                                        "Q4" ,
                                        "2018",
                                        "Open Beta Transition" ,
                                        "fa fa-users large-icon",
                                        <p class="info">
                                            First Half - Open Alpha <i className="fa fa-check check-mark"/> <br/>
                                            Seconda Half - Open Beta <i className="fa fa-check check-mark"/> <br/>
                                            UI Refactoring and Optimization <i className="fa fa-check check-mark"/> <br/>
                                            Launch Group Services <i className="fa fa-check check-mark"/> <br/>
                                            Launch Bot Marketplace <i className="fa fa-check check-mark"/> <br/>
                                            Construct Marketing Plan <i className="fa fa-check check-mark"/> <br/>
                                            Launch Live Trading (Binance) <br/>
                                            Add 3-4 New Signals/Indicators <br/>
                                        </p>
                        )}
                        { this.createQuarter( "left",
                                        "Q1" ,
                                        "2019",
                                        "Transition to Production",
                                        "fa fa-paper-plane-o large-icon",
                                        <p class="info">
                                            Rolling Open Beta<br/>
                                            Publish Membership Tiers<br/>
                                            Seed Funding Round<br/>
                                            Launch Advanced Signal Design<br/>
                                            Launch Bot Monitor Channels<br/>
                                            Add 2-3 More Exchanges<br/>
                                            Add 4-5 New Trading Signals/Indicators<br/>
                                            Heavy Marketing<br/>
                                        </p>
                        )}
                        { this.createQuarter( "right",
                                        "Q2" ,
                                        "2019",
                                        "Production Launch",
                                        "fa fa-rocket large-icon",
                                        <p class="info">
                                            Launch Trading Competitions <br/>
                                            Launch Referral Program <br/>
                                            Add 1-2 More exchanges<br/>
                                            Production Launch<br/>
                                            Begin Developing ML/AI Signals<br/>
                                            Continued Marketing<br/>
                                            Additional Partnerships <br/>
                                        </p>
                        )}
                        { this.createQuarter( "left",
                                        "Q3" ,
                                        "2019",
                                        <span>Mobile Application & <br/> Promotions</span>,
                                        "fa fa-mobile-phone large-icon",
                                        <p class="info">
                                            Submit IOS Application <br/>
                                            Publish Travas Platform APIs <br/>
                                            Integrate 1-2 ML/AI Signals <br/>
                                            Machine Learning API Product Completion <br/>
                                            Begin Sponsorship Campaign <br/>
                                        </p>
                        )}
                        { this.createQuarter( "right",
                                        "Q4" ,
                                        "2019",
                                        <span>Future Goals & <br/> Evaluation</span>,
                                        "fa fa-calendar large-icon",
                                        <p class="info">
                                         Launch Mobile Applications <br/>
                                            Add additional Signals/Indicators <br/>
                                            Machine Learning API Product Launch <br/>
                                            Construct 2020 Roadmap & Beyond <br/>
                                        </p>
                        )}
                        <br/><br/><br/><br/>
                    </div>
                    <br/>
                    <br/>
                </div>
        </div>
    );
  }
}
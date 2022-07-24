import React from "react";
import TeamMember from "./team_member";
import Constants from "../../js/Constants";

export default class TeamBody extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
      return (
        <div>
            <div className="row text-center text-secondary">
                <div className="col-md-12">
                <br/><br/><br/>
                    <div className="col-md-12">
                        <h1 className="margin-bottom-10">
                            Company
                        </h1>
                    </div>
                    <div className="col-md-12 text-center">
                    <div className="container">
                        <p className="text-left margin-top-10 about body-text">
                            Travas, Inc is a United States based Company
                            formed in August of 2018 by its two 
                            founders Daniel Anderson and Matthew Teeter.  Travas 
                            is a cryptocurrency research and development firm
                            which focuses on building tools for cryptocurrency traders.
                            Our core product is the Travas Platform, which is an automated
                            trading and backtesting tool.  Travas' mission is to provide
                            a simple and intuitive way for traders to navigate and 
                            succeed in the volatile cryptocurrency markets.  The Travas 
                            Platform is currently in open alpha.  The platform is mainly designed 
                            for retail investors, but also includes more advanced dedicated
                            options for institutional clients.  Our founders also
                            offer cryptocurrency related consulting and research.  Such
                            services vary from detailed analysis to general education 
                            on blockchain technology and crypto-assets.  
                            For inquiries about these services and price quotes, 
                            please contact one of our founders directly.
                        </p>
                    </div>
                    <br/>
                    </div>
                    <div id="founders" className="col-md-12">
                        <h1>
                            Founders
                        </h1>
                    </div>
                    <div className="col-md-12 text-center">
                        <h1>
                            <i className="fa fa-handshake-o"/>
                        </h1>
                    </div>
                    <div className="margin-top-25">
                        <div className="row margins-25">
                            <div className="col-md-5">
                                <TeamMember imagePath={require("../../img/daniel_anderson.jpg")}
                                            fullName="Daniel Anderson"
                                            title={ <span>CEO, Co-founder & Full Stack Developer</span> }
                                            description={ Constants.TEAM_DESCRIPTIONS.daniel }
                                            email={ "daniel@travas.io" }
                                            twitter={ "https://twitter.com/danieltanderson"}
                                            linkedin={ "https://www.linkedin.com/in/daniel-anderson-06212789/" }/>
                            </div>
                            { Constants.IS_MOBILE ? <br/> : <div className="col-md-2"></div> }
                            <div className={ Constants.IS_MOBILE ? "margin-top-25 col-md-5" : "col-md-5" }>
                                <TeamMember imagePath={require("../../img/matt_teeter.jpg")}
                                            fullName="MATTHEW TEETER"
                                            title={ <span>CFO, Co-founder & Director of Research</span> }
                                            description={ Constants.TEAM_DESCRIPTIONS.matt }
                                            email={ "matt@travas.io" }
                                            twitter={ "https://twitter.com/MattTravas"}
                                            linkedin={ "https://www.linkedin.com/in/matttravas/" }/>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <br/>
                </div>
            </div>
        </div>
    );
  }
}
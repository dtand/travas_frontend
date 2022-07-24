import React from "react";
import Footer from "./footer";
import HeaderSimple from "./header_simple";
import TeamBody from "../landing_pages/team_body";
import Constants from "../../js/Constants";
import HeaderMobile from "./header_mobile";

export default class LandingPageTeam extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return(	
        <div>
            <div className="html-top-content landing-page-styles">
            <div className="theme-top-section">
                { Constants.IS_MOBILE ? <HeaderMobile/> : <HeaderSimple/> }
                    <div>
                    <div className="margin-top-25">
                        <TeamBody/>
                    </div>
                </div>
                <Footer/>
            </div>
            </div>
        </div>
    )}

}
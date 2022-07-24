import React from "react";
import Footer from "./footer";
import HeaderSimple from "./header_simple";
import FAQBody from "../landing_pages/faq_body";
import DonateBody from "../landing_pages/donate_body";
import Constants from "../../js/Constants";
import HeaderMobile from "./header_mobile";

export default class LandingPageDonate extends React.Component {

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
                        <DonateBody/>
                    </div>
                </div>
                <Footer/>
            </div>
            </div>
        </div>
    )}

}
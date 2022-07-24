import React from "react";
import Footer from "./footer";
import Constants from "../../js/Constants";
import BacktestMainPublic from "../backtest/backtest_main_public";
import HeaderDemo from "./header_demo";
import HeaderMobile from "./header_mobile";

export default class LandingPageDemo extends React.Component {

    render(){
        return(	
        <div>
            <div className="html-top-content">
            <div className="theme-top-section">
                 { Constants.IS_MOBILE ? <HeaderMobile/> : <HeaderDemo tickers={ Constants.DEMO_TICKERS }/> }
                <br/>
                <div>
                    <div className="margin-left-10 margin-right-10">
                        <BacktestMainPublic/>
                    </div>
                </div>
                <Footer/>
            </div>
            </div>
        </div>
    )}

}
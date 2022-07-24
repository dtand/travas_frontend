import React from "react";
import ImgCarousel from "./img_carousel";
import Constants from "../../js/Constants";

export default class BetaPanel extends React.Component {

    render(){
        return(	
            <div className="apps-overview color-one tr-background" id="beta">
                <div className="tr-fade">
                    <div className={ Constants.IS_MOBILE ? "margins-25" : "margin-right-100" }>
                        <div className="inner-wrapper">
                            <div className="row">
                                { !Constants.IS_MOBILE &&
                                <div className="col-lg-8">
                                    <ImgCarousel/>
                                </div> }
                                <div className="col-lg-4 inner-wrapper">
                                        <div className="margin-left-25 text">
                                            <h3>Don't miss our Beta</h3>
                                            <h2>Travas Platform Beta</h2>
                                            <h6>Free automated trading through Q1 2019!</h6>
                                            <p>Our product is currently transitioning into open beta.  What does this mean?  We are currently allowing anyone 
                                            to help us test our software and join our community.  All live trading will be free throughout the beta.
                                            </p>
                                            <ul className="button-group">
                                                <li><a href="#"> Signup <i className="fa fa-user-plus"></i></a></li>
                                                <li><a href="#"> Try Demo <i className="fa fa-arrow-right"></i></a></li>
                                            </ul>
                                        </div> 
                                </div>
                            </div>
                        </div> 
                    </div>
                </div> 
            </div> 
    )}
}
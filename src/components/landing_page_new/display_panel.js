import React from "react";
import SignupMailList from "../signup/signup_mail_list";
import Constants from "../../js/Constants";

export default class DisplayPanel extends React.Component {

    constructor(props){
        super(props);
        this.href = this.href.bind(this);
    }
    href(address){
        window.location=address;
    }

    render(){
        return(	
        <div id="theme-banner" className="theme-banner-one">
            <img src={ require("../../images/icon/20.png") } alt="" className={ Constants.IS_MOBILE ? "icon-shape-one-mobile" : "icon-shape-one" }/>
            <img src={ require("../../images/icon/1.png") } alt="" className={ Constants.IS_MOBILE ? "icon-shape-two-mobile" : "icon-shape-two" }/>
            <div className={ Constants.IS_MOBILE ? "margin-left-25 margin-right-25" : "margin-left-100 margin-right-100" }>
                <div className="row">
                    <div className={ Constants.IS_MOBILE ? "text-center col-md-12 main-text-wrapper" : "col-md-6 main-text-wrapper" }>
                        <h1>
                            <span className="text-dark">
                                Unlock the <br/>
                                Power of <br/> 
                                Automated <br/> <span className="text-primary">Crypto Trading</span> 
                            </span>
                        </h1>
                        <p>
                            Travas is currently in open beta. <br/> 
                            Join us today!
                        </p>
                        <ul className="button-group clearfix">
                            <li className={ Constants.IS_MOBILE ? "mobile-li" : "non-mobile-li" }><a href="demo">DEMO</a></li>
                            <li className={ Constants.IS_MOBILE ? "mobile-li" : "non-mobile-li" }>
                                <div className="btn-group pad-top-5">
                                    <a href="signup" className="download-button">Signup (FREE)</a>
                                </div>
                            </li>
                        </ul>
                        {  Constants.IS_MOBILE &&
                        <div className="row social-media-wrapper-mobile margin-top-15">
                            <div className="col-md-12 text-center">
                                <ul>
                                    <i className="clickable fa fa-twitter social-icon-mobile" 
                                    onClick={  () => this.href("https://twitter.com/travasresearch") }/>
                                    <i className="clickable fa fa-instagram social-icon-mobile"
                                    onClick={  () => this.href("https://instagram.com/travasresearch") }/>
                                    <i className="clickable fa fa-youtube social-icon-mobile"
                                    onClick={  () => this.href("https://www.youtube.com/channel/UClVLyv6bL-PJdgrODzmvXMA") }/>
                                    <i className="clickable fa fa-facebook social-icon-mobile"
                                    onClick={  () => this.href("https://facebook.com/travasresearch") }/>
                                    <i className="clickable fa fa-linkedin social-icon-mobile"
                                        onClick={  () => this.href("https://www.linkedin.com/company/travas/about/") }/>
                                    <i className="clickable fa fa-telegram social-icon-mobile"
                                    onClick={  () => this.href("https://t.me/joinchat/Jw1UkA2HQqVndYW6iVzsJA") }/>
                                    <i className="clickable fa fa-reddit social-icon-mobile"
                                    onClick={  () => this.href("https://reddit.com/r/Travas") }/>
                                </ul>
                            </div>
                            <br/>
                        </div>
                        }
                    </div>
                    { !Constants.IS_MOBILE &&
                        <div className="form-wrapper">
                            <div>
                                <div className="margin-top-50">
                                    <div className="signup-top border-bottom margin-right-25 margin-left-25">
                                        <h5 className="text-primary">
                                            <strong>Stay Connected</strong>
                                        </h5>
                                        <p className="text-dark text-left">
                                            Submit your email to our list 
                                            and recieve monthly updates 
                                            on our company and platform.
                                        </p>
                                    </div>
                                    <div className="signup-bottom text-black">
                                        <div className="margin-left-25">
                                            <br/><br/>
                                            <div className="text-dark">
                                            <SignupMailList message="*Enter email"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    { !Constants.IS_MOBILE &&
                    <div className="social-media-wrapper">
                        <ul>
                            <i className="clickable fa fa-twitter base-blue social-icon" 
                               onClick={  () => this.href("https://twitter.com/travasresearch") }/>
                            <br/>
                            <i className="clickable fa fa-instagram base-blue social-icon"
                               onClick={  () => this.href("https://instagram.com/travasresearch") }/>
                            <br/>
                            <i className="clickable fa fa-youtube base-blue social-icon"
                               onClick={  () => this.href("https://www.youtube.com/channel/UClVLyv6bL-PJdgrODzmvXMA") }/>
                            <br/>
                            <i className="clickable fa fa-facebook base-blue social-icon"
                               onClick={  () => this.href("https://facebook.com/travasresearch") }/>
                            <br/>
                             <i className="clickable fa fa-linkedin base-blue social-icon"
                                onClick={  () => this.href("https://www.linkedin.com/company/travas/about/") }/>
                            <br/>
                            <i className="clickable fa fa-telegram base-blue social-icon"
                               onClick={  () => this.href("https://t.me/joinchat/Jw1UkA2HQqVndYW6iVzsJA") }/>
                            <br/>
                            <i className="clickable fa fa-reddit base-blue social-icon"
                               onClick={  () => this.href("https://reddit.com/r/Travas") }/>
                            <br/>
                        </ul>
                    </div>
                    }
                </div>
            </div>
        </div>
    )}
}
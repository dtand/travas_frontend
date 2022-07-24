import React from "react";
import SessionManager from "../../js/SessionManager";
import TeamBody from "../landing_pages/team_body";
import RoadmapBody from "../landing_pages/roadmap_body";
import DonateBody from "../landing_pages/donate_body";
import FAQBody from "../landing_pages/faq_body";

const NAV_STYLE = {
    marginTop: "75px",
    marginRight: "5px",
    display: "inline"
}

export default class PlatformLandingNav extends React.Component {

    constructor(props){
        super(props);
        this.state={
            hoverCompany: false
        }
        this.toggleHoverCompany = this.toggleHoverCompany.bind(this);
        this.selectAboutUs = this.selectAboutUs.bind(this);
        this.selectRoadmap = this.selectRoadmap.bind(this);
        this.selectDonate  = this.selectDonate.bind(this);
        this.selectFAQ     = this.selectFAQ.bind(this);
        this.selectBots    = this.selectBots.bind(this);
    }

    toggleHoverCompany(){
        this.setState({
            hoverCompany: !this.state.hoverCompany
        });
    }

    selectPlatform(){
        if(SessionManager.getSessionToken()){
            window.location = "dashboard";
        }
        else{
            window.location = "login";
        }
    }

    selectAboutUs(){
        if(window.location.href.indexOf("demo") >= 0){
            window.location = "about";
        }
        else{
            this.props.updateBody(
                <TeamBody/>
            );
        }
    }

    selectRoadmap(){
        if(window.location.href.indexOf("demo") >= 0){
            window.location = "roadmap";
        }
        else{
            this.props.updateBody(
                <RoadmapBody/>
            );
        }
    }

    selectDonate(){
        if(window.location.href.indexOf("demo") >= 0){
            window.location = "donate";
        }
        else{
            this.props.updateBody(
                <DonateBody/>
            );
        }
    }

    selectFAQ(){
        if(window.location.href.indexOf("demo") >= 0){
            window.location = "faq";
        }
        else{
            this.props.updateBody(
                <FAQBody/>
            );
        }
    }

    selectBots(){
        if(window.location.href.indexOf("demo") >= 0){
            window.location = "../#lower";
        }
        else{
            window.location = "#lower";
        }
    }

    render() {
      const lower = document.getElementById("lower");

      return (
        <div>
            <ul className="list-group list-group-horizontal" 
                style={ NAV_STYLE }>
                <a href="login" className="landing-nav-item">
                    <i className="fa fa-sign-in"/> LOGIN
                </a>              
                <a href="signup" className="landing-nav-item">
                    <i className="fa fa-user-plus"/> SIGNUP
                </a>
                { lower && <span className="landing-nav-item clickable" onClick={ this.selectBots }>
                    <i className="fa fa-cogs"/> BOTS 
                </span> }
                <a href="dashboard" className="landing-nav-item">
                    <i className="fa fa-dashboard"/> PLATFORM
                </a>
                <a href="demo" className="landing-nav-item">
                    <i className="fa fa-area-chart"/> DEMO
                </a>
                <span onMouseDown={ this.toggleHoverCompany }
                   className="landing-nav-item clickable">
                    <i className="fa fa-users"/> COMPANY <i className="fa fa-angle-down"/>
                </span>
                { this.state.hoverCompany && 
                        <div className="float-right border rounded" 
                             style={ 
                                 { width: "175px",
                                   backgroundColor: "white", 
                                   position: "absolute", 
                                   marginRight:"5px",
                                   transition: "opacity 2s",
                                   opacity: 1,
                                   marginTop: "5px" } }>
                          <table className="table nav-item-dropdown text-left text-secondary">
                            <tbody>
                                <tr>
                                    <td onClick={ this.selectAboutUs }
                                        className="nav-item-dropdown-item clickable">
                                      <i className="fa fa-building-o"/> ABOUT US
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ this.selectRoadmap }
                                        className="nav-item-dropdown-item clickable">
                                        <i className="fa fa-map"/>  ROADMAP
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ () => { window.location = "https://travas.io/blog" } }
                                        className="nav-item-dropdown-item clickable">
                                      <i className="fa fa-book"/>    BLOG
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ this.selectDonate }
                                        className="nav-item-dropdown-item clickable">
                                    <i className="fa fa-thumbs-up"/>    DONATE
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ () => { window.location = "https://travas.io/blog/contact" } } 
                                        className="nav-item-dropdown-item clickable"
                                        onClick={ () => { window.location = "https://travas.io/blog/contact" } }>
                                        <i className="fa fa-envelope"/>  CONTACT
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ this.selectFAQ } 
                                        className="nav-item-dropdown-item clickable">
                                        <i className="fa fa-info"/>  FAQ
                                    </td>
                                </tr>
                            </tbody>
                          </table>
                        </div>
                }
            </ul>
        </div>
    );
  }
}
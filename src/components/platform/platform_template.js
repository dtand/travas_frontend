import React from "react"
import MainNav from "./main_nav"
import StickyFooter from "./sticky_footer";
import GlobalStateController from "../../js/GlobalStateController"
import NotificationController from "../../js/NotificationController"
let NotificationSystem = require('react-notification-system');


export default class PlatformTemplate extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      toggled: false,
      update: false,
      hoverTitle: false,
    }
    this.toggleNav = this.toggleNav.bind(this);
    this.notificationSystem = null;
    GlobalStateController.addState("platformToggled");
  }

  toggleNav(){
    this.setState({
      toggled: !this.state.toggled
    });
    GlobalStateController.pingState("platformToggled",this.state.toggled);
  }

  componentDidMount(){
    this.notificationSystem = this.refs.notificationSystem;
    NotificationController.setNotificationSystem(this.notificationSystem);
  }

  render() {
    return (
      <div>
        <div className={ this.state.toggled ?
                        "sidenav-toggled" : 
                        "fixed-nav sticky-footer bg-dark" } 
            id="page-top">
          <br/>
          <br/>
          <MainNav tickers={ this.props.tickers }
                   updateTicker={ this.props.updateTicker }
                   username={ this.props.username }
                   email={ this.props.email }
                   verified={ this.props.verified }
                   selectedService={ this.props.selectedService }
                   selectService={ this.props.selectService }
                   dashboardTitle={ <span>TRAVAS ALPHA v1.1.0</span> } 
                   toggleNav={ this.toggleNav }
                   toggled={ this.state.toggled }
                   updateAfterProfile={ this.props.updateAfterProfile }/>
          <div id="mainContentWrapper" 
              className="content-wrapper">
              <div className="container-fluid">
              { this.props.serviceComponent }
              </div>
          </div>
        </div>
        <div className="float-right">
          <NotificationSystem ref="notificationSystem"/>
        </div>
      </div>
    );
  }
}

import React from "react"
import PlatformTemplate from "./platform_template"
import Loader from "./loader"
import TabMenu from "../platform/tab_menu"
import ProfileTab from "./profile_tab"
import ApiController from "../../js/ApiController"
import UserData from "../../js/UserData"

const TAB_MARGIN = {
  marginTop: "5px",
  marginLeft: "15px",
  marginRight: "15px"
}

export default class SettingsMain extends React.Component {

  constructor(props){
    
    super(props);
    
    this.state={
      loading: true,
      currentTab: 0,
      userInfo: false
    }

    this.updateAfterProfile = this.updateAfterProfile.bind(this);
    this.getUserInfoSuccess = this.getUserInfoSuccess.bind(this);
    this.getTab = this.getTab.bind(this);
  }

  updateAfterProfile(){
    ApiController.doPostWithToken(
    "user_info",
    {
      user: UserData.username
    },
    this.getUserInfoSuccess);
  }

  getTab(){

    if(this.state.loading && !this.state.userInfo){
      return (
        <div class="tab-pane active show" style={ TAB_MARGIN }>
          <br/>
          <Loader styleOverride={{marginTop: "300px"}}
                  loadingMessage={ "Fetching profile..." }/>
        </div>
        );
    }
    else if(this.state.currentTab === 0){
      return(
        <ProfileTab userInfo={ this.state.userInfo }/>
      );
    }
  }

  getUserInfoSuccess(response){
    this.setState({
      userInfo: response,
      loading: false
    });
  } 

  render() {
    return(
      <div>
        <PlatformTemplate title="Dashboard"
                          subtitle="Settings"
                          updateAfterProfile={ this.updateAfterProfile }
                          serviceComponent={
                            <div>
                            <TabMenu updateTab={ this.updateTab }
                                     currentTab={ this.state.currentTab } 
                                     tabs={ [
                              { 
                                name: "ACCOUNT"
                              }
                              ] }/>
                            <div class="tab-content">
                              { 
                                this.getTab()
                              }
                            </div>
                          </div>
                        }/>
        { this.state.showModal }
      </div>
    );
  }
}

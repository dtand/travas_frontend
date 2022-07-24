import React from "react"
import TabMenu from "../platform/tab_menu"
import ProfileTab from "./profile_tab"

export default class SettingsService extends React.Component {

  constructor(props){
    
    super(props);
    
    this.state={
      currentTab: 0,
      userInfo: false
    }
    this.getTab = this.getTab.bind(this);
  }

  getTab(){
    if(this.state.currentTab === 0){
      return(
        <ProfileTab userInfo={ this.props.userInfo }
                    userProfileInfo={ this.props.userProfileInfo }/>
      );
    }
  }

  render() {
    return(
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
    );
  }
}

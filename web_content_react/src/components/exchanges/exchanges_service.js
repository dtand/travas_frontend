import React from "react"
import TabMenu from "../platform/tab_menu"
import ExchangesTab from "./exchanges_tab";

export default class ExchangesService extends React.Component {

  /**
   * Setup object and initialize tabs
   * @param {*} props 
   */
  constructor(props){
    super(props);
    this.state={
      currentTab: 0
    }
    this.updateTab = this.updateTab.bind(this);
  }

  /**
   * Called to update selected tab
   * @param {} newTab 
   */
  updateTab(newTab){
    this.setState({
      currentTab: newTab,
    });
  }

  getTab(){

    //User is on the first tab
    if(this.state.currentTab === 0) {
      if(!this.props.linkedExchanges || 
         this.props.linkedExchanges.length === 0){
          return <h1 className="text-center text-secondary margins-100"> 
            It looks like you haven't linked an exchang yet.  <br/> Please add an
            exchange in the <span className="text-primary clickable" onClick={ () => this.props.selectService("Settings") }> Accounts </span> section.
        </h1>
      }
      else{
        return <ExchangesTab  wallets={ this.props.wallets }
                              linkedExchanges={ this.props.linkedExchanges }
                              userBots={ this.props.userBots }
                              refreshInfo={ this.props.refreshInfo }/>
      }
    }
  }

  render() {

    return (
        <div>
          <TabMenu updateTab={ this.updateTab }
                   currentTab={ this.state.currentTab } 
                   tabs={ [
            { 
              name: "EXCHANGES"
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
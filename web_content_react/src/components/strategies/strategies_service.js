import React from "react"
import TabMenu from "../platform/tab_menu"
import StrategiesManagerTab from "./strategies_manager_tab";
import IndicatorDesignTab from "./indicator_design_tab";
import TVChartContainer from "../tradingview_charts/tv_chart_container";

export default class StrategiesService extends React.Component {

  constructor(props){
    super(props);
    this.state={
      currentTab: 0
    }
    this.updateTab = this.updateTab.bind(this);
  }

  updateTab(newTab){
    this.setState({
      currentTab: newTab,
    });
  }

  getTab(){

    if(this.state.currentTab === 0) {
      return <StrategiesManagerTab userStrategies={ this.props.userStrategies }
                                   inHouseSignals={ this.props.inHouseSignals }
                                   appendStrategy={ this.props.appendStrategy }
                                   tickers={ this.props.tickers }/>
    }
    if(this.state.currentTab === 1) {
      //return <IndicatorDesignTab />
      return <h1 className="text-secondary margin-top-50">
          Advanced design is in development and will be available soon...
      </h1>
    }
    else{
      return(
        <div className="margin-top-100 margin-left-25 margin-right-25">
          <h2 className="text-center text-secondary">
            Advanced Strategy design is currently in development.  Will be coming soon...
          </h2>
        </div>
      )
    }
  }

  render() {

    return (
        <div>
          <TabMenu updateTab={ this.updateTab }
                   currentTab={ this.state.currentTab } 
                   tabs={ [
            { 
              name: "MANAGER"
            },
            { 
              name: "ADVANCED"
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

import React from "react";
import Dropdown from "../generic/dropdown"
import IconHeader from "../generic/icon_header"
import Loader from "../generic/loader";

const TIMEFRAMES = [
  { leaderboard: "alltime"},
  { leaderboard: "monthly" },
  { leaderboard: "weekly" },
  { leaderboard: "daily" }
]

export default class BotMarketFilters extends React.Component {

  constructor(props){
    super(props);
    this.state={
      selectedTimeframe: "ALL TIME",
      selectedGroup: "GLOBAL",
    }
    this.updateGroup = this.updateGroup.bind(this);
    this.updateTimeframe = this.updateTimeframe.bind(this);
  }

  updateGroup(dropdownValue){
    this.state.selectedGroup = dropdownValue;
    this.props.updateGroup(dropdownValue.toLowerCase());
  }

  updateTimeframe(dropdownValue,index){
    this.state.selectedTimeframe = dropdownValue;
    this.props.onFilterByTime(TIMEFRAMES[index].leaderboard);
  }

  buildGroupList(){
    const groups = this.props.groups;
    let groupDropdown = ["GLOBAL","FUNDED BOTS ONLY"];
    for(let g=0;g<groups.length;g++){
      groupDropdown.push(groups[g].groupName.toUpperCase());
    }
    return groupDropdown;
  }

  render(){  

    return(
      <div className="row" style={{marginBottom:"10px",marginTop:"15px"}}>
        <div className="col-md-2">
          <Dropdown id="filtersIntervalDropdown"
                    dropdownList={ ["ALL TIME","MONTHLY", "WEEKLY","DAILY"] }
                    header={ <IconHeader textClass="text-center"
                                         iconClass="fa fa-calendar-o"
                                         anchor="left"
                                         header="TIMEFRAME"/> }
                    onClickRow={ this.updateTimeframe }
                    buttonText={ this.state.selectedTimeframe }/>
        </div>
        <div className="col-md-2">
          <Dropdown id="filtersGroupsDropdown"
                    dropdownList={ this.buildGroupList() }
                    header={ <IconHeader textClass="text-center"
                                         iconClass="fa fa-users"
                                         anchor="left"
                                         header="GROUPS"/> }
                    onClickRow={ this.updateGroup }
                    buttonText={ this.state.selectedGroup }/>
        </div>
        <div className="col-md-5"/>
        <div className="col-md-1 text-primary text-right">
          <h4 className="clickable" onClick={ () => this.props.updatePage(-1) }>{ "<" } </h4> 
        </div>
        <div className="col-md-1 text-primary text-center">
          <div>
            { 
             <h4> 
              { this.props.pagesLoaded >= 4 && (this.props.page+1) } 
             </h4> 
            }
            { 
             <h5> 
              { this.props.pagesLoaded < 4 && <Loader styleOverride={ { marginTop:"0px", transform: "translate(0px, -20px)" } }/> } 
             </h5> 
            }
          </div>
        </div>
        <div className="col-md-1 text-primary text-left">
          <h4 className="clickable" onClick={ () => this.props.updatePage(1) }>{ ">" } </h4> 
        </div>
      </div>
    );
  }
}
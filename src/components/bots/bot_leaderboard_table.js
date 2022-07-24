import React from "react";
import FilterTable from "../generic/filter_table";
import IconHeader from "../generic/icon_header";
import Constants from "../../js/Constants";
import AnchorLink from 'react-anchor-link-smooth-scroll';

export default class BotLeaderboardTable extends React.Component {

  constructor(props){
    super(props);
    this.buildTableData = this.buildTableData.bind(this);
  }


  getRankText(entry,rank){
    if(entry.movement > 0){
      return(<span className="text-secondary">
        <strong className="text-success">
          ↑{entry.movement}
        </strong>
      </span>);
    }
    else if(entry.movement < 0){
      return(<span className="text-secondary">
        <strong className="text-danger">
          ↓{Math.abs(entry.movement)}
        </strong>
      </span>);
    }
    return <span className="text-secondary"/>
  }

  buildTableData(){
    
  let leaderboard = this.props.leaderboard
  let table = [];
  const self = this;

  if(!Constants.IS_MOBILE){
    for(let l=0;l<leaderboard.length;l++){
      const entry = leaderboard[l];
      table.push([
        <span>
          <span className="scroll-bot-wrapper">
            <AnchorLink href="#root" 
                        onClick={ () => this.props.selectBot(entry) }>
             <i class="fa fa-caret-up scroll-bot-button clickable"/>
            </AnchorLink>
          </span>
        </span>,
        "#" + entry.rank,
        this.getRankText(entry,entry.rank),
        self.props.mode === "strategies" ?  entry.botName.toUpperCase() : entry.username.toUpperCase(),
        self.props.mode === "strategies" ? entry.strategy.name.toUpperCase() : entry.botName.toUpperCase(),
        entry.exchange.toUpperCase(),
        entry.market.toUpperCase(),
        entry.roi,
        entry.winLoss,
        entry.score
      ]);
    }
  }
  else{
    for(let l=0;l<leaderboard.length;l++){
      const entry = leaderboard[l];
      table.push([
        <span>
        <span className="scroll-bot-wrapper">
          <AnchorLink href="#root" 
                      onClick={ () => this.props.selectBot(entry) }>
          <i class="fa fa-caret-up scroll-bot-button clickable"/>
          </AnchorLink>
        </span>
      </span>,
        this.getRankText(entry,entry.rank),
        [ "#" + entry.rank,
          entry.botName.toUpperCase(), 
          entry.exchange, 
          entry.market
        ],
        entry.roi
      ]);
    }
  }

  return table;
}

render(){  
    return(
      <FilterTable header={ !Constants.IS_MOBILE ? [
        "RANK",
        "",
        "",
        this.props.mode === "strategies" ? "BOT NAME" : "USER",
        this.props.mode === "strategies" ? "STRATEGY" : "BOT NAME",
        "EXCHANGE",
        "MARKET",
        <IconHeader header="ROI" iconClass="fa fa-sort" anchor="right"/>,
        <IconHeader header="WIN/LOSS" iconClass="fa fa-sort" anchor="right"/>,
        <IconHeader header="SCORE" iconClass="fa fa-sort" anchor="right"/>,
      ] : [
        "",
        "",
        "BOT",
        <IconHeader header="ROI" iconClass="fa fa-sort" anchor="right"/>
      ] }
      sortable={ !Constants.IS_MOBILE ? [
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        true,
      ] : [
        false,
        false,
        false,
        true
      ]}
      ignoreStyle={ false }
      data={ this.buildTableData() }
      disableClick={ true }
      onClick={ this.props.selectBot }
      align="left"
      classOverride="row"
      searchText="Search bots..."
      columnCallbacks={ !Constants.IS_MOBILE ? {
        "7": function(value){
          const text = (value*100).toFixed(2) + "%";
          if(value>0){
            return <span className="text-success">{ "↑" + text }</span>
          }
          else if(value<0){
            return <span className="text-danger">{ "↓" + text }</span>
          }
          return <span className="text-secondary">{ text }</span>
        },
        "8": function(value){
          const text = value.toFixed(2);
          if(value>1){
            return <span className="text-success">{ text }</span>
          }
          else if(value<1){
            return <span className="text-danger">{ text }</span>
          }
          return <span className="text-secondary">{ text }</span>
        },
        "9": function(value){
          if(value<=20){
            return <span className="text-danger">{ value }</span>
          }
          else if(value<=40){
            return <span className="text-warning">{ value }</span>
          }
          else if(value<=60){
            return <span className="text-secondary">{ value }</span>
          }
          else if(value<=80){
            return <span className="text-primary">{ value }</span>
          }
          return <span className="text-success">{ value }</span>
        }
      } : {
        "0": function(value){
          return value;
        },
        "1": function(value){
          return <strong>{ value }</strong>;
        },
        "2": function(value){
          return <div>
              <span className="margin-top-5 margin-right-5"><strong>{ value[0] }</strong></span>
              <span style={ { fontSize: "14px" } }><strong>{ value[1].toUpperCase() }</strong></span>
              <br/>
              <span className="text-secondary margin-left-5" style={ { fontSize: "12px" } }>
                { value[2].toUpperCase() } { " (" + value[3].toUpperCase() + ")" }
              </span>
          </div>
        },
        "3": function(value){
          const text = (value*100).toFixed(2) + "%";
          if(value>0){
            return <span className="text-success">{ "↑" + text }</span>
          }
          else if(value<0){
            return <span className="text-danger">{ "↓" + text }</span>
          }
          return <span className="text-secondary">{ text }</span>
        }
      }}/>
    );
  }
}
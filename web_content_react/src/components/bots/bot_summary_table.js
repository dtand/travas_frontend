import React from "react";
import ReactTooltip from "react-tooltip";
import ApiController from "../../js/ApiController";
import Constants from "../../js/Constants";

const FIXED_WIDTH={
  width:"18em",
  maxWidth:"18em"
}

const EVEN_COLOR = "#00000005";
const ODD_COLOR = "#00000000";

export default class BotSummaryTable extends React.Component {

  constructor(props){
    super(props);
    this.state={
      hovered:[false,false,false,false,false,false,false],
      bid: "..."
    }
    this.lastBotId   = 0;
    this.onMouseOut  = this.onMouseOut.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.getMaxBid   = this.getMaxBid.bind(this);
  }
  
  onMouseOver(index){
    this.state.hovered[index] = true;
    this.setState({
      hovered: this.state.hovered
    });
  }

  onMouseOut(index){
    this.state.hovered[index] = false;
    this.setState({
      hovered: this.state.hovered
    });
  }

  getTableRow(field, value, color, index, textColor){
    const self = this;
    const style = this.state.hovered[index] ?
    {
      backgroundColor: color
    } :
    {
      backgroundColor: color
    };

    if(this.props.metricsCallbacks && this.props.metricsCallbacks[field.toLowerCase()]){
      const func = this.props.metricsCallbacks[field.toLowerCase()];
      value    = func(value);
    }

    return (
      <div>
        <div className={ this.props.rowClass ? this.props.rowClass : "row border-bottom" }
            onMouseOver={ () => self.onMouseOver(index) } 
            onMouseOut={ () => self.onMouseOut(index) }
            style={ style }>
          <div className="col-md-8 text-left text-black margin-top-15 margin-bottom-15" style={FIXED_WIDTH}><strong>{ this.getTooltip(field) } { field }</strong></div>
          <div className={"col-md-4 text-left text-black margin-top-15 margin-bottom-15" + textColor}><strong>{value}</strong></div>
        </div>
      </div>
    );
  }

  getColor(index){
    if(index & 2 === 1){
      return EVEN_COLOR;
    }
    return ODD_COLOR;
  }

  getNumTrades(){
    if(this.props.bot.numTrades){
      return this.props.bot.numTrades;
    }
    return (this.props.bot.totalLosses + this.props.bot.totalWins);
  }

  getColor(value,threshold){
    if(value < threshold){
      return "text-black";
    }
    else if(value > threshold){
      return "text-black";
    }
    return "text-black";
  }

  getMaxBid(bids){
    let max = 0;
    for(let b=0;b<bids.length;b++){
      max = Math.max(bids[b].bid,max);
    }
    return max;
  }

  getTooltip(metric){
      return (<span>
      <a className="text-secondary fa fa-info-circle clickable"
        data-tip data-for={ metric + "-info" }/>
        <ReactTooltip id={ metric + "-info" } 
                      type="info" 
                      place="bottom" 
                      effect="solid"
                      className="react-tooltip-fixed">
        <span>{ Constants.METRICS_TOOLTIPS[metric] }</span>
      </ReactTooltip>
    </span>);
  }

  getTradingLimit(){

    const quote = this.props.bot.market.split("-")[1];

    if(this.props.bot.tradingLimitType === "PERCENT"){
      return (this.props.bot.tradingLimit*100)+"% of " + quote.toUpperCase();
    }
    else{
      return this.props.bot.tradingLimit + " " + quote.toUpperCase();
    }
  }

  componentDidUpdate(){
    const self = this;
    if(this.props.fields.includes("highest bid") && 
       this.lastBotId !== this.props.bot.id){
      this.lastBotId = this.props.bot.botId;
      ApiController.doPostWithToken(
        "get_market_bids",
        {
          "botId": this.props.bot.id
        },
        function(response){
          if(response.botsOffers.length!=0){
            self.setState({
              bid: self.getMaxBid(response.botsOffers)
            });
          }
          else{
            self.setState({
              bid: "NONE"
            });
          }
        }
      );
    }
  }

  render() {
    let c = 0;
    return (
      <div className="container">
        <div className="margin-top-20 margin-bottom-5">
          { this.props.fields.includes("owner") && this.getTableRow("OWNER", this.props.bot.username.toUpperCase(),this.getColor(c++),0,"text-black") }
          { this.props.fields.includes("name") && this.getTableRow("NAME", this.props.bot.name.toUpperCase(),this.getColor(c++),0,"text-black") }
          { this.props.fields.includes("strategy name") && this.getTableRow("STRATEGY", this.props.bot.strategy.name,this.getColor(c++),1,"text-black") }
          { this.props.fields.includes("score") && this.getTableRow("TRAVAS SCORE", this.props.bot.score,this.getColor(c++),3,"text-black") }
          { this.props.fields.includes("avg roi") && this.getTableRow("AVG ROI",this.props.bot.avgRoi !== undefined ? (this.props.bot.avgRoi*100).toFixed(2)+"%" : (this.props.bot.averageROI*100).toFixed(2)+"%",this.getColor(c++),4,this.getColor(parseFloat(this.props.bot.averageROI),0)) }
          { this.props.fields.includes("wins") && this.getTableRow("WINS", this.props.bot.totalWins,this.getColor(c++),5,"text-black") }
          { this.props.fields.includes("losses") && this.getTableRow("LOSSES", this.props.bot.totalLosses,this.getColor(c++),6,"text-black") }
          { this.props.fields.includes("trades") && this.getTableRow("TRADES", this.getNumTrades(),this.getColor(c++),7,"text-black") }
          { this.props.fields.includes("win/loss") && this.getTableRow("WIN/LOSS", Number(this.props.bot.winLoss).toFixed(2),this.getColor(c++),8,this.getColor(parseFloat(this.props.bot.winLoss),1.00)) }
          { this.props.fields.includes("expectancy") && this.getTableRow("EXPECTANCY", (this.props.bot.expectancy*100).toFixed(2)+"%", this.getColor(c++),9,this.getColor(parseFloat(this.props.bot.expectancy),0)) }
          { this.props.fields.includes("profit factor") && this.getTableRow("PROFIT FACTOR", this.props.bot.profitFactor,this.getColor(c++),10,this.getColor(parseFloat(this.props.bot.profitFactor),1.00)) }
          { this.props.fields.includes("best trade") && this.getTableRow("BEST TRADE", (this.props.bot.bestTrade*100).toFixed(2)+"%",this.getColor(c++),11,"text-black") }
          { this.props.fields.includes("worst trade") && this.getTableRow("WORST TRADE", (this.props.bot.worstTrade*100).toFixed(2)+"%",this.getColor(c++),12,"text-black") }
          { this.props.fields.includes("max drawdown") && this.getTableRow("MAX DRAWDOWN", (this.props.bot.maxDrawdown*100).toFixed(2)+"%",this.getColor(c++),13,this.getColor(parseFloat(this.props.bot.averageROI),this.props.bestTrade*-1)) }
          { this.props.fields.includes("trading lim") && this.getTableRow("TRADING LIM.", this.getTradingLimit(),this.getColor(c++),14,"text-black") }
          { this.props.fields.includes("interval") && this.getTableRow("INTERVAL", this.props.bot.interval.toUpperCase(),this.getColor(c++),15,"text-black") }
          { this.props.fields.includes("highest bid") && this.getTableRow("HIGHEST BID", this.state.bid,this.getColor(c++),16,"text-black") }
        </div>
    </div>
    );
  }
}


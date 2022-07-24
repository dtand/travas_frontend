import React from "react";
import AlphaField from "./alpha_field";
import ApiController from "../js/ApiController"

const INTERVAL = 60000;

/**
 * Defines the alpha summary component which contains information
 * about the alpha state
 */
export default class AlphaSummary extends React.Component {

  /**
   * Setup state and link function bindings
   * @param {*} props 
   */
  constructor (props){
    
    super(props);
    
    this.state = {
      alpha_users: '',
      active_bots: '',
      trades_count: ''
    };
  
    this.updateAlphaSummary = this.updateAlphaSummary.bind(this);
  }

  /**
   * Takes in alpha_summary response and updates component state
   * @param {object} fields 
   */
  async updateAlphaSummary(fields) {
    this.setState({
        alpha_users: fields.alphaUsersCount,
        active_bots: fields.activeBotsCount,
        trades_count: fields.tradesCount
      }
    )
  }

  /**
   * Called on mount to update state
   */
  componentDidMount() {
    const self = this;
    ApiController.doGet("alpha_summary", self.updateAlphaSummary);
    setInterval(function(){
        ApiController.doGet("alpha_summary", self.updateAlphaSummary);
      }, INTERVAL
  );
  }

  /**
  * Renders a divider with alpha user's field, active bots field and total trades 
  */
  render() {
    return (
      <div className="row text-center">
        <AlphaField label="Alpha Users" text={this.state.alpha_users} id="alphaUsersCount"/>
        <AlphaField label="Active Bots" text={this.state.active_bots} id="activeBotsCount"/>
        <AlphaField label="Total Trades" text={this.state.trades_count} id="tradesCount"/>
      </div>
    );
  }
}

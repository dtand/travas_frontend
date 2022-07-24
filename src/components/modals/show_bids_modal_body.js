import React from "react";
import ClickableTable from "../generic/clickable_table"
import ModalController from "../../js/ModalController"

export default class ShowBidsModalBody extends React.Component {

  constructor(props){
    super(props);
    this.state={
      selectedBot: 0,
      deleting: []
    }
    this.onSelectBid = this.onSelectBid.bind(this);
    this.getAction   = this.getAction.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.setDelete = this.setDelete.bind(this);
  }

  getRoiText(roi){

    if(roi < 0){
      return <span className="text-danger">
              { " ↓" + (parseFloat(roi)*100).toFixed(2) + "%" }
             </span>
    }
    else if(roi > 0){
      return <span className="text-success">
              { " ↑" + (parseFloat(roi)*100).toFixed(2) + "%" }
             </span>
    }
    return <span className="text-secondary">
            { " " + (parseFloat(roi)*100).toFixed(2) + "%" }
           </span>
  }

  getBotDescription(bids){
    if(bids.length === 0 ||  
       this.state.selectedBot > bids.length || 
       this.state.selectedBot < 0){
      return (
        <h1 className="text center text-secondary">
          You currently have no active bids.
        </h1>
      );
    }
    else{
      if(this.state.selectedBot === 
         ModalController.getData("showBidsModal").bids.length){
        this.setState({
          selectedBot: Math.max(0,this.state.selectedBot-1)
        });
        return;
      }
      const bot = bids[this.state.selectedBot].metrics;
      return(
        <div className="container">
          <h1 className="text-center text-primary">
            { bot.botName.toUpperCase() }
          </h1>
          <h2 className="text-center text-secondary">
            { bot.market.toUpperCase() + "" }{ this.getRoiText(parseFloat(bot.roi))  }
          </h2>
        </div>
      );
    }
  }

  onSelectBid(data,index){
    if(this.state.deleting.includes(index)){
      return;
    }
    this.setState({
      selectedBot: index
    });
  }

  getStatusText(status){
    if( status.toLowerCase() === "pending"){
      return <span className="text-secondary">
              { status.toUpperCase() }
             </span>
    }

    else if( status.toLowerCase() === "accepted"){
      return <span className="text-success">
              { status.toUpperCase() }
             </span>
    }

    else if( status.toLowerCase() === "denied"){
      return <span className="text-danger">
              { status.toUpperCase() }
             </span>
    }
  }

  removeNotification(index,numBids){
    this.state.deleting.splice(
      this.state.deleting.indexOf(index),
      1
    );
    this.setState({
      deleting: this.state.deleting,
      selectedBot: Math.max(this.state.selectedBot - 1,0)
    });
  }

  setDelete(index){
    this.state.deleting.push(index);
    if(this.state.selectedBot === index){
      this.setState({
        deleting: this.state.deleting,
        selectedBot: Math.max(0,this.state.selectedBot-1)
      });
    }
    else{
      this.setState({
        deleting: this.state.deleting
      });
    }
  }

  getAction(bid,index,numBids){
    const self = this;
    if(bid.status.toLowerCase() === "pending"){
      return (<a href="#" 
                 onClick={ function(){ 
                    self.setDelete(index);
                    ModalController.getData("showBidsModal").cancelBid(bid,
                      function(){
                        self.removeNotification(index,numBids)
                      }, index)}
                   }>
                    CANCEL
              </a>);
    }
    else if(bid.status.toLowerCase() === "accepted" || 
            bid.status.toLowerCase() === "denied" ){
      return (<a href="#" 
                  onClick={ function(){ 
                    self.setDelete(index);
                    ModalController.getData("showBidsModal").dismissBid(bid,function(){
                      self.removeNotification(index,numBids)
                    },index)}
                    }>
                    DISMISS
              </a>);
    }
  }

  buildTableData(bids){
    if( bids.length === 0){
      return (
        <div/>
      );
    }
    else{
      let tableData = [];
      for(let r=0;r<bids.length;r++){
        if(!this.state.deleting.includes(r)){
          const value = bids[r];
          tableData.push([
            value.metrics.botName,
            value.bid,
            this.getStatusText(value.status),
            this.getAction(value,r,bids.length)
          ]);
        }
        else if(this.state.deleting.includes(r)){
          tableData.push([
            <strong className="text-danger"> DELETING... </strong>,
            "",
            "",
            ""
          ]);
        }
      }
      return tableData;
    }
  }
  render() {

    const bids = ModalController.getData("showBidsModal").bids;
  
    return (
        <div class="modal-body">
          <div class="row text-center">
            { this.getBotDescription(bids) }
            <br/>
            <br/>
            { bids.length !=0 && 
              <div className="container">
                <ClickableTable
                  header={[
                    "BOT",
                    "BID",
                    "STATUS",
                    "ACTION"
                  ]}
                  onClick={ this.onSelectBid }
                  rows={ this.buildTableData(bids)  }
                  align="left"
                  defaultSelectedRow={ 0 }
                /> 
              </div>
            }
          </div>
        </div>
    );
  }
}


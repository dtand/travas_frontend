import React from "react";
import ClickableTable from "../generic/clickable_table"
import ModalController from "../../js/ModalController"
import IconHeader from "../generic/icon_header"

export default class ShowOffersModalBody extends React.Component {

  constructor(props){
    super(props);
    this.state={
      selectedBot: 0,
      deleting: []
    }

    this.offers        = [];
    this.onSelectOffer = this.onSelectOffer.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.setDelete = this.setDelete.bind(this);
    this.updateOffers = this.updateOffers.bind(this);
  }

  updateOffers(offers){
    ModalController.updateData(
      "showOffersModal",{
        offers: offers
      }
    );
    this.onSelectOffer(undefined,this.state.selectedBot);
  }

  getBotDescription(offers){
    if(offers.length === 0 || 
       this.state.selectedBot > offers.length){
      return (
        <h1 className="text center text-secondary">
          You currently have no pending offers.
        </h1>
      );
    }
    else{
      if(this.state.selectedBot === 
        ModalController.getData("showOffersModal").offers.length){
       this.setState({
         selectedBot: Math.max(0,this.state.selectedBot-1)
       });
       return;
     }
      const bot = offers[this.state.selectedBot];
      return(
        <div className="container">
          <h1 className="text-center text-primary">
            { bot.metrics.botName }
          </h1>
          <h2 className="text-center text-secondary">
            { bot.metrics.market + " BID: " }{ bot.bid  }
          </h2>
        </div>
      );
    }
  }


  onSelectOffer(data,index){
    if(this.state.deleting.includes(index)){
      return;
    }
    this.setState({
      selectedBot: index
    });
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

  buildTableData(offers){
    const self = this;
    if( offers.length === 0){
      return (
        <div/>
      );
    }
    else{
      let tableData = [];
      for(let r=0;r<offers.length;r++){
        if(!this.state.deleting.includes(r)){
          const value = offers[r];
          tableData.push([
            value.metrics.botName,
            value.bid,
            <a className="text-success"
               href="#" 
               onClick={ function(){ 
               self.setDelete(r);
               ModalController.getData("showOffersModal").acceptOffer(value,function(){
                self.removeNotification(r,offers.length)
              })}
              }>
               ACCEPT
         </a>,
        <a  className="text-danger"
        href="#" 
        onClick={ function(){ 
            self.setDelete(r);
            ModalController.getData("showOffersModal").cancelOffer(value,function(){
              self.removeNotification(r,offers.length)
            })}
          }>
            DECLINE
      </a>
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

    this.offers = ModalController.getData("showOffersModal").offers;
  
    return (
        <div class="modal-body">
          <div class="row text-center">
            { this.getBotDescription(this.offers) }
            <br/>
            <br/>
            { this.offers.length !=0 && 
              <div className="container">
                <ClickableTable
                  header={[
                    "BOT",
                    <IconHeader header="OFFER" iconClass="fa fa-sort" anchor="right" textClass="text-left clickable"/>,
                    "",
                    ""
                  ]}
                  sortable={[
                    false,
                    true,
                    false,
                    false
                  ]}
                  onSort={[
                    undefined,
                    this.updateOffers,
                    undefined,
                    undefined
                  ]}
                  onClick={ this.onSelectOffer }
                  rows={ this.buildTableData(this.offers)  }
                  mappedData={ this.offers }
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


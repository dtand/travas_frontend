import React from "react"
import Modal from "../modals/modal"
import TabMenu from "../platform/tab_menu"
import GroupsTab from "./groups_tab"
import AlertsTab from "./alerts_tab"
import ApiController from "../../js/ApiController"
import NotificationController from "../../js/NotificationController"
import ModalController from "../../js/ModalController"

const MODAL_ID_CREATE_GROUP = "createGroupModal"
const MODAL_ID_DELETE_GROUP = "deleteGroupModal"
const MODAL_ID_REMOVE_USER  = "removeUserModal"
const MODAL_ID_PROMOTE_USER  = "promoteUserModal"

export default class GroupsService extends React.Component {

  constructor(props){
    
    super(props);
    
    this.state={
      currentTab: 0,
      selectedGroup: 0
    }

    this.updateTab = this.updateTab.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.saveStrategy = this.saveStrategy.bind(this);
    this.saveStrategySuccess = this.saveStrategySuccess.bind(this);
    this.saveBot = this.saveBot.bind(this);
    this.saveBotSuccess = this.saveBotSuccess.bind(this);
    this.joinGroup = this.joinGroup.bind(this);
    this.removeBot = this.removeBot.bind(this);
    this.removeInvite = this.removeInvite.bind(this);
    this.removeStrategy = this.removeStrategy.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.onCreateGroupSuccess = this.onCreateGroupSuccess.bind(this);
    this.onDeleteGroupSuccess = this.onDeleteGroupSuccess.bind(this);
    this.onDeleteMemberSuccess = this.onDeleteMemberSuccess.bind(this);
    this.onPromoteMemberSuccess = this.onPromoteMemberSuccess.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
    this.onLeaveGroupSuccess = this.onLeaveGroupSuccess.bind(this);
    this.getStrategyWithId = this.getStrategyWithId.bind(this);

    this.createGroupSubmit = this.createGroupSubmit.bind(this);
    this.deleteGroupSubmit = this.deleteGroupSubmit.bind(this);
    this.removeUserSubmit  = this.removeUserSubmit.bind(this);
    this.promoteUserSubmit = this.promoteUserSubmit.bind(this);
  }

  getStrategyWithId(id){
    for(let s=0;s<this.props.userStrategies.length;s++){
      const strategy = this.props.userStrategies[s];
      if(strategy.id === id){
        return strategy;
      }
    }
    return undefined;
  }

  updateGroup(index){
    this.setState({
      selectedGroup: index
    });
  }

  removeStrategy(response,params){
    this.props.removeSharedItem("strategy",params.index);
    params.alerts.finishProcessing(params.index);
  }

  removeBot(response,params){
    this.props.removeSharedItem("bot",params.index);
    params.alerts.finishProcessing(params.index);
  }

  removeInvite(response,params){
    this.props.removeSharedItem("invite",params.id);
    if(params.group){
      let group = params.group;
      group.members.push(this.props.userInfo.username);
      NotificationController.displayNotification(
        "GROUP JOINED!",
        "Congratuations, you are now officially a part of " + params.group.groupName,
        "info"
      );
      this.props.appendGroup(group);
      params.alerts.finishProcessing(params.index);
    }
  }

  saveStrategySuccess(response,params){
    let strategy = params.strategy;
    strategy.name = strategy.strategyName;
    this.props.appendStrategy(strategy);
    if(!params.bot){
      const payload = {
        "key": params.shareId,
        "item": "strategy"
      }
      ApiController.doPostWithToken(
        "dismiss_item",
        payload,
        this.removeStrategy,
        {
          index: params.alertIndex,
          alerts: params.alerts
        }
      );
      NotificationController.displayNotification( 
        "STRATEGY SAVED",
        params.strategyName.toUpperCase() + " has been added to your strategy manager",
        "info" 
      );
      return;
    }
    if(params.bot){
      this.saveBot(response.id,params);
    }
  }

  saveStrategy(alert,alertIndex,bot,alerts){
    const strategy = bot ? bot.strategy : alert.strategy;
    const shareId  = bot ? alert.id : strategy.id; 
    const payload={
      "strategyName": strategy.name,
      "buySignals": strategy.buySignals,
      "stopLoss": strategy.stopLoss,
      "description": strategy.description,
      "sellSignals": strategy.sellSignals,
      "targets":[]
    }
    ApiController.doPostWithToken(
      "save_strategy",
      payload,
      this.saveStrategySuccess,{
      "strategyName": strategy.name,
      "strategyId": strategy.id,
      "alertIndex": alertIndex,
      "shareId": shareId,
      "strategy": payload,
      "alerts": alerts,
      "bot": bot ? bot : undefined
    });
  }

  saveBotSuccess(response,params){
    ApiController.doPostWithToken(
      "dismiss_item",
      {
        "key": params.shareId,
        "item": "bot"
      },
      this.removeBot,
      {
         index: params.alertIndex,
         alerts: params.alerts
      }
    );
    NotificationController.displayNotification( 
      "BOT SAVED",
      params.botName.toUpperCase() + " has been added to your bot manager.",
      "info" 
    );
    
    let strategy = params.strategy;
    strategy.name = strategy.strategyName;
    const userBot = {
      avgRoi: 0,
      exchange: params.bot.exchange,
      id: response.id,
      interval: params.bot.interval,
      isSimulated: true,
      market: params.bot.base + "-" + params.bot.quote,
      name: params.bot.botName,
      numTrades: 0,
      rank: '?',
      roi: 0,
      running: false,
      strategyId: params.strategyId,
      public: true,
      strategy: strategy,
      totalLosses: 0,
      totalWins: 0,
      tradingLimit: params.bot.tradingLimit,
      winLoss: 0
    }
    this.props.appendBot(userBot);
  }

  saveBot(strategyId,params){
    const bot     = params.bot;
    const shareId = params.bot.botId;
    const payload = {
      "strategyId": strategyId, 
      "botName" : bot.botName,
      "private" : false,
      "tradingLimit": 1.0, 
      "exchange": bot.exchange,
      "baseCurrency": bot.base, 
      "counterCurrency": bot.quote, 
      "isSimulated": true,
      "interval": "1h" }
    ApiController.doPostWithToken(
      "save_bot",
      payload,
      this.saveBotSuccess,
      {
        "botId": bot.botId,
        "botName": bot.botName,
        "alertIndex": params.alertIndex,
        "shareId": shareId,
        "strategy": params.strategy,
        "strategyId": params.strategyId,
        "bot": bot
      });
  }

  joinGroup(group,index,alerts){
    const payload = {
      "key": group.groupName, 
      "item": "invite",
      "accepted": true 
    }
    ApiController.doPostWithToken(
    "dismiss_item",
    payload, 
    this.removeInvite,
    { 
      index: index,
      group: group,
      alerts: alerts
    });
  }

  updateTab(newTab){
    this.setState({
      currentTab: newTab,
    });
  }

  getTab(){
    if(this.state.currentTab === 0) {
      return <GroupsTab createGroup={ this.createGroup }
                        deleteGroup={ this.deleteGroup }
                        leaveGroup={ this.leaveGroup }
                        selectedGroup={ this.state.selectedGroup }
                        selectedUser={ this.state.selectedUser }
                        updateGroup={ this.updateGroup }
                        userInfo={ this.props.userInfo }
                        removeUserSubmit={ this.removeUserSubmit }
                        promoteUserSubmit={ this.promoteUserSubmit }/>
    }
    else if(this.state.currentTab === 1) {
      return <AlertsTab sharedItems={ this.props.sharedItems }
                        saveStrategy={ this.saveStrategy }
                        joinGroup={ this.joinGroup }
                        removeBot={ this.removeBot }
                        removeStrategy={ this.removeStrategy }
                        removeInvite={ this.removeInvite }/>
    }
  }

  onCreateGroupSuccess(response,group){
    ModalController.hideModal(
      MODAL_ID_CREATE_GROUP
    );
    NotificationController.displayNotification(
      "Group Created",
      "You are now the admin of group: " + group.groupName,
      "info"
    );
    this.props.appendGroup({
      groupName: group.groupName,
      admin: this.props.userInfo.username,
      description: group.description,
      members: [this.props.userInfo.username]
    });
  }

  onDeleteGroupSuccess(response,group){
    ModalController.hideModal(
      MODAL_ID_DELETE_GROUP
    );
    this.props.removeGroup(this.state.selectedGroup);
    this.setState({
      selectedGroup: 0
    });
    NotificationController.displayNotification(
      "Group Deleted",
      group.groupName + " has been removed from existence",
      "info"
    );
  }

  onDeleteMemberSuccess(response,params){
    ModalController.hideModal(
      MODAL_ID_DELETE_GROUP
    );
    ModalController.getData(MODAL_ID_REMOVE_USER).getNextUser(params.member);
    for(let m=0;m<this.props.userInfo.groups[this.state.selectedGroup].members.length;m++){
      if(this.props.userInfo.groups[this.state.selectedGroup].members[m].toUpperCase() === params.member.toUpperCase()){
        this.props.userInfo.groups[this.state.selectedGroup].members.splice(m,1);
        this.props.removeGroupMember(this.state.selectedGroup,m);
        break;
      }
    }
    NotificationController.displayNotification(
      "Group Deleted",
      params.member + " has been removed from " + params.groupName,
      "info"
    );
  }

  onPromoteMemberSuccess(response,params){
    ModalController.hideModal(
      MODAL_ID_DELETE_GROUP
    );
    let group   = this.props.userInfo.groups[this.state.selectedGroup];
    group.admin = params.member;
    this.props.updateGroup(this.state.selectedGroup,group);
    NotificationController.displayNotification(
      "Admin Changed",
      params.member + " has been promoted to admin status ",
      "info"
    );
  }

  createGroup(){
    ModalController.showModal(
      MODAL_ID_CREATE_GROUP,
      {
        createGroupSubmit: this.createGroupSubmit
      }
    );
  }

  createGroupSubmit(){
    const groupName   = document.getElementById("groupNameInput").value;
    const description = document.getElementById("descriptionArea").value;
    const payload = {
      "groupName": groupName,
      "description": description
    }
    ApiController.doPostWithToken(
      "create_group",
      payload,
      this.onCreateGroupSuccess, 
      payload
    );
  }

  deleteGroup(){
    ModalController.showModal(
      MODAL_ID_DELETE_GROUP, { 
        deleteGroupSubmit: this.deleteGroupSubmit,
        groupName: this.props.userInfo.groups[this.state.selectedGroup].groupName
      }
    );
  }

  deleteGroupSubmit(){
    const groupName = document.getElementById("groupNameInput").value;
    const groupNameActual = ModalController.getData(MODAL_ID_DELETE_GROUP).groupName;
    if(groupNameActual.toLowerCase() != groupName.toLowerCase()){
      NotificationController.displayNotification(
        "Wrong name",
        "Inserted group name does not match name of group to delete",
        "error"
      );
      return;
    }
    const payload = {
      "groupName": groupName,
    }
    ApiController.doPostWithToken("delete_group",payload,this.onDeleteGroupSuccess, payload);
  }
  
  leaveGroup(){
    const groupName    = this.props.userInfo.groups[this.state.selectedGroup].groupName;
    const member       = this.props.userInfo.username;
    const action       = "DELETE";
    const payload = {
      "groupName": groupName,
      "member": member,
      "action": action
    }
    ApiController.doPostWithToken(
      "edit_group_member",
      payload,
      this.onLeaveGroupSuccess, 
      payload);
  }

  onLeaveGroupSuccess(response,group){
    this.props.removeGroup(this.state.selectedGroup);
    this.setState({
      selectedGroup: 0
    });
    NotificationController.displayNotification(
      "LEFT GROUP",
      " You are no longer a member of " + group.groupName,
      "info"
    );
  }

  removeUserSubmit(){
    const groupName    = this.props.userInfo.groups[this.state.selectedGroup].groupName;
    const member       = document.getElementById("removeUserInput").value;
    const actualMember = ModalController.getData(MODAL_ID_REMOVE_USER).member;
    const action       = "DELETE";
    if(member.toLowerCase() != actualMember.toLowerCase()){
      NotificationController.displayNotification(
        "Wrong name",
        "Inserted member does not match name of member to delete",
        "error"
      );
      return;
    }

    const payload = {
      "groupName": groupName,
      "member": member,
      "action": action
    }

    ApiController.doPostWithToken(
      "edit_group_member",
      payload,
      this.onDeleteMemberSuccess, 
      payload
    );
  }

  promoteUserSubmit(){
    const groupName = this.props.userInfo.groups[this.state.selectedGroup].groupName;
    const member    = document.getElementById("promoteUserInput").value;
    const actualMember = ModalController.getData(MODAL_ID_PROMOTE_USER).member;
    const action    = "PROMOTE";
    if(member.toLowerCase() != actualMember.toLowerCase()){
      NotificationController.displayNotification(
        "Wrong name",
        "Inserted member does not match name of member to delete",
        "error"
      )
      return;
    }
    const payload = {
      "groupName": groupName,
      "member": member,
      "action": action
    }
    ApiController.doPostWithToken(
      "edit_group_member",
      payload,
      this.onPromoteMemberSuccess,
      payload
    );
  }

  countAlerts(){
    if( !this.props.sharedItems){
      return 0;
    }
    return (
      this.props.sharedItems.strategies.length + 
      this.props.sharedItems.bots.length +
      this.props.sharedItems.invites.length
    );
  }
  render() {
    const self = this;
    return (
      <div>
        <div>
          <TabMenu updateTab={ this.updateTab }
                   currentTab={ this.state.currentTab } 
                   tabs={ [
            { 
              name: "GROUPS"
            }, 
            { 
              name: "ALERTS " + this.countAlerts()
            }
            ] }/>
          <div class="tab-content">
            { 
              this.getTab()
            }
          </div>
        </div>
      </div>
    );
  }
}

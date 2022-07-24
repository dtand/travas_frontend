import React from "react"
import FilterTable from "../generic/filter_table"
import ApiController from "../../js/ApiController"
import Dropdown from "../generic/dropdown"
import IconHeader from "../generic/icon_header"
import HoverIcon from "../generic/hover_icon"
import ModalController from "../../js/ModalController"
import NotificationController from "../../js/NotificationController"
import Loader from "../generic/loader";

const TAB_MARGIN = {
  marginTop: "5px",
  marginLeft: "15px",
  marginRight: "15px"
}

export default class GroupsTab extends React.Component {

  constructor(props){
    super(props);
    this.state={
      selectedUser: undefined,
      selecteduserInfo: undefined,
      invitingUser: false
    };

    this.updateGroup = this.updateGroup.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getUserInfoSuccess = this.getUserInfoSuccess.bind(this);
    this.selectUser = this.selectUser.bind(this);
    this.inviteUser = this.inviteUser.bind(this);
    this.inviteUserSuccess = this.inviteUserSuccess.bind(this);
    this.promoteUser = this.promoteUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.getNextUser = this.getNextUser.bind(this);
  }

  isAdmin(group,username){
    return group.admin.toLowerCase() === username.toLowerCase();
  }

  promoteUser(){
    ModalController.showModal("promoteUserModal",{
      member: this.state.selectedUser,
      promoteUserSubmit: this.props.promoteUserSubmit
    });
  }

  getNextUser(user){
    for(let u=0;u<this.props.userInfo.groups[this.props.selectedGroup].members.length;u++){
      const member = this.props.userInfo.groups[this.props.selectedGroup].members[u];
      if(user.toLowerCase() === member && 
         u+1 != this.props.userInfo.groups[this.props.selectedGroup].members.length)
         {
          this.setState({
            selectedUser: this.props.userInfo.groups[this.props.selectedGroup].members[u+1]
          });
          return;
         }
      else if(user.toLowerCase() === member && u != 0){
        this.setState({
          selectedUser: this.props.userInfo.groups[this.props.selectedGroup].members[u-1]
        });
        return;
      }
    }

    this.setState({
      selectedUser: this.props.userInfo.username
    });

  }

  removeUser(){
    ModalController.showModal("removeUserModal",{
      member: this.state.selectedUser,
      getNextUser: this.getNextUser,
      removeUserSubmit: this.props.removeUserSubmit
    });
  }

  inviteUserSuccess(response,params){
    NotificationController.displayNotification(
      "INVITE SENT!",
      params.user + " has been invited to join " + params.groupName,
      "info"
    );
    this.setState({
      invitingUser: false
    });
  }

  inviteUser(){
    const user = document.getElementById("inviteUserInput").value;
    const payload = {
      "user": user,
      "groupName": this.props.userInfo.groups[this.props.selectedGroup].groupName
    }
    if(this.props.userInfo.groups[this.props.selectedGroup].members.indexOf(user) !== -1){
      NotificationController.displayNotification(
        "IN GROUP",
        user.toUpperCase() + " is already in this group",
        "info"
      );
      return;
    }
    this.setState({
      invitingUser: true
    });
    const self = this;
    ApiController.doPostWithToken(
      "invite_user",
      payload,
      this.inviteUserSuccess,
      payload,
      () => {
        self.setState({
          invitingUser: false
        });
      }
    );
  }

  updateGroup(groupName,index){
    this.props.updateGroup(index);
  }

  buildDropdown(){
    let groups = [];
    for(let g=0;g<this.props.userInfo.groups.length;g++){
      groups.push(this.props.userInfo.groups[g].groupName);
    }
    return groups;
  }

  buildTable(group){
    let table = [];
    for(let m=0;m<group.members.length;m++){
      if(!this.isAdmin(group,group.members[m])){
        table.push(["#"+(m+1),group.members[m].toUpperCase(),<span><i className="fa fa-user text-primary"/>{ " MEMBER" }</span>]);
      }
      else{
        table.push(["#"+(m+1),group.members[m].toUpperCase(),<span><i className="fa fa-star text-primary"/>{ " ADMIN" }</span>]);
      }
    }
    return table;
  }

  getGroup(){
    if(this.props.userInfo.groups != undefined && this.props.userInfo.groups.length != 0){
      return this.props.userInfo.groups[this.props.selectedGroup];
    }
    return undefined;
  }

  getUserInfoSuccess(response){
    this.setState({
      selecteduserInfo: response,
      loadingUser: false
    });
  }
  
  getUserInfo(){
    if(!this.state.selectedUser){
      this.state.selectedUser = this.props.userInfo.username;
    }
    const payload = {
      "user": this.state.selectedUser
    }
    this.setState({
      loadingUser: true
    });
    ApiController.doPostWithToken("user_info", payload, this.getUserInfoSuccess);
  }

  selectUser(row){
    this.state.selectedUser = row[1];
    this.getUserInfo();
  }

  getAge( date1, date2 ) {
    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;
  
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
  
    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
      
    // Convert back to days and return
    return Math.round(difference_ms/one_day); 
  }

  componentDidUpdate(){
    if(!this.state.selectedUser){
      this.getUserInfo();
    }
  }

  render() {

    const group = this.getGroup();

    if( group && !this.state.selectedUser){
      this.getUserInfo();
    }

    return (
      <div class="tab-pane active show" style={ TAB_MARGIN }>
      <br/>
        { group && 
          <div>
            <div className="row border-bottom theme-banner-one">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-4">
                    <Dropdown id="groupsDropdown"
                              dropdownList={ this.buildDropdown() }
                              header={ <IconHeader textClass="text-center"
                                                  iconClass="fa fa-users"
                                                  anchor="left"
                                                  header="GROUPS"/> }
                              onClickRow={ this.updateGroup }
                              buttonText={ group.groupName }/>
                  </div>
                  <div className="col-s-2" style={{marginRight:"10px"}}>
                    <button className="btn btn-primary" onClick={ this.props.createGroup }>
                      <IconHeader textClass="text-left"
                                  iconClass="fa fa-plus"
                                  anchor="left"
                                  header="CREATE"/>
                    </button>
                  </div>
                  { this.isAdmin(group,this.props.userInfo.username) && 
                    <div>
                      <div className="col-s-2">
                        <button className="btn btn-danger" onClick={ this.props.deleteGroup }>
                          <IconHeader textClass="text-left"
                                      iconClass="fa fa-times-circle"
                                      anchor="left"
                                      header="DELETE"/>
                        </button>
                      </div>
                    </div> }
                    { !this.isAdmin(group,this.props.userInfo.username) && 
                    <div>
                      <div className="col-s-2">
                        <button className="btn btn-danger" onClick={ this.props.leaveGroup }>
                          <IconHeader textClass="text-left"
                                      iconClass="fa fa-times-circle"
                                      anchor="left"
                                      header="LEAVE"/>
                        </button>
                      </div>
                    </div> }
                </div>
                <br/>
                <div className="row">
                  <div className="col-md-12 text-left">
                    <h1>{ group.groupName.toUpperCase() }</h1>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 text-left text-secondary">
                    <h2>{ "MEMBERS - " + group.members.length }</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 text-left text-secondary" style={ {marginBottom:"10px"} }>
                    <i> { group.description } </i>
                  </div>
                </div>
                <div className="row" style={ {marginTop:"40px"} }>
                  <div className="col-md-8">
                      <input  type="text" 
                              id="inviteUserInput" 
                              name="investment" 
                              class="form-control text-secondary font-weight-bold" 
                              placeholder="Insert Username or Email..."/>
                  </div>
                  <div className="col-md-2" style={{marginRight:"10px"}}>
                      <button className="btn btn-primary" onClick={ this.inviteUser }>
                        { !this.state.invitingUser && 
                          <IconHeader textClass="text-left"
                                    iconClass="fa fa-paper-plane-o"
                                    anchor="left"
                                    header="INVITE"/>
                        }
                        { this.state.invitingUser && 
                          <IconHeader textClass="text-left"
                            iconClass="fa fa-spin fa-spinner"
                            anchor="left"
                            header="SENT"/>
                        }
                      </button>
                  </div>
                  <br/>
                </div>
              </div>
              <div className="col-md-6 text-left border margin-bottom-50">
                { this.state.selecteduserInfo && !this.state.loadingUser &&
                  <div className="container user-description-box">
                    <div className="row" style={{marginTop:"10px"}}>
                      <div className="col-md-10">
                        <h2 className="text-black"> { this.state.selectedUser.toUpperCase() } </h2>
                      </div>
                      { this.isAdmin(group,this.props.userInfo.username) && 
                        this.state.selectedUser.toLowerCase() != group.admin.toLowerCase() &&
                          <div className="col-md-1" onClick={ this.promoteUser }>
                            <HoverIcon icon="fa-level-up" info=""/>
                          </div> 
                      }{ this.isAdmin(group,this.props.userInfo.username) &&
                         this.state.selectedUser.toLowerCase() != group.admin.toLowerCase() &&
                          <div className="col-md-1" onClick={ this.removeUser }>
                            <HoverIcon icon="fa-times-circle" info=""/>
                          </div>
                      }
                    </div>
                    <table className="table">
                      <tbody align="left">
                        <tr> <td><h5 className="text-black">PROFILE AGE</h5></td> <td><h5 className="text-black">{ 
                          this.getAge( new Date(this.state.selecteduserInfo.signupDate), new Date()) + " DAYS"
                        }</h5></td> </tr>
                        <tr> <td><h5 className="text-black">BOTS </h5></td> <td><h5 className="text-black">{ this.state.selecteduserInfo.botCount }</h5></td> </tr>
                        <tr> <td><h5 className="text-black">STRATEGIES </h5></td> <td className="text-black"><h5 className="text-black">{ this.state.selecteduserInfo.strategiesCount }</h5></td> </tr>
                        <tr> <td><h5 className="text-black">HIGHEST RANK </h5></td> <td className="text-black"><h5 className="text-black">{ this.state.selecteduserInfo.bestBotRank }</h5></td> </tr>
                      </tbody>
                    </table>
                  </div>
                  }
                  {
                    this.state.loadingUser &&
                    <div className="container">
                      <br/><br/>
                      <h1 className="text-primary text-center">
                        <i className="fa fa-spin fa-spinner margin-top-100"/>
                      </h1>
                      <br/><br/><br/><br/>
                    </div>
                  }
              </div>
            </div>
            <br/>
            <FilterTable header={[
                                  "#NUM",
                                  "USERNAME",
                                  "STATUS"
                                ]}
                        sortable={[
                          false,
                          false,
                          false
                        ]}
                        align="left"
                        data={ this.buildTable(group) }
                        onClick={ this.selectUser }
                                />
            <br/><br/><br/><br/>
          </div>
        }
        {
          !group && 
          <div className="container">
            <br/><br/><br/>
            <strong>
              <h1 className="text-secondary text-center"> You currently are not a part of any groups, click below
                to create one.
              </h1>
            </strong>
            <br/>
            <div className="row text-center">
              <div className="col-md-12 text-center">
                <button className="btn btn-primary" onClick={ this.props.createGroup }>
                  <IconHeader textClass="text-left"
                              iconClass="fa fa-plus"
                              anchor="left"
                              header="CREATE"/>
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

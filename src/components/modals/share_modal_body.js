import React from "react";
import FilterTable from "../generic/filter_table";
import ModalController from "../../js/ModalController";
import Dropdown from "../generic/dropdown";
import IconHeader from "../generic/icon_header";

export default class ShareModalBody extends React.Component {

  constructor(props){
    super(props);
    this.state={
      selectedUser: "",
      selectedGroup: this.props.userInfo.groups[0]
    }
    this.selectGroup = this.selectGroup.bind(this);
    this.selectUser  = this.selectUser.bind(this);
    this.buildGroupsDropdown = this.buildGroupsDropdown.bind(this);
    this.buildTableData = this.buildTableData.bind(this);
  }

  selectGroup(groupName,index){
    this.setState({
      selectedGroup: this.props.userInfo.groups[index]
    });
  }

  selectUser(row){
    this.setState({
      selectedUser: row[0]
    });
    let currentData = ModalController.getData(this.props.parentId);
    currentData.toUser = row[0];
    ModalController.updateData(this.props.parentId,currentData);
  }

  buildGroupsDropdown(){
    let dropdown = [];
    for( let g=0; g<this.props.userInfo.groups.length;g++){
      dropdown.push(this.props.userInfo.groups[g].groupName);
    }
    return dropdown;
  }

  buildTableData(){
    let members = this.state.selectedGroup.members;
    let data    = [];
    for(let m=0;m<members.length;m++){
      if(members[m] === this.props.userInfo.username){
        continue;
      }
      data.push([members[m]]);
    }
    return data;
  }

  componentDidMount(){
    let modalData = ModalController.getData("shareDataModal");
    this.state.data = modalData;
    ModalController.activeModalComponent = this;
  }

  render() {

    let data = undefined;

    if(this.state.selectedGroup){
      data = this.state.selectedGroup.length != 0 ? this.buildTableData() : [];
    }

    const self = this;
    return (
        <div class="modal-body">
          { data &&
          <div>
          <div class="row text-left">
              <div class="col-md-6">
                <Dropdown id="filtersGroupsDropdown"
                          dropdownList={ this.buildGroupsDropdown() }
                          header={ <IconHeader textClass="text-left"
                                              iconClass="fa fa-users"
                                              anchor="left"
                                              header="GROUPS"/> }
                          onClickRow={ this.selectGroup }
                          mappedData={ this.props.userInfo.groups }
                          buttonText={ data ? this.state.selectedGroup.groupName : "NONE" }/>
              </div>
            </div>
            <br/>
            <br/>
            <h3 id="selectedUser" 
                    className="text-center text-black">
                    { this.state.selectedUser && 
                      this.state.selectedUser != "" ? 
                      this.state.selectedUser.toUpperCase() : "NO USER SELECTED" }
            </h3>
            <br/>
            <p className="text-center">
                Select a user from one of your groups below.  On submit,
                the selected user will be sent this shared item.
            </p>
            </div>
          }
          { data &&
            this.state.selectedGroup.members.length != 1 &&
            <FilterTable data={ data } 
                        placeholder={ "Search Users..." }
                        onClick={ this.selectUser }/>
          }
          { data && this.state.selectedGroup.members.length === 1 &&
            <div>
              <br/>
              <h5 className="text-center text-secondary">
                Looks like you're the only member of this group. You must
                have additional members in order to share content. 
                <br/><br/>                
                 <button className="btn btn-primary" 
                      onClick={ () => { self.props.selectService("Groups"); ModalController.hideModal() } }>
                  ADD MEMBER(S)
                </button>
              </h5>
              <br/>
            </div>
          }
          { !data &&
            <div>
              <br/>
              <h5 className="text-center text-secondary">
                Looks like you're not currently a part of any groups. In order to 
                share strategies with other users, you must be a part of a group.
                <br/><br/>
                <button className="btn btn-primary" 
                      onClick={ () => { self.props.selectService("Groups"); ModalController.hideModal() } }>
                  CREATE GROUP 
                </button>
              </h5>
              <br/>
            </div>
          }
          </div>
    );
  }
}


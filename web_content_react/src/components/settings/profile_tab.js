import React from "react"
import Loader from "../generic/loader"
import IconHeader from "../generic/icon_header"
import ApiController from "../../js/ApiController"
import NotificationController from "../../js/NotificationController";
import ModalController from "../../js/ModalController"

const TAB_MARGIN = {
  marginTop: "5px",
  marginLeft: "15px",
  marginRight: "15px"
}

export default class ProfileTab extends React.Component {

  constructor(props){
    super(props);
    this.state={
      changingPassword: false
    }
  }

  updateAfterProfile(){
    this.setState({
      loading: false
    });
  }

  getTab(){

    if(this.state.loading){
      return (<div>
      <Loader styleOverride={{marginTop: "300px"}}
              loadingMessage={ "Fetching profile..." }/>
      </div>);
    }
    else if(this.state.currentTab === 0){
      
    }
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
  
  buildLinkedExchangesTable(){
    const exchangeKeys =  this.props.userInfo.linkedExchanges.map((value,index) => 
                          <tr key={ value }>
                            <td>
                              { value.name.toUpperCase() }
                            </td>
                            <td>
                              <a href="#" onClick={ () => { 
                                ModalController.showModal(
                                  "removeExchangeKeysModal",
                                  {
                                    exchange: value.name
                                  }
                                )
                              } }> REMOVE </a>  
                            </td>
                          </tr> 
    );
    return (
      <table className="table table-hover">
        <tbody>
          { exchangeKeys }
        </tbody>
      </table>
    )
  }

  render() {
    const self = this;
    return(
      <div class="tab-pane active show" style={ TAB_MARGIN }>
        <h3 className="text-secondary float-right" style={{marginRight:"50px",marginTop:"10px",marginBottom:"10px"}}> 
          ACCOUNT AGE: { " " + this.getAge(new Date(this.props.userProfileInfo.signupDate),new Date()) + " DAYS" }
        </h3><br/>
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-black"> 
              Account Information
            </h1>
            <table className="table table-hover">
              <tbody>
                <tr>
                  <td>
                    USERNAME
                  </td>
                  <td>
                    { this.props.userInfo.username.toUpperCase( ) }
                  </td>
                </tr>
                <tr>
                  <td>
                    EMAIL
                  </td>
                  <td>
                    { this.props.userInfo.email.toUpperCase() }
                  </td>
                </tr>
                <tr>
                  <td>
                    BP
                  </td>
                  <td>
                    { this.props.userInfo.balance }
                  </td>
                </tr>
                <tr>
                  <td>
                    BP (AVAILABLE)
                  </td>
                  <td>
                    { this.props.userInfo.availableBalance }
                  </td>
                </tr>
                <tr>
                  <td>
                    PASSWORD
                  </td>
                  <td>
                    <a href="#" onClick={
                      function(){
                        if(self.state.changingPassword){
                          return;
                        }
                        self.setState({
                          changingPassword: true
                        });
                        ApiController.doPostWithToken(
                          "request_password_change",
                          {},
                          function(response){
                            self.setState({
                              changingPassword: false
                            });
                            NotificationController.displayNotification(
                              "RESET REQUESTED",
                              "An email with instructions to change your password has" +
                              " been sent to " + self.props.userInfo.email,
                              "info"
                            );
                          }
                        )
                      }
                    }> CHANGE </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    PROFILE PICTURE
                  </td>
                  <td>
                    <a href="#"
                       onClick={
                         function(){
                          NotificationController.displayNotification(
                            "SERVICE UNAVAILABLE",
                            "This feature is currently not available in this version.",
                            "info"
                          );
                        }
                       }> CHANGE </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    2FA
                  </td>
                  <td>
                    <a href="#"
                       onClick={
                         function(){
                          NotificationController.displayNotification(
                            "SERVICE UNAVAILABLE",
                            "This feature is currently not available in this version.",
                            "info"
                          );
                        } }> ENABLE </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-10">
                <h1 className="text-black"> 
                  Linked Exchanges 
                </h1>
              </div>
              <div className="col-md-2">
                <button className="btn btn-secondary" 
                        onClick={ () => {
                          ModalController.showModal("addExchangeKeysModal");
                        }
                      } >
                  <IconHeader header="EXCHANGE API" iconClass="fa fa-plus" anchor="right"/>
                </button>
              </div>
            </div>
            { this.props.userInfo.linkedExchanges.length === 0 && 
              <div>
                <br/>
                <h3 className="text-secondary">
                  You do not have any linked exchanges, to enable live trading please add one above.
                </h3>
              </div>
            }
            { 
              this.props.userInfo.linkedExchanges.length > 0 && 
              this.buildLinkedExchangesTable()
            }
          </div>
        </div>
      </div>
    );
  }
}

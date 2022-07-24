import React from "react";
import ModalController from "../../js/ModalController"

const MODAL_STYLE = {
  display: "block",
  backgroundColor: "#fffefe",
  borderWidth: "10px",
  borderStyle: "solid",
  borderColor: "rgba(62, 82, 95, 0.5);",
  borderRadius: ".75rem",
  marginLeft: "5px",
  marginRight: "5x",
  width: window.innerHeight
};

const BUTTON_STYLE = {
  width:"100%"
}

export default class Modal extends React.Component {

  constructor(props){
    super(props);
    this.state={
      loading: false
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(){
    ModalController.hideModal(this.props.modalId);
  }

  onSubmit(){

    if(this.props.modalBody.onSubmit){
      if(this.props.modalBody.onSubmit()){
        this.setState({
          loading: true
        });
      }
    }
    else{
      if(this.props.modalBody.props.onSubmit()){
        this.setState({
          loading: true
        });
      }
    }
  }

  render() {
    ModalController.activeModalComponent = this;
    return (
      <div className="modal fade show" 
          id={ this.props.modalId }
          tabindex="-1" 
          role="dialog" 
          aria-labelledby="exampleModalLabel" >
          <div className="modal-dialog modal-dialog-centered" 
               role="document">
            <div className="modal-content" style={ MODAL_STYLE }>
              <div className="modal-header">
                <h4 className="modal-title text-center" 
                    id={ this.props.titleId }> 
                    <span className="text-black">{ this.props.title }</span>
                </h4>
            { !this.props.modalBody.props.blockClose && 
              <button className="close" 
                      type="button"
                      data-dismiss="modal" 
                      aria-label="Close"
                      onClick={ this.handleClose }>
                  <span aria-hidden="true">X</span>
              </button>
            }
          </div>
          { this.props.modalBody }
          <div className="modal-footer">
            { this.props.modalBody.props.onSubmit && 
              !this.state.loading &&
                <button id={ this.props.submitId } 
                      className="btn btn-primary" 
                      type="button"
                      style={ BUTTON_STYLE }
                      onClick={ this.onSubmit }>
                        { this.props.modalBody.submitOverride ? this.props.modalBody.submitOverride : "Submit" }
                </button>
            } 
            { this.props.modalBody.props.onSubmit && 
              this.state.loading &&
                <button id={ this.props.submitId } 
                        className="btn btn-primary" 
                        type="button"
                        style={ BUTTON_STYLE }>
                  <i className="fa fa-spin fa-spinner"/>
              </button>
            }
          </div>
          </div>
        </div>
      </div>
    );
  }
}


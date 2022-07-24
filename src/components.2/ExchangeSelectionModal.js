import React from "react";

export default class Modal extends React.Component {
  render() {
    return (
      <div class="modal fade show" 
          id={ this.props.modalId }
          tabindex="-1" 
          role="dialog" 
          aria-labelledby="exampleModalLabel" 
          style="display: block;">
          <div class="modal-dialog modal-dialog-centered" 
               role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title text-center" 
                    id={ this.props.titleId }> 
                    { this.props.title };
                </h4>
            <button class="close" 
                    type="button"
                    data-dismiss="modal" 
                    aria-label="Close">
                <span aria-hidden="true">X</span>
            </button>
          </div>
          { this.props.modalBody }
          </div>
          <div class="modal-footer">
            <button id={ this.props.submitId } 
                    class="btn btn-primary" 
                    type="button">Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}


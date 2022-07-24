import React from "react";

export default class StickyFooter extends React.Component {

    constructor(props){
      super(props);
    }

    render() {
        return(
          <footer>
            <div className="container">
            <div className="text-center">
            <div className="text-center">
                  <small> 
                    { this.props.footerMessage } 
                    <a href={ this.props.href }>
                      { this.props.linkText }
                    </a>
                  </small>
                </div>
            </div>
          </div>
        </footer>
        );
    }
}
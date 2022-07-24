import React from "react";

const LOADING_STYLE = {
  marginTop: "300px"
}

export default class Loader extends React.Component {

  render() {

    const style = this.props.styleOverride ? 
                  this.props.styleOverride : 
                  LOADING_STYLE;

    const className = this.props.classOverride ?
                      this.props.classOverride :
                      "text-center text-primary";

    return (
      <div class="text-center" style={ style }> 
        <h1>
          <i className={ "fa fa-spin fa-spinner " + className } aria-hidden="true"/>
        </h1>
        <h5 className={ className }>
          <strong>{ this.props.loadingMessage }</strong>
        </h5>
    </div>
    );
  }
}


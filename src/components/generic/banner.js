import React from "react"

const INNER_MARGINS = {
    marginTop: "5px"
}

export default class Banner extends React.Component {

    constructor(props){
        super(props);
    }

    render() {

      const style = {
          backgroundColor: this.props.backgroundColor
      }

      const textStyle = {
          color: this.props.textColor
      }

      return (
        <div className="row" style={ style } >
            <div className="col-md-12" style={ INNER_MARGINS }>
                <h5 style={ textStyle }>
                    { this.props.message }
                </h5>
            </div> 
        </div>
    );
  }
}
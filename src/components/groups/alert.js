import React from "react";
import IconHeader from "../generic/icon_header"

export default class AlertsTab extends React.Component {

    constructor(props){
      super(props);
      this.state={
          hovered: -1
      }
    }

    onHover(index){
        this.setState({
            hovered: index
        });
    }

    onLeave(){
        this.setState({
            hovered: -1
        });
    }

    render(){
        let style = {
            backgroundColor: "rgb(224, 224, 224)",
            maxWidth: "100%",
            maxHeight: "75%",
            color: "white"
        }
        style.backgroundColor = this.props.backgroundColor ? this.props.backgroundColor : style.backgroundColor;
        return(<div className="row">
            <div className="col-md-1"/>
            <div className="col-md-10 text-secondary style_prevu_kit_sm rounded" style={ style }>
                <h4 className="text-left" style={{marginLeft:"10px",marginTop:"20px"}}>{" FROM: " + this.props.fromUser.toUpperCase() }</h4>
                <br/>
                <i className="text-center" style={{marginLeft:"10px"}}> { this.props.message } </i>
                <br/><br/><br/>
                <h2>
                { !this.props.processing &&
                    <div className="row text-left">
                        <div className="col-sm-1"/>
                        <div className="col-md-3 text-left clickable" 
                            onMouseOver={ () => this.onHover(0) } 
                            onMouseOut={ () => this.onLeave() } 
                            onClick={ this.props.onAccept }>
                            <IconHeader textClass={ this.state.hovered === 0 ? "text-success" : "text-secondary" }
                                        iconClass="fa fa-check-circle" 
                                        header="ACCEPT" 
                                        anchor="left"/>
                        </div>
                        <div className="col-md-3 text-left clickable" 
                            onMouseOver={ () => this.onHover(1) } 
                            onMouseOut={ () => this.onLeave() }
                            onClick={ this.props.onDecline }>
                            <IconHeader textClass={ this.state.hovered === 1 ? "text-danger" : "text-secondary" }
                                        iconClass="fa fa-times-circle" 
                                        header="DISMISS" 
                                        anchor="left"/>
                        </div>
                    </div>
                }{ this.props.processing &&
                    <div className="row text-center">
                        <div className="col-md-12 text-center text-primary">
                            <h3>
                                <i className="fa fa-spin fa-spinner"/>
                            </h3>
                        </div>
                    </div>
                }
                </h2>
            </div>
            <div className="col-md-1"/>
        </div>);
    }
}
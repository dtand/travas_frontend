import React from "react";
import PlatformLandingNav from "./platform_landing_nav";
import Constants from "../../js/Constants";
import PlatformLandingNavMobile from "./platform_landing_mobile";

const TITLE = "TRAVAS"
const VERSION = "ALPHA 1.1.0"
const WIDTH_TITLE = {
    width: "50%"
}
const WIDTH_NAV = {
    width: "50%"
}
export default class PlatformLandingHeader extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
      return (
        <div className="navbar row fixed-top tr-background">
             <div className="navbar-fade"/>
             <div className="col-md-3" style={ Constants.IS_MOBILE ? WIDTH_TITLE : {} }>
                <div>
                    <span className="landing-title margin-right-10 clickable">
                        <i> 
                          <a className="landing-title" href={ "./" }>
                            { TITLE }
                          </a>
                        </i>
                    </span>
                    { !Constants.IS_MOBILE &&
                        <span className="landing-sub-title">
                            { this.props.subMessage ? 
                            this.props.subMessage : 
                            VERSION
                            }
                        </span>
                    }
                </div>
            </div>
            { !Constants.IS_MOBILE &&
            <div className="col-md-9 text-right margin-top-15">
                <PlatformLandingNav updateBody={ this.props.updateBody }/>
            </div>
            }{ Constants.IS_MOBILE &&
                <div className="col-md-9 text-right" style={ WIDTH_NAV }>
                    <PlatformLandingNavMobile updateBody={ this.props.updateBody }/>
                </div>
                }
        </div>
    );
  }
}
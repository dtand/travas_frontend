import React from "react"
import PlatformLandingHeader from "./platform_landing_header"
import PlatformLandingBody from "./platform_landing_body"
import LandingPageFooter from "./landing_page_footer";

export default class PlatformLandingMain extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            body: <PlatformLandingBody/>,
            hasRedirect: true
        };

        this.updateBody = this.updateBody.bind(this);
        this.redirect   = true;
    }

    updateBody(component){
        this.setState({
            body: component
        });
        document.body.scrollTop =  0;
    }

    componentDidMount(){
        if(this.props.body && this.state.hasRedirect){
            this.setState({
                body: this.props.body,
                hasRedirect: false
            });
            const url = window.location.href.split("/");
            if(url.length > 1 && url[url.length-1] !== "admin"){
                window.history.pushState("","","../");
            }
        }
    }

    render() {
      return (
        <div>
            <PlatformLandingHeader updateBody={ this.updateBody }/>
            <div className="landing-body overflow-x-hidden">
                { this.state.body }
            </div>
            <LandingPageFooter/>
        </div>
    );
  }
}
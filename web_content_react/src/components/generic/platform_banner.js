import React from "react"


export default class PlatformBanner extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          hide: false
        }
    }

    render() {
      const self = this;
      return (
        <div>
          { !this.state.hide &&
            <div className={ this.props.bannerType + " margin-top-25" }>
                <p class="text-white text-center margin-top-5">
                  { this.props.message }
                  <span className="clickable platform-banner-x landing-nav-item float-right margin-top-5"
                        onClick={ () => { 
                          self.setState({
                            hide:true
                          });
                        }}>
                  X
                </span>
                </p>
            </div>
          }
        </div>
    );
  }
}
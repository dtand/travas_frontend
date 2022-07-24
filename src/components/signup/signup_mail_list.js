import React from "react";

export default class SignupMailList extends React.Component {
  render() {
    return (
      <form action="https://travas.us19.list-manage.com/subscribe/post?u=509032090392039ea670731a2&amp;id=afd9027b55" 
            method="post" 
            id="mc-embedded-subscribe-form" 
            name="mc-embedded-subscribe-form" 
            class="validate" 
            target="_blank" 
            novalidate="">
        <div id="mc_embed_signup_scroll">
          <label for="mce-EMAIL"> 
          { this.props.message }
          </label>
            <br/>
            <input type="email" 
                   name="EMAIL" 
                   className="email margin-right-5 input-mailing-list" 
                   id="mce-EMAIL" 
                   placeholder="email address" 
                   required=""/>
            <input type="submit" 
                   value="Subscribe" 
                   name="subscribe" 
                   id="mc-embedded-subscribe" 
                   style={ { 
                    transform: "translateY(-2px)"
                   } }
                   className="btn btn-primary btn-mailing-list margin-left-10"/>
        </div>
      </form>
    );
  }
}

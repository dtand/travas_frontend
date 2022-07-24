import React from "react";
import ApiController from "../../js/ApiController";

export default class ContactUsPanel extends React.Component {

    constructor(props){
        super(props);
    }

    state = {
        fields: {},
        sendingMessage: false
    };
    
    onChange = updatedValue => {
        this.setState({
            fields: {
            ...this.state.fields,
            ...updatedValue
            }
        });
    };

    submitForm = (e) => {
        e.preventDefault();
        const self = this;
        const data = {
            "firstName": this.state.fields['firstName'],
            "lastName": this.state.fields['lastName'],
            "email": this.state.fields["email"],
            "message": this.state.fields["message"],
            "phoneNumber": this.state.fields["phoneNumber"]
        };

        if( !data.firstName || data.firstName === ""){
            alert("First name must be provided");
        }
        else if( !data.lastName || data.lastName === ""){
            alert("Last name must be provided");
        }
        else if( !data.email || data.email === ""){
            alert("Email must be provided");
        }
        else if( !data.message || data.message === ""){
            alert("Message must be provided");
        }

        self.setState({
            sendingMessage: true
        });

        ApiController.doPost(
            "contact_form",
            data,
            () => {
                self.setState({
                    sendingMessage: false
                });
                alert("Your message has been sent and we will reach out to you as soon as possible.");
            },
            data,
            () => {
                self.setState({
                    sendingMessage: false
                });
                alert("There was an error connecting to our mailing system.");
            }
        );

        return false;
    }

    render(){
        const self = this;

        return(	

            <div className="contact-us-one" id="contact">
            <div className="overlay">
                <div className="container">
                    <div className="theme-title-white text-center">
                        <h2 className="text-white">Get In Touch</h2>
                        <p>Have a question or feature request?  Send us a quick note below.</p>
                    </div>

                    <form className="form-validation" autocomplete="off">
                        <div className="row">
                            <div className="col-md-6">
                                <label>First Name*</label>
                                <input  onChange={e => this.onChange({ firstName: e.target.value })}
                                        id="firstName" type="text" placeholder="First Name" name="firstName"/>
                            </div>
                            <div className="col-md-6">
                                <label>Last Name*</label>
                                <input  onChange={e => this.onChange({ lastName: e.target.value })}
                                        id="lastName"  type="text" placeholder="Last Name" name="lastName"/>
                            </div>
                            <div className="col-md-6">
                                <label>Email*</label>
                                <input  onChange={e => this.onChange({ email: e.target.value })}
                                        id="email"  type="email" placeholder="Email Address" name="email"/>
                            </div>
                            <div className="col-md-6">
                                <label>Phone</label>
                                <input  onChange={e => this.onChange({ phoneNumber: e.target.value })}
                                        id="phoneNumber"  type="text" placeholder="Phone Number" name="phone"/>
                            </div>
                            <div className="col-12">
                                <label>I would like to discuss*</label>
                                <input  onChange={e => this.onChange({ message: e.target.value })}
                                        id="message"  type="text" name="message"/>
                            </div>
                        </div>
                        <button onClick={ this.submitForm }> { this.state.sendingMessage ?
                            <i className="fa fa-spin fa-spinner"/> :
                            "Send Message"
                        }</button>
                    </form>
                </div>
            </div> 
        </div> 
    )}
}
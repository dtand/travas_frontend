import React from "react";
let NotificationSystem = require('react-notification-system');

const NotificationController = {

    setNotificationSystem: function(notificationSystem){
        this.notificationSystem = notificationSystem;
    },

    displayNotification(title,message,level){
        this.notificationSystem.addNotification({
            message: <div>
                        <h5 className="text-left text-black"> {title} </h5> 
                        <h6 className="text-left margin-top-5 text-black">
                            <i>
                                { message }
                            </i>.
                        </h6> 
                        <br/>
                        </div>,
            level: level
            });
    }

};

export default NotificationController;
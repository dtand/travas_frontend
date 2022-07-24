import React from 'react';
import Routes from './routes'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

 
import './vendor/bootstrap/css/bootstrap.min.css'
import './css/sb-admin.css'
import './css/margins.css'
import './css/backgrounds.css'
import './css/roadmap.css'
import 'nvd3/build/nv.d3.css'
import './css/nvd3-custom.css'

import './css/landing_page/color-one.css'
import './css/landing_page/color-two.css'
import './css/landing_page/color-three.css'
import './css/landing_page/custom-animation.css'
import './css/landing_page/responsive.css'
import './css/landing_page/style.css'


function add_chatinline(){
    const hccid=36954735;
    let nt=document.createElement("script");
    nt.async=true;
    nt.src="https://mylivechat.com/chatinline.aspx?hccid="+hccid;
    let ct=document.getElementsByTagName("script")[0];
    ct.parentNode.insertBefore(nt,ct);
}

window.$ = window.jQuery = require("jquery");

add_chatinline();

export default DragDropContext(HTML5Backend)(Routes)



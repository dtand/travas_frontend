

const Utils = {
    clearTooltips : function(){
        var rem = document.querySelectorAll("[id*='nvtooltip']"), i = 0;
        for (; i < rem.length; i++)
            rem[i].parentNode.removeChild(rem[i]);
    }
}

export default Utils;
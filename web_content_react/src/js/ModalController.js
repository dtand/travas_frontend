
let ModalController = {

    activeModal: undefined,
    activeModalComponent: undefined,
    modals: new Map(),
    modalData: new Map(),

    registerModal: function(id, component){
        this.modals[id] = component;
    },

    getData: function(id){
        const data = this.modalData[id];
        return data;
    },

    showModal: function(id,data){
        this.activeModal = id;

        if(data){
            this.modalData[id] = data;
        }
        document.getElementById("page-top").style.opacity = .66;
        document.getElementsByTagName("body")[0].style.backgroundColor = "black";
        this.modals[id].setState({
            update: true
        });
    },

    hideModal: function(id){
        if(!id && this.activeModal){
            id = this.activeModal;    
        }
        this.activeModal = undefined;
        document.getElementById("page-top").style.opacity = 1.00;
        document.getElementsByTagName("body")[0].style.backgroundColor = "white";
        this.modals[id].setState({
            update: false
        });
    },

    setData: function(id,data){
        this.modalData[id] = data;
    },

    updateData: function(id,passed){
        let data = this.modalData[id];
        var result = {};
        for(var key in data) result[key]   = data[key];
        for(var key in passed) result[key] = passed[key];
        this.modalData[id] = result;
    }
}

export default ModalController;
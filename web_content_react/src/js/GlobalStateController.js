let GlobalStateController = { 
    
    state: new Map(),

    registeredComponents: new Map(),


    pingState(field,value){
        if (this.registeredComponents.get(field) === undefined) {
            return
        }
        this.state.set(field,value);
        for(let s=0;s<this.registeredComponents.get(field).length;s++){
            let component = this.registeredComponents.get(field)[s];
            component.setState({
                update: true
            });
        }
    },

    getValue(field){
        return this.state.get(field);
    },

    addState(field){
        this.state.set(field,[]);
    },

    registeredComponentWithState(component,field){
        if(this.registeredComponents.has(field)){
            this.registeredComponents.get(field).push(component);
        }
        else{
            this.registeredComponents.set(field, [component]);
        }
    }
}

export default GlobalStateController;

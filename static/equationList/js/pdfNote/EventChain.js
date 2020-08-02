class EventChain {
    constructor(){

    }

    createEventListener(target, eventType, callback){
        target.addEventListener(eventType, callback)
    }

    createCustomListener(name, clickEvent, waitResultEvent){

        this.createEventListener(clickEvent.target, "click", clickEvent.callback)

        this.createEventListener(waitResultEvent.tarrget, waitResultEvent.name, waitResultEvent.callback)
    }

}


class Event<MessageType> {
    private listeners: {(msg: MessageType): void; }[];
    constructor (){
        this.listeners = [];
    }
    
    clearListeners(){
        this.listeners = [];
    }
  
    invoke(msg: MessageType){
        this.listeners.forEach(listener => listener(msg));
    }
  
    addListener(listener: (msg: MessageType) => void) : void {
        this.listeners.push(listener);
    }
  
    removeListener(listener: (msg: MessageType) => void) : boolean {
        const index = this.listeners.findIndex(l => l === listener);
        if(index === -1){
            return false;
        }
        this.listeners.splice(index, 1);
        return true;
    }
  }
  
  export default Event;
  
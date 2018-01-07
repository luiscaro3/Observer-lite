/**
* @author: Luis Caro
* @description: Obsever module
*/

/**
* Observer is an object that encapsulates our two main classes Model and View
*/
let Observer = {
  /**
  * The model prototype: subscribes/unsubscribes listeners, saves data and fires events
  */
  Model: class Model {
    constructor(attr) {
      this.listeners = [];
      this.attributes = Object.assign({}, attr);
    }
    
    // All methods calls checkParams to notify if an argument is missing
    checkParams(params) {
      let paramsOutput = [];
      for (var item in params) {
        if(!params[item]) {
          paramsOutput.push(item) ;
        }
      }
      if(paramsOutput.length) {
        console.error('Missing the following argument(s): [' + paramsOutput.join(', ') + ']');
      } else {
        return true;
      }
    }
    
    // Subscribes views to be notified when data has changed
    on(event, callback) {
      let params = {
        event: event, 
        callback: callback
      };
      
      if(!this.checkParams(params)) {
        return false;
      }
      
      this.listeners.push(params);
    }
    
    // Unsubscribes views
    off(event) {
      let params = {
        event: event
      };
      
      if(!this.checkParams(params)) {
        return false;
      }
      
      this.listeners = this.listeners.filter(item => {
        if (item.event != event) {
          return item
        }
      });
    }
    
    // Stores/Updates values stored
    set(key, value, silent = false) {
      // If we're only storing one value
      if(typeof key === 'string' || typeof key === 'number') {
        let params = {
          key: key, 
          value: value
        };
        
        if(!this.checkParams(params)) {
          return false;
        }
        
        if(!silent) {
          this.attributes[key] = value;
        }          
        
        // Trigger events every time we modify content
        this.trigger('change change:' + key, value)
      } 
      
      // If user passed on object to store many values
      else if(typeof key === 'object') {
        for (var item in key) {
          this.attributes[item] = key[item];
          
          // Trigger events every time we modify content
          if(!silent) {
            this.trigger('change change:' + item, key[item]);
          }
        }
      }
      
      else {
        console.error('Wrong argument type.');
      }
    }
    
    // Retreives stored data
    get(key) {
      if(!this.checkParams({key: key})) {
        return false;
      } else {
        return this.attributes[key];
      }
    }
    
    trigger(events, value) {
      // First build list of methods that we're going to call
      let calls = [];
      if(typeof events === 'string') {
        events = events.split(' ');
        
        for (var event in events) {
          calls = this.listeners.filter(item => {
            return item.event == events[event];
          });
        }
        
        // Now we make the calls one by one
        for (var call in calls) {
          calls[call].callback(value);
        }
      }
    }
  },
  
  /**
  * The View prototype: subscribers or listeners
  */
  View: class View {
    constructor(attributes) {
      // Fires initialize when class gets instantiated
      this.initialize(attributes);
    }
    
    // Handy method to select from the DOM jQuery-like
    $(selector) {
      return document.querySelectorAll(selector);
    }
  }
};
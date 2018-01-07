'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @author: Luis Caro
* @description: Obsever module
*/

/**
* Observer is an object that encapsulates our two main classes Model and View
*/
var Observer = {
  /**
  * The model prototype: subscribes/unsubscribes listeners, saves data and fires events
  */
  Model: function () {
    function Model(attr) {
      _classCallCheck(this, Model);

      this.listeners = [];
      this.attributes = Object.assign({}, attr);
    }

    // All methods calls checkParams to notify if an argument is missing


    _createClass(Model, [{
      key: 'checkParams',
      value: function checkParams(params) {
        var paramsOutput = [];
        for (var item in params) {
          if (!params[item]) {
            paramsOutput.push(item);
          }
        }
        if (paramsOutput.length) {
          console.error('Missing the following argument(s): [' + paramsOutput.join(', ') + ']');
        } else {
          return true;
        }
      }

      // Subscribes views to be notified when data has changed

    }, {
      key: 'on',
      value: function on(event, callback) {
        var params = {
          event: event,
          callback: callback
        };

        if (!this.checkParams(params)) {
          return false;
        }

        this.listeners.push(params);
      }

      // Unsubscribes views

    }, {
      key: 'off',
      value: function off(event) {
        var params = {
          event: event
        };

        if (!this.checkParams(params)) {
          return false;
        }

        this.listeners = this.listeners.filter(function (item) {
          if (item.event != event) {
            return item;
          }
        });
      }

      // Stores/Updates values stored

    }, {
      key: 'set',
      value: function set(key, value) {
        var silent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        // If we're only storing one value
        if (typeof key === 'string' || typeof key === 'number') {
          var params = {
            key: key,
            value: value
          };

          if (!this.checkParams(params)) {
            return false;
          }

          if (!silent) {
            this.attributes[key] = value;
          }

          // Trigger events every time we modify content
          this.trigger('change change:' + key, value);
        }

        // If user passed on object to store many values
        else if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
            for (var item in key) {
              this.attributes[item] = key[item];

              // Trigger events every time we modify content
              if (!silent) {
                this.trigger('change change:' + item, key[item]);
              }
            }
          } else {
            console.error('Wrong argument type.');
          }
      }

      // Retreives stored data

    }, {
      key: 'get',
      value: function get(key) {
        if (!this.checkParams({ key: key })) {
          return false;
        } else {
          return this.attributes[key];
        }
      }
    }, {
      key: 'trigger',
      value: function trigger(events, value) {
        // First build list of methods that we're going to call
        var calls = [];
        if (typeof events === 'string') {
          events = events.split(' ');

          for (var event in events) {
            calls = this.listeners.filter(function (item) {
              return item.event == events[event];
            });
          }

          // Now we make the calls one by one
          for (var call in calls) {
            calls[call].callback(value);
          }
        }
      }
    }]);

    return Model;
  }(),

  /**
  * The View prototype: subscribers or listeners
  */
  View: function () {
    function View(attributes) {
      _classCallCheck(this, View);

      // Fires initialize when class gets instantiated
      this.initialize(attributes);
    }

    // Handy method to select from the DOM jQuery-like


    _createClass(View, [{
      key: '$',
      value: function $(selector) {
        return document.querySelectorAll(selector);
      }
    }]);

    return View;
  }()
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Extend a view class for added functionality
var MyView = function (_Observer$View) {
  _inherits(MyView, _Observer$View);

  function MyView() {
    _classCallCheck(this, MyView);

    return _possibleConstructorReturn(this, (MyView.__proto__ || Object.getPrototypeOf(MyView)).apply(this, arguments));
  }

  _createClass(MyView, [{
    key: 'initialize',
    value: function initialize(attr) {
      this.model = attr.model;
      this.model.on('change:passengers', this.printPassengers.bind(this));
      this.model.on('change:luggage', this.printluggage.bind(this));
    }
  }, {
    key: 'printPassengers',
    value: function printPassengers(value) {
      this.$('#passengers')[0].innerHTML = 'There are ' + value + ' passengers.';
    }
  }, {
    key: 'printluggage',
    value: function printluggage(value) {
      this.$('#luggage')[0].innerHTML = 'There are ' + value + ' briefcases.';
    }
  }]);

  return MyView;
}(Observer.View);

;

var model = new Observer.Model({ dogs: 1 });
var myView = new MyView({ model: model });

model.set({ 'passengers': 2, 'luggage': 5 });
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9ic2VydmVyLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6WyJPYnNlcnZlciIsIk1vZGVsIiwiYXR0ciIsImxpc3RlbmVycyIsImF0dHJpYnV0ZXMiLCJPYmplY3QiLCJhc3NpZ24iLCJwYXJhbXMiLCJwYXJhbXNPdXRwdXQiLCJpdGVtIiwicHVzaCIsImxlbmd0aCIsImNvbnNvbGUiLCJlcnJvciIsImpvaW4iLCJldmVudCIsImNhbGxiYWNrIiwiY2hlY2tQYXJhbXMiLCJmaWx0ZXIiLCJrZXkiLCJ2YWx1ZSIsInNpbGVudCIsInRyaWdnZXIiLCJldmVudHMiLCJjYWxscyIsInNwbGl0IiwiY2FsbCIsIlZpZXciLCJpbml0aWFsaXplIiwic2VsZWN0b3IiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJNeVZpZXciLCJtb2RlbCIsIm9uIiwicHJpbnRQYXNzZW5nZXJzIiwiYmluZCIsInByaW50bHVnZ2FnZSIsIiQiLCJpbm5lckhUTUwiLCJkb2dzIiwibXlWaWV3Iiwic2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7OztBQUtBOzs7QUFHQSxJQUFJQSxXQUFXO0FBQ2I7OztBQUdBQztBQUNFLG1CQUFZQyxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCLFdBQUtDLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxXQUFLQyxVQUFMLEdBQWtCQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkosSUFBbEIsQ0FBbEI7QUFDRDs7QUFFRDs7O0FBTkY7QUFBQTtBQUFBLGtDQU9jSyxNQVBkLEVBT3NCO0FBQ2xCLFlBQUlDLGVBQWUsRUFBbkI7QUFDQSxhQUFLLElBQUlDLElBQVQsSUFBaUJGLE1BQWpCLEVBQXlCO0FBQ3ZCLGNBQUcsQ0FBQ0EsT0FBT0UsSUFBUCxDQUFKLEVBQWtCO0FBQ2hCRCx5QkFBYUUsSUFBYixDQUFrQkQsSUFBbEI7QUFDRDtBQUNGO0FBQ0QsWUFBR0QsYUFBYUcsTUFBaEIsRUFBd0I7QUFDdEJDLGtCQUFRQyxLQUFSLENBQWMseUNB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SWpDLFNBQVNDLEtBQWIsQ0FBbUIsRUFBQ3VDLE1BQU0sQ0FBUCxFQUFuQixDQUFaO0FBQ0EsSUFBSUMsU0FBUyxJQUFJVCxNQUFKLENBQVcsRUFBQ0MsT0FBT0EsS0FBUixFQUFYLENBQWI7O0FBRUFBLE1BQU1TLEdBQU4sQ0FBVSxFQUFDLGNBQWMsQ0FBZixFQUFrQixXQUFXLENBQTdCLEVBQVYiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4qIEBhdXRob3I6IEx1aXMgQ2Fyb1xyXG4qIEBkZXNjcmlwdGlvbjogT2JzZXZlciBtb2R1bGVcclxuKi9cclxuXHJcbi8qKlxyXG4qIE9ic2VydmVyIGlzIGFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyBvdXIgdHdvIG1haW4gY2xhc3NlcyBNb2RlbCBhbmQgVmlld1xyXG4qL1xyXG5sZXQgT2JzZXJ2ZXIgPSB7XHJcbiAgLyoqXHJcbiAgKiBUaGUgbW9kZWwgcHJvdG90eXBlOiBzdWJzY3JpYmVzL3Vuc3Vic2NyaWJlcyBsaXN0ZW5lcnMsIHNhdmVzIGRhdGEgYW5kIGZpcmVzIGV2ZW50c1xyXG4gICovXHJcbiAgTW9kZWw6IGNsYXNzIE1vZGVsIHtcclxuICAgIGNvbnN0cnVjdG9yKGF0dHIpIHtcclxuICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcclxuICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gT2JqZWN0LmFzc2lnbih7fSwgYXR0cik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEFsbCBtZXRob2RzIGNhbGxzIGNoZWNrUGFyYW1zIHRvIG5vdGlmeSBpZiBhbiBhcmd1bWVudCBpcyBtaXNzaW5nXHJcbiAgICBjaGVja1BhcmFtcyhwYXJhbXMpIHtcclxuICAgICAgbGV0IHBhcmFtc091dHB1dCA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBpdGVtIGluIHBhcmFtcykge1xyXG4gICAgICAgIGlmKCFwYXJhbXNbaXRlbV0pIHtcclxuICAgICAgICAgIHBhcmFtc091dHB1dC5wdXNoKGl0ZW0pIDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYocGFyYW1zT3V0cHV0Lmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ01pc3NpbmcgdGhlIGZvbGxvd2luZyBhcmd1bWVudChzKTogWycgKyBwYXJhbXNPdXRwdXQuam9pbignLCAnKSArICddJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gU3Vic2NyaWJlcyB2aWV3cyB0byBiZSBub3RpZmllZCB3aGVuIGRhdGEgaGFzIGNoYW5nZWRcclxuICAgIG9uKGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIGV2ZW50OiBldmVudCwgXHJcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICBpZighdGhpcy5jaGVja1BhcmFtcyhwYXJhbXMpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKHBhcmFtcyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFVuc3Vic2NyaWJlcyB2aWV3c1xyXG4gICAgb2ZmKGV2ZW50KSB7XHJcbiAgICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgZXZlbnQ6IGV2ZW50XHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICBpZighdGhpcy5jaGVja1BhcmFtcyhwYXJhbXMpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLmxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzLmZpbHRlcihpdGVtID0+IHtcclxuICAgICAgICBpZiAoaXRlbS5ldmVudCAhPSBldmVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIGl0ZW1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBTdG9yZXMvVXBkYXRlcyB2YWx1ZXMgc3RvcmVkXHJcbiAgICBzZXQoa2V5LCB2YWx1ZSwgc2lsZW50ID0gZmFsc2UpIHtcclxuICAgICAgLy8gSWYgd2UncmUgb25seSBzdG9yaW5nIG9uZSB2YWx1ZVxyXG4gICAgICBpZih0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyB8fCB0eXBlb2Yga2V5ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgICBrZXk6IGtleSwgXHJcbiAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCF0aGlzLmNoZWNrUGFyYW1zKHBhcmFtcykpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIXNpbGVudCkge1xyXG4gICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9ICAgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFRyaWdnZXIgZXZlbnRzIGV2ZXJ5IHRpbWUgd2UgbW9kaWZ5IGNvbnRlbnRcclxuICAgICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZSBjaGFuZ2U6JyArIGtleSwgdmFsdWUpXHJcbiAgICAgIH0gXHJcbiAgICAgIFxyXG4gICAgICAvLyBJZiB1c2VyIHBhc3NlZCBvbiBvYmplY3QgdG8gc3RvcmUgbWFueSB2YWx1ZXNcclxuICAgICAgZWxzZSBpZih0eXBlb2Yga2V5ID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGZvciAodmFyIGl0ZW0gaW4ga2V5KSB7XHJcbiAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNbaXRlbV0gPSBrZXlbaXRlbV07XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIFRyaWdnZXIgZXZlbnRzIGV2ZXJ5IHRpbWUgd2UgbW9kaWZ5IGNvbnRlbnRcclxuICAgICAgICAgIGlmKCFzaWxlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UgY2hhbmdlOicgKyBpdGVtLCBrZXlbaXRlbV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignV3JvbmcgYXJndW1lbnQgdHlwZS4nKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBSZXRyZWl2ZXMgc3RvcmVkIGRhdGFcclxuICAgIGdldChrZXkpIHtcclxuICAgICAgaWYoIXRoaXMuY2hlY2tQYXJhbXMoe2tleToga2V5fSkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1trZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRyaWdnZXIoZXZlbnRzLCB2YWx1ZSkge1xyXG4gICAgICAvLyBGaXJzdCBidWlsZCBsaXN0IG9mIG1ldGhvZHMgdGhhdCB3ZSdyZSBnb2luZyB0byBjYWxsXHJcbiAgICAgIGxldCBjYWxscyA9IFtdO1xyXG4gICAgICBpZih0eXBlb2YgZXZlbnRzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGV2ZW50cyA9IGV2ZW50cy5zcGxpdCgnICcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGV2ZW50IGluIGV2ZW50cykge1xyXG4gICAgICAgICAgY2FsbHMgPSB0aGlzLmxpc3RlbmVycy5maWx0ZXIoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmV2ZW50ID09IGV2ZW50c1tldmVudF07XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTm93IHdlIG1ha2UgdGhlIGNhbGxzIG9uZSBieSBvbmVcclxuICAgICAgICBmb3IgKHZhciBjYWxsIGluIGNhbGxzKSB7XHJcbiAgICAgICAgICBjYWxsc1tjYWxsXS5jYWxsYmFjayh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBcclxuICAvKipcclxuICAqIFRoZSBWaWV3IHByb3RvdHlwZTogc3Vic2NyaWJlcnMgb3IgbGlzdGVuZXJzXHJcbiAgKi9cclxuICBWaWV3OiBjbGFzcyBWaWV3IHtcclxuICAgIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgLy8gRmlyZXMgaW5pdGlhbGl6ZSB3aGVuIGNsYXNzIGdldHMgaW5zdGFudGlhdGVkXHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZShhdHRyaWJ1dGVzKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gSGFuZHkgbWV0aG9kIHRvIHNlbGVjdCBmcm9tIHRoZSBET00galF1ZXJ5LWxpa2VcclxuICAgICQoc2VsZWN0b3IpIHtcclxuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxufTsiLCIvLyBFeHRlbmQgYSB2aWV3IGNsYXNzIGZvciBhZGRlZCBmdW5jdGlvbmFsaXR5XHJcbmNsYXNzIE15VmlldyBleHRlbmRzIE9ic2VydmVyLlZpZXcge1xyXG4gIGluaXRpYWxpemUoYXR0cikge1xyXG4gICAgdGhpcy5tb2RlbCA9IGF0dHIubW9kZWw7XHJcbiAgICB0aGlzLm1vZGVsLm9uKCdjaGFuZ2U6cGFzc2VuZ2VycycsIHRoaXMucHJpbnRQYXNzZW5nZXJzLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5tb2RlbC5vbignY2hhbmdlOmx1Z2dhZ2UnLCB0aGlzLnByaW50bHVnZ2FnZS5iaW5kKHRoaXMpKTtcclxuICB9XHJcblxyXG4gIHByaW50UGFzc2VuZ2Vycyh2YWx1ZSkge1xyXG4gICAgdGhpcy4kKCcjcGFzc2VuZ2VycycpWzBdLmlubmVySFRNTCA9ICdUaGVyZSBhcmUgJyArIHZhbHVlICsgJyBwYXNzZW5nZXJzLic7XHJcbiAgfVxyXG5cclxuICBwcmludGx1Z2dhZ2UodmFsdWUpIHtcclxuICAgIHRoaXMuJCgnI2x1Z2dhZ2UnKVswXS5pbm5lckhUTUwgPSAnVGhlcmUgYXJlICcgKyB2YWx1ZSArICcgYnJpZWZjYXNlcy4nO1xyXG4gIH1cclxufTtcclxuXHJcbmxldCBtb2RlbCA9IG5ldyBPYnNlcnZlci5Nb2RlbCh7ZG9nczogMX0pOyBcclxubGV0IG15VmlldyA9IG5ldyBNeVZpZXcoe21vZGVsOiBtb2RlbH0pO1xyXG5cclxubW9kZWwuc2V0KHsncGFzc2VuZ2Vycyc6IDIsICdsdWdnYWdlJzogNX0pOyJdfQ==

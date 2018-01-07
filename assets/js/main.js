// Extend a view class for added functionality
class MyView extends Observer.View {
  initialize(attr) {
    this.model = attr.model;
    this.model.on('change:passengers', this.printPassengers.bind(this));
    this.model.on('change:luggage', this.printluggage.bind(this));
  }

  printPassengers(value) {
    this.$('#passengers')[0].innerHTML = 'There are ' + value + ' passengers.';
  }

  printluggage(value) {
    this.$('#luggage')[0].innerHTML = 'There are ' + value + ' briefcases.';
  }
};

let model = new Observer.Model({dogs: 1}); 
let myView = new MyView({model: model});

model.set({'passengers': 2, 'luggage': 5});
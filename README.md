# Observer-lite
A light, backbone-like type of observer module built on ES2015.

This Observer (pub/sub) module contains basic functionality you can find in popular frameworks such as backbone.js.

<b>Features:</b> Features Model and View classes.<br>
<b>Dependencies:</b> None.<br>
<i><b>Note:</b> Transpile to ES5 for cross-browser compatibility.</i>



<h2>The Model</h2>
Contains data and trigger events when the data changes (unless passed the parameter <b>silent:true</b>). Everytime data changes two events are triggered, a generic “change” event and a name-spaced “change:event” event.<br>
<b>Methods:</b><br>
<b>.set():</b><br>
Add or modify data in model object. This will trigger events for all subscribed views.<br>
<code><b>Syntax 1:</b> model.set( property, value, silent);</code>

<code><b>Syntax 2:</b> 
model.set({
Property: value,
Property: value
}, null, silent);</code><br>
<i><b>Note:</b> Silent is an optional parameter that when set to true won’t fire any event.</i><br>

<b>.get():</b> <br>
Get value from model.<br>
<code><b>Syntax:</b> model.set( property);</code>

<b>.trigger():</b><br>
Forces an event trigger on model.<br>
<code><b>Syntax:</b> model.trigger(event);</code>

<b>.on():</b><br>
Attaches a name-spaced event to a method.<br>
<code><b>Syntax:</b> model.on(‘change:value’, this.method);</code>

<b>.off():</b><br> Removes event from lists of events on model.<br>
<code><b>Syntax:</b> model.off(‘change:value’);</code>


<h2>The View:</h2>
Views subscribe to the models through the built-in <b>.on()</b> method, and they can listen for changes happening on the model’s data so they can react automatically.

<b>Methods:</b><br>
<b>Initialize():</b> If method initialize is declared, it will run automatically when the instance is created.

<b>$():</b> Just like jQuery (and how backbone implemented it) the method this.$() is a handy shorthand for <code>document.querySelectorAll(selector)</code>.


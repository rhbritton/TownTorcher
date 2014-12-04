/** @jsx React.DOM */

var React = require('react')
  , Hammer = require('react-hammerjs')
  , Setup = require('./setup')
  , Render = require('./render')
  , User = require('./user')
  , Move = require('./move')
  , Attack = require('./attack')
  , Tap = require('./tap')

React.initializeTouchEvents(true)

module.exports = React.createClass({
	  componentDidMount: function() {
	  	Setup.init.bind(this)()
	}
	, componentWillUnmount: function() {
		this.unmounting = true
	}
	, action: function(e) {
		var local_x = this.dragon.position.current.x + (e.center.x - this.canvas.width/2)
		  , local_y = this.dragon.position.current.y + (e.center.y - this.canvas.height/2)
		  , obj = Tap.onObject.bind(this)(local_x, local_y)
		
		if(Tap.onSelectHub.bind(this)(e.center.x, e.center.y)) {
			if(Tap.onAttack.bind(this)(e.center.x, e.center.y)) Attack.enemy.bind(this)()
		} else if(obj) {
			// select object
			this.selected = obj
		} else if(Tap.onAttack.bind(this)(e.center.x, e.center.y)) {

		} else {
			this.attacking = false
			

			Move.dragon.bind(this)(local_x, local_y)
		}
	}
	, render: function() {
		return (
			<Hammer action={this.action}>
				<canvas id="canvas"></canvas>
			</Hammer>
		)
	}
})


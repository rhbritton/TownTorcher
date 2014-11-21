/** @jsx React.DOM */

var React = require('react')
  , Hammer = require('react-hammerjs')

module.exports = React.createClass({
	  componentDidMount: function() {
	  	var self = this

	  	this.canvas = this.getDOMNode().querySelector('#canvas')
	  	this.ctx = this.canvas.getContext("2d")

	  	this.dragon_width = 50
	  	this.dragon_height = 50

	  	this.max_acceleration = 0.5
	  	this.terminal_velocity = 5
	  	this.friction = 0.035

	  	this.dragon_velocity = { x: 0, y: 0 }
	  	this.dragon_acceleration = { x: 0, y: 0 }


	  	// this.momentum = { x: 0, y: 0 }
	  	// this.momentum_reduction = 0.25

	  	this.x = parseInt(this.props.level.start.x)
	  	this.y = parseInt(this.props.level.start.y)
	  	
	  	this.background = new Image()
	  	this.background.src = '/src/static/levels/'+this.props.level.id+'/'+this.props.level.id+'.png'

	  	this.dragon = new Image()
	  	this.dragon.src = '/src/static/game/dragon/up.png'

	  	this.background.onload = function() {
	  		window.requestAnimationFrame(self.canvasRender)
	  	}
	}
	, componentWillUnmount: function() {
		this.unmounting = true
	}
	, canvasRender: function() {
		if(this.unmounting) return

		window.requestAnimationFrame(this.canvasRender)

		var dragon_x = this.canvas.width/2-(this.dragon_width/2)
		  , dragon_y = this.canvas.height/2-(this.dragon_height/2)

		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight

		this.implementFriction()
		this.calculateVelocity()

		this.x = this.x+this.dragon_velocity.x
		this.y = this.y+this.dragon_velocity.y

		var background_x = dragon_x+(this.dragon_width/2)-this.x
		  , background_y = dragon_y+(this.dragon_height/2)-this.y

		this.ctx.drawImage(this.background, background_x, background_y, this.background.naturalWidth, this.background.naturalHeight)
		this.ctx.drawImage(this.dragon, dragon_x, dragon_y, this.dragon_width, this.dragon_height)

		
	}
	, calculateVelocity: function() {
		var new_velocity_x = this.dragon_velocity.x + this.dragon_acceleration.x

		if(new_velocity_x > 0 && new_velocity_x > this.terminal_velocity) {
			this.dragon_velocity.x = this.terminal_velocity
		} else if(new_velocity_x < 0 && new_velocity_x < -this.terminal_velocity) {
			this.dragon_velocity.x = -this.terminal_velocity
		} else {
			this.dragon_velocity.x = new_velocity_x
		}

		var new_velocity_y = this.dragon_velocity.y + this.dragon_acceleration.y

		if(new_velocity_y > 0 && new_velocity_y > this.terminal_velocity) {
			this.dragon_velocity.y = this.terminal_velocity
		} else if(new_velocity_y < 0 && new_velocity_y < -this.terminal_velocity) {
			this.dragon_velocity.y = -this.terminal_velocity
		} else {
			this.dragon_velocity.y = new_velocity_y
		}
	}
	, implementFriction: function() {

		if(this.dragon_acceleration.x > 0 && this.dragon_acceleration.x >= this.friction) {
			this.dragon_acceleration.x -= this.friction
		} else if(this.dragon_acceleration.x < 0 && this.dragon_acceleration.x <= -this.friction) {
			this.dragon_acceleration.x += this.friction
		} else {
			this.dragon_acceleration.x = 0
		}

		if(!this.dragon_acceleration.x) {
			if(this.dragon_velocity.x > 0 && this.dragon_velocity.x >= this.friction) {
				this.dragon_velocity.x -= this.friction
			} else if(this.dragon_velocity.x < 0 && this.dragon_velocity.x <= -this.friction) {
				this.dragon_velocity.x += this.friction
			} else {
				this.dragon_velocity.x = 0
			}
		}

		if(this.dragon_acceleration.y > 0 && this.dragon_acceleration.y >= this.friction) {
			this.dragon_acceleration.y -= this.friction
		} else if(this.dragon_acceleration.y < 0 && this.dragon_acceleration.y <= -this.friction) {
			this.dragon_acceleration.y += this.friction
		} else {
			this.dragon_acceleration.y = 0
		}

		if(!this.dragon_acceleration.y) {
			if(this.dragon_velocity.y > 0 && this.dragon_velocity.y >= this.friction) {
				this.dragon_velocity.y -= this.friction
			} else if(this.dragon_velocity.y < 0 && this.dragon_velocity.y <= -this.friction) {
				this.dragon_velocity.y += this.friction
			} else {
				this.dragon_velocity.y = 0
			}
		}
	}
	, accelerateDragon: function(e) {
		if(e.velocityX < this.max_acceleration)
			e.velocityX = this.max_acceleration
		else if(e.velocityX > -this.max_acceleration)
			e.velocityX = -this.max_acceleration

		if(e.velocityY < -this.max_acceleration)
			e.velocityY = this.max_acceleration
		else if(e.velocityY > this.max_acceleration)
			e.velocityY = -this.max_acceleration

		this.dragon_acceleration.x = e.velocityX
		this.dragon_acceleration.y = e.velocityY
	}
	, render: function() {
		return (
			<Hammer onSwipe={this.accelerateDragon}>
				<canvas id="canvas"></canvas>
			</Hammer>
		)
	}
})
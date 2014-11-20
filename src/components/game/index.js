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
	  	this.dragon_speed = 3
	  	this.momentum = { x: 0, y: 0 }
	  	this.momentum_reduction = 0.25

	  	this.x = parseInt(this.props.level.start.x)
	  	this.y = parseInt(this.props.level.start.y)
	  	
	  	this.background = new Image()
	  	this.background.src = '/src/static/levels/'+this.props.level.id+'/'+this.props.level.id+'.png'

	  	this.dragon = new Image()
	  	this.dragon.src = '/src/static/levels/'+this.props.level.id+'/'+this.props.level.id+'.png'


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

		this.changeMomentum()

		this.x = this.x+this.momentum.x
		this.y = this.y+this.momentum.y

		var background_x = dragon_x+(this.dragon_width/2)-this.x
		  , background_y = dragon_y+(this.dragon_height/2)-this.y

		this.ctx.drawImage(this.background, background_x, background_y, this.background.naturalWidth, this.background.naturalHeight)
		this.ctx.drawImage(this.dragon, dragon_x, dragon_y, this.dragon_width, this.dragon_height)

		
	}
	, changeMomentum: function() {
		console.log(this.momentum)
		if(this.momentum.x > 0) {
			if(this.momentum.x < this.momentum_reduction) {
				this.momentum.x = 0
			} else {
				this.momentum.x -= this.momentum_reduction
			}
		} else if(this.momentum.x < 0) {
			if(this.momentum.x > -this.momentum_reduction) {
				this.momentum.x = 0
			} else {
				this.momentum.x += this.momentum_reduction
			}
		} else {
			this.momentum.x = 0
		}

		if(this.momentum.y > 0) {
			if(this.momentum.y < this.momentum_reduction) {
				this.momentum.y = 0
			} else {
				this.momentum.y -= this.momentum_reduction
			}
		} else if(this.momentum.y < 0) {
			if(this.momentum.y > -this.momentum_reduction) {
				this.momentum.y = 0
			} else {
				this.momentum.y += this.momentum_reduction
			}
		} else {
			this.momentum.y = 0
		}
	}
	, moveDragon: function(e) {
		console.log(e)
		var max_velocity = 3

		if(e.velocityX < -max_velocity)
			e.velocityX = -max_velocity
		else if(e.velocityX > max_velocity)
			e.velocityX = max_velocity

		if(e.velocityY < -max_velocity)
			e.velocityY = -max_velocity
		else if(e.velocityY > max_velocity)
			e.velocityY = max_velocity

		this.momentum.x = -e.velocityX*this.dragon_speed
		this.momentum.y = -e.velocityY*this.dragon_speed
	}
	, render: function() {
		return (
			<Hammer onSwipe={this.moveDragon}>
				<canvas id="canvas"></canvas>
			</Hammer>
		)
	}
})
/** @jsx React.DOM */

var React = require('react')
  , Hammer = require('react-hammerjs')


React.initializeTouchEvents(true)

module.exports = React.createClass({
	  componentDidMount: function() {
	  	var self = this
	  	  , remaining = 0

	  	this.canvas = this.getDOMNode().querySelector('#canvas')
	  	this.ctx = this.canvas.getContext("2d")

	  	this.angle = 0

		this.scale = 1

	  	this.dragon_width = 50
	  	this.dragon_height = 50

	  	this.max_acceleration = 0.75
	  	this.terminal_velocity = 2
	  	this.sensitivity = 10
	  	this.absolute_friction = 0.01
	  	this.braking = 10


	  	this.friction = this.absolute_friction
	  	this.dragon_velocity = { x: 0, y: 0 }
	  	this.dragon_acceleration = { x: 0, y: 0 }

	  	this.x = parseInt(this.props.level.start.x)
	  	this.y = parseInt(this.props.level.start.y)
	  	
	  	this.background = new Image()
	  	this.background.src = '/src/static/levels/'+this.props.level.id+'/'+this.props.level.id+'.png'

	  	this.dragon = {
	  		up: new Image(),
	  		down: new Image()
	  	}
	  	this.dragon.up.src = '/src/static/game/dragon/up.png'
	  	this.dragon.down.src = '/src/static/game/dragon/down.png'
	  	remaining++

	  	this.props.level.enemies.forEach(function(enemy, i) {
	  		remaining++
	  		self.props.level.enemies[i].data.img = new Image()
	  		self.props.level.enemies[i].data.img.src = enemy.img

	  		self.props.level.enemies[i].data.img.onload = function() {
		  		if(!--remaining) {
		  			window.requestAnimationFrame(self.canvasRender)
		  		}
		  	}
	  	})

	  	this.background.onload = function() {
	  		if(!--remaining) {
	  			window.requestAnimationFrame(self.canvasRender)
	  		}
	  	}

	  	window.onresize = this.setDimensions.bind(this)
	  	this.setDimensions()
	}
	, setDimensions: function() {
		this.width = window.innerWidth
  		this.height = window.innerHeight
  		this.canvas.width = window.innerWidth*this.scale
  		this.canvas.height = window.innerHeight*this.scale
	}
	, componentWillUnmount: function() {
		this.unmounting = true
	}
	, canvasRender: function() {
		if(this.unmounting) return

		window.requestAnimationFrame(this.canvasRender)

		this.ctx.clearRect(0, 0, this.width, this.height)
		this.ctx.scale(this.scale, this.scale)

		this.implementFriction()
		this.calculateVelocity()

		this.x = this.x+this.dragon_velocity.x
		this.y = this.y+this.dragon_velocity.y

		this.drawLevel()

		this.ctx.scale(1/this.scale, 1/this.scale)
		
	}
	, drawLevel: function() {
		var self = this
		  , dragon_x = self.width/2-(self.dragon_width/2)
		  , dragon_y = self.height/2-(self.dragon_height/2)
		  , background_x = dragon_x+(self.dragon_width/2)-self.x
		  , background_y = dragon_y+(self.dragon_height/2)-self.y

		this.ctx.translate( background_x, background_y )

		self.ctx.drawImage(self.background, 0, 0, self.background.naturalWidth, self.background.naturalHeight)

		self.props.level.enemies.forEach(function(enemy, i) {
			var enemy_x = enemy.x
			  , enemy_y = enemy.y
			  , enemy_height = (enemy.data.img.naturalHeight/enemy.data.img.naturalWidth)*enemy.width
			
			self.ctx.drawImage(enemy.data.img, enemy_x, enemy_y, enemy.width, enemy_height)
	  	})
		
		this.ctx.translate( -background_x, -background_y )

		self.ctx.save()
		self.ctx.translate(self.width/2, self.height/2)
		self.ctx.rotate(this.angle)
		self.ctx.translate(-self.width/2, -self.height/2)
		self.ctx.drawImage(Math.random() < 0.5 ? self.dragon.up : self.dragon.down, dragon_x, dragon_y, self.dragon_width, self.dragon_height)
		self.ctx.restore()
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
		var origin_velocityX = this.dragon_velocity.x
		  , origin_velocityY = this.dragon_velocity.y
		  , dragon_x = this.width/2-(this.dragon_width/2)
		  , dragon_y = this.height/2-(this.dragon_height/2)
		  , radians = (e.angle+90)*Math.PI/180

		this.angle = radians
		this.friction = this.absolute_friction

		this.dragon_velocity.x = 0
		this.dragon_velocity.y = 0

		var is_x_larger = Math.abs(e.velocityX) > Math.abs(e.velocityY)
		  , original_accelerationX = e.velocityX
		  , original_accelerationY = e.velocityY

		if(e.velocityX < this.max_acceleration)
			e.velocityX = this.max_acceleration
		else if(e.velocityX > -this.max_acceleration)
			e.velocityX = -this.max_acceleration

		if(e.velocityY < this.max_acceleration)
			e.velocityY = this.max_acceleration
		else if(e.velocityY > -this.max_acceleration)
			e.velocityY = -this.max_acceleration

		if(is_x_larger==true) {
			e.velocityY = (original_accelerationY/original_accelerationX)*e.velocityX
		} else {
			e.velocityX = (original_accelerationX/original_accelerationY)*e.velocityY
		}

		this.dragon_acceleration.x = e.velocityX
		this.dragon_acceleration.y = e.velocityY
	}
	, increaseFriction: function(e) {
		this.friction = this.absolute_friction*this.braking
	}
	, render: function() {
		return (
			<Hammer onSwipe={this.accelerateDragon} action={this.increaseFriction}>
				<canvas id="canvas"></canvas>
			</Hammer>
		)
	}
})


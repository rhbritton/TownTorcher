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

	  	this.attack_speed = 1000
	  	this.max_acceleration = 0.75
	  	this.terminal_velocity = 2
	  	this.sensitivity = 10
	  	this.absolute_friction = 0.01
	  	this.braking = 10
	  	this.flap_speed = 30
	  	this.frame = 0
	  	this.prevTime = new Date()
	  	this.time = new Date()
	  	this.selected = null
	  	this.attacking = false
	  	

	  	this.friction = this.absolute_friction
	  	this.dragon_velocity = { x: 0, y: 0 }
	  	this.dragon_acceleration = { x: 0, y: 0 }

	  	this.x = this.props.level.start.x
	  	this.y = this.props.level.start.y

	  	this.prevX = this.props.level.start.x
	  	this.prevY = this.props.level.start.y

	  	this.setUpDragonData()
	  	
	  	this.background = new Image()
	  	this.background.src = '/src/static/levels/'+this.props.level.id+'/'+this.props.level.id+'.png'

	  	
	  	this.defeated_enemies = []

	  	remaining++

	  	this.props.level.enemies.forEach(function(enemy, i) {
	  		remaining++
	  		self.props.level.enemies[i].data.img = new Image()
	  		self.props.level.enemies[i].data.img.src = enemy.img
	  		self.props.level.enemies[i].data.index = i

	  		self.props.level.enemies[i].current_hp = self.props.level.enemies[i].hp

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
	, setUpDragonData: function() {
		this.dragon = {
	  		up: new Image(),
	  		down: new Image()
	  	}
	  	this.dragon.up.src = '/src/static/game/dragon/up.png'
	  	this.dragon.down.src = '/src/static/game/dragon/down.png'

	  	this.dragon.hp = 10
	  	this.dragon.current_hp = 10
	  	this.dragon.attack = 1
	  	this.dragon.exp = 0
	  	this.dragon.level = this.calcLevel()
	}
	, setDimensions: function() {
		this.width = window.innerWidth
  		this.height = window.innerHeight
  		this.canvas.width = window.innerWidth*this.scale
  		this.canvas.height = window.innerHeight*this.scale

  		this.selectHub = {
	  		  width: this.width
	  		, height: 75
	  		, x: 0
	  	}
	  	this.selectHub.y = this.canvas.height - this.selectHub.height

	  	this.dragonHub = {
	  		  width: this.width
	  		, height: 75
	  		, x: 0
	  		, y: 0
	  	}
	}
	, componentWillUnmount: function() {
		this.unmounting = true
	}
	, canvasRender: function() {
		if(this.unmounting) return

		window.requestAnimationFrame(this.canvasRender)

		this.frame++
		this.prevTime = this.time
		this.time = new Date()

		if(this.attacking) {
			if(this.selected) {
				this.continueAttack()
			} else {
				this.attacking = false
			}
		}

		this.ctx.clearRect(0, 0, this.width, this.height)
		this.ctx.scale(this.scale, this.scale)

		this.implementFriction()
		this.calculateVelocity()

		this.prevX = this.x
		this.prevY = this.y

		var newX = this.x+this.dragon_velocity.x
		  , newY = this.y+this.dragon_velocity.y
		
		if(newX > 0 && newX < this.background.naturalWidth) this.x = newX

		if(newY > 0 && newY < this.background.naturalHeight) this.y = newY

		this.drawLevel()
		if(this.selected)
			this.drawSelected()

		this.drawDragonHub()

		this.ctx.scale(1/this.scale, 1/this.scale)
		
	}
	, drawDragonHub: function() {
		this.ctx.fillStyle = 'white'
		this.ctx.fillRect(this.dragonHub.x, this.dragonHub.y, this.dragonHub.width, this.dragonHub.height)

		this.ctx.font = '15px Calibri'
		this.ctx.lineWidth = '10'
		this.ctx.fillStyle = 'black'

		this.ctx.fillText('Level:  ' + this.dragon.level, this.dragonHub.x+20, this.dragonHub.y+this.dragonHub.height-55)
		this.ctx.fillText('Hp:  ' + this.dragon.current_hp+'/'+this.dragon.hp, this.dragonHub.x+20, this.dragonHub.y+this.dragonHub.height-15)
		this.ctx.fillText('Atk:  ' + this.dragon.attack, this.dragonHub.x+20, this.dragonHub.y+this.dragonHub.height-35)
		
		this.ctx.fillStyle = 'blue'
		var exp_bar = this.calcExpBarPercentage()
		this.ctx.fillRect(this.dragonHub.x+100, this.dragonHub.y+this.dragonHub.height-40, exp_bar ? exp_bar*this.dragonHub.width-125 : 0, 5)
		
		this.ctx.fillStyle = 'green'
		this.ctx.fillRect(this.dragonHub.x+100, this.dragonHub.y+this.dragonHub.height-30, (this.dragon.current_hp/this.dragon.hp)*this.selectHub.width-125, 20)
			
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
			if(enemy.current_hp > 0) {
				var enemy_height = (enemy.data.img.naturalHeight/enemy.data.img.naturalWidth)*enemy.width
				self.ctx.drawImage(enemy.data.img, enemy.x, enemy.y, enemy.width, enemy_height)

				if(self.selected && self.selected.data.index == i) {
					drawEnemyArrow(enemy, 4, 5)
				} else {
					drawEnemyArrow(enemy, 2, 10)
				}
				self.ctx.drawImage(enemy.data.img, enemy.x, enemy.y, enemy.width, enemy_height)
			}
	  	})

	  	function drawEnemyArrow(enemy, line_width, y) {
	  		var start_point = { x: enemy.x+enemy.width/2 - 10, y: enemy.y-y-10 }

	  		self.ctx.beginPath()
	  		self.ctx.lineWidth = line_width
			self.ctx.strokeStyle = 'yellow'

	  		self.ctx.moveTo(start_point.x, start_point.y)
	  		self.ctx.lineTo(start_point.x+10, start_point.y+10)
	  		self.ctx.lineTo(start_point.x+20, start_point.y)

			self.ctx.stroke()
	  		self.ctx.closePath()
	  	}
		
		this.ctx.translate( -background_x, -background_y )

		self.ctx.save()
		self.ctx.translate(self.width/2, self.height/2)
		self.ctx.rotate(this.angle)
		self.ctx.translate(-self.width/2, -self.height/2)


		if(Math.floor(self.frame/self.flap_speed) % 2 == 1) 
			self.ctx.drawImage(self.dragon.up, dragon_x, dragon_y, self.dragon_width, self.dragon_height)
		else
			self.ctx.drawImage(self.dragon.down, dragon_x, dragon_y, self.dragon_width, self.dragon_height)

		self.ctx.restore()
	}
	, drawSelected: function() {
		this.ctx.fillStyle = 'white'
		this.ctx.fillRect(this.selectHub.x, this.selectHub.y, this.selectHub.width, this.selectHub.height)
		this.ctx.fillStyle = 'black'
		this.ctx.font = '18px Calibri'
		this.ctx.lineWidth = '15'
		this.ctx.fillText(this.selected.name, this.selectHub.x+20, this.selectHub.y+20)

		this.ctx.font = '15px Calibri'
		this.ctx.lineWidth = '10'
		this.ctx.fillStyle = 'black'
		

		this.ctx.fillText('Hp:  ' + this.selected.current_hp+'/'+this.selected.hp, this.selectHub.x+20, this.selectHub.y+this.selectHub.height-15)
		this.ctx.fillText('Atk:  ' + this.selected.attack, this.selectHub.x+20, this.selectHub.y+this.selectHub.height-35)
		
		this.ctx.fillStyle = 'green'
		this.ctx.fillRect(this.selectHub.x+100, this.selectHub.y+this.selectHub.height-30, (this.selected.current_hp/this.selected.hp)*this.selectHub.width-125, 20)
		

		if(this.checkIfSelectedIsInRange()) {
			if(this.attacking) {
				this.ctx.fillStyle = 'blue'
			} else {
				this.ctx.fillStyle = 'red'
			}
			this.ctx.fillRect(this.selectHub.x+this.selectHub.width-105, this.selectHub.y+10, 80, 25)
			this.ctx.fillStyle = 'white'
			this.ctx.font = '17px Calibri'
			this.ctx.lineWidth = '17'
			this.ctx.fillText('Attack!', this.selectHub.x+this.selectHub.width-90, this.selectHub.y+28)
		}
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

		this.attacking = false

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
	, showStats: function(obj) {
		this.selected = obj
	}
	, attack: function() {
		this.dragon_acceleration.x = 0
		this.dragon_acceleration.y = 0
		this.dragon_velocity.x = 0
		this.dragon_velocity.y = 0

		this.attacking = true
		
		this.calcAngle(this.x - this.selected.x, this.y - this.selected.y)

	}
	, calcLevel: function() {
		var level = Math.floor(Math.sqrt(this.dragon.exp))

		if(level <= 0) level = 1

		return level
	}
	, calcExp: function(level) {
		var exp = Math.pow(level, 2)
		if(level <= 1) exp = 0

		return exp
	}
	, calcExpBarPercentage: function() {
		return (this.dragon.exp - this.calcExp(this.dragon.level))/(this.calcExp(this.dragon.level+1) - this.calcExp(this.dragon.level))
	}
	, continueAttack: function() {
		if(!this.lastAttackTime) this.lastAttackTime = new Date()

		if(this.time - this.lastAttackTime >= this.attack_speed) {
			this.lastAttackTime = this.time			

			if(this.dragon.current_hp <= 1) {
				this.dragon.current_hp = 0
				this.attacking = 0
				// Dragon Dies
			} else {
				this.dragon.current_hp--

				if(this.selected.current_hp <= 1) {
					this.dragon.exp += this.selected.attack*this.selected.hp
					var level = this.calcLevel()
					if(this.dragon.level != level) this.dragon.current_hp = this.dragon.hp
					this.dragon.level = level
					this.selected.current_hp = 0
					this.attacking = 0
					this.selected = null
				} else {
					this.selected.current_hp--
				}
			}
		}
	}
	, calcAngle: function(x_diff, y_diff) {
		var angle = 0

		if(x_diff > 0 && y_diff > 0) {
			angle = 315
		} else if(x_diff > 0 && y_diff < 0) {
			angle = 225
		} else if(x_diff < 0 && y_diff < 0) {
			angle = 135
		} else if(x_diff < 0 && y_diff > 0) {
			angle = 45
		}

		this.angle = ((angle)*Math.PI/180)
	}
	, action: function(e) {
		var local_x = this.x+e.center.x-this.width/2
		  , local_y = this.y+e.center.y-this.height/2
		  , obj
		  , selectHub = this.checkSelectHubClick(e.center.x, e.center.y)
		  , attack = this.checkAttackClick(e.center.x, e.center.y)
		
		if(selectHub) {
			if(attack) {
				this.attack()
			}
		} else {
			this.attacking = false

			if(Math.abs(this.dragon_velocity.x) == 0 && Math.abs(this.dragon_velocity.y) == 0) {
				this.selected = null
			}

			obj = this.checkLocation(local_x, local_y)

			if(obj)
				this.showStats(obj)

			this.friction = this.absolute_friction*this.braking
		}
	}
	, checkSelectHubClick: function(x, y) {
		if(this.selected) {
			var top = this.selectHub.y
			  , bottom = this.selectHub.y+this.selectHub.height
			  , left = this.selectHub.x
			  , right = this.selectHub.x+this.selectHub.width

			if(x>left && x<right) {
				if(y>top && y<bottom) {
					return true
				}
			}
		}

		return false
	}
	, checkAttackClick: function(x, y) {
		if(this.selected) {
			var top = this.selectHub.y+10
			  , bottom = this.selectHub.y+10+25
			  , left = this.selectHub.x+this.selectHub.width-105
			  , right = this.selectHub.x+this.selectHub.width-105+80

			if(x>left && x<right) {
				if(y>top && y<bottom) {
					return true
				}
			}
		}

		return false
		
	}
	, checkLocation: function(x, y) {
		var ret
		this.props.level.enemies.some(function(enemy) {
			if(enemy.current_hp > 0) {
				var top = enemy.y
				  , bottom = enemy.y+enemy.height
				  , left = enemy.x
				  , right = enemy.x+enemy.width

				if(x>left && x<right) {
					if(y>top && y<bottom) {
						ret = enemy
						return
					}
				}
			}
		})

		return ret
	}
	, checkIfSelectedIsInRange: function() {
		if(this.selected) {
			if(this.boxContains(
				  {
				  	  left: this.x - this.dragon_width/2
				  	, right: this.x + this.dragon_width/2
				  	, top: this.y - this.dragon_height/2
				  	, bottom: this.y + this.dragon_height/2
				  }
				, {
					  left: this.selected.x - this.selected.range
					, right: this.selected.x + this.selected.width + this.selected.range
					, top: this.selected.y - this.selected.range
					, bottom: this.selected.y + this.selected.height + this.selected.range
				}
			)) {
				return true
			}
		}

		return false	
	}
	, boxContains: function(box1, box2) {
		if(box1.left <= box2.right) {
			if(box1.right >= box2.left) {
				if(box1.top <= box2.bottom) {
					if(box1.bottom >= box2.top) {
						return true
					}
				}
			}
		}

		return false
	}
	, render: function() {
		return (
			<Hammer onSwipe={this.accelerateDragon} action={this.action}>
				<canvas id="canvas"></canvas>
			</Hammer>
		)
	}
})


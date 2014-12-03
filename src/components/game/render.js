var Render = module.exports
  , User = require('./user')
  , Attack = require('./attack')

Render.render = function() {
	if(this.unmounting) return

	window.requestAnimationFrame(Render.render.bind(this))

	this.prev_time = this.time
	this.time = new Date()

	if(this.dragon.attacking) {
		if(this.selected) {
			// continue Attacking -- this.continueAttack()
		} else {
			this.dragon.attacking = false
		}
	}

	this.ctx.clearRect(0, 0, this.width, this.height)
	this.ctx.scale(this.scale, this.scale)

	drawLevel.bind(this)()
	if(this.selected)
		drawSelected.bind(this)()

	drawDragonHub.bind(this)()

	this.ctx.scale(1/this.scale, 1/this.scale)
}

function drawDragonHub() {
	var self = this

	this.ctx.fillStyle = 'white'
	this.ctx.fillRect(this.dragonHub.x, this.dragonHub.y, this.dragonHub.width, this.dragonHub.height)

	this.ctx.font = '15px Calibri'
	this.ctx.lineWidth = '10'
	this.ctx.fillStyle = 'black'

	drawStats()
	drawExpBar()
	drawHealthBar()

	function drawStats() {
		self.ctx.fillText('Level:  ' + self.dragon.level, self.dragonHub.x+20, self.dragonHub.y+self.dragonHub.height-55)
		self.ctx.fillText('Hp:  ' + self.dragon.current_hp+'/'+self.dragon.hp, self.dragonHub.x+20, self.dragonHub.y+self.dragonHub.height-15)
		self.ctx.fillText('Atk:  ' + self.dragon.attack, self.dragonHub.x+20, self.dragonHub.y+self.dragonHub.height-35)
	}

	function drawExpBar() {
		self.ctx.fillStyle = 'blue'
		var exp_bar = User.calcExpBarPercentage.bind(self)()
		self.ctx.fillRect(self.dragonHub.x+100, self.dragonHub.y+self.dragonHub.height-40, exp_bar ? exp_bar*self.dragonHub.width-125 : 0, 5)
	}

	function drawHealthBar() {
		self.ctx.fillStyle = 'green'
		self.ctx.fillRect(self.dragonHub.x+100, self.dragonHub.y+self.dragonHub.height-30, (self.dragon.current_hp/self.dragon.hp)*self.selectHub.width-125, 20)	
	}
}

function drawLevel() {
	this.ctx.save()
	this.ctx.translate(this.width/2, this.height/2)

	drawWorld.call(this)
	drawDragon.call(this)

	this.ctx.restore()
}

function drawWorld() {
	var self = this

	self.ctx.save()
	self.ctx.translate(-self.dragon.position.current.x, -self.dragon.position.current.y)
	
	self.ctx.drawImage(self.background.img, 0, 0, self.background.img.naturalWidth, self.background.img.naturalHeight)

	this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
	self.props.level.enemies.forEach(function(enemy, i) {
		if(enemy.current_hp > 0) {
			var enemy_height = (enemy.data.img.naturalHeight/enemy.data.img.naturalWidth)*enemy.width

			if(self.selected && self.selected.data.index == i) {
				self.ctx.fillRect(enemy.x - enemy.range, enemy.y - enemy.range, enemy.width + enemy.range*2, enemy.height + enemy.range*2)
				drawEnemyArrow.bind(self)(enemy, 4, 5)
			} else {
				drawEnemyArrow.bind(self)(enemy, 2, 10)
			}
			self.ctx.drawImage(enemy.data.img, enemy.x, enemy.y, enemy.width, enemy_height)
		}
  	})

	self.ctx.restore()
}

function drawDragon() {
	this.ctx.rotate(this.angle)

	if(Math.floor(this.frame/this.flap_speed) % 2 == 1) 
		this.ctx.drawImage(this.dragon.state.up, -this.dragon.width/2, -this.dragon.height/2, this.dragon.width, this.dragon.height)
	else
		this.ctx.drawImage(this.dragon.state.down, -this.dragon.width/2, -this.dragon.height/2, this.dragon.width, this.dragon.height)
}

function drawEnemyArrow(enemy, line_width, y) {
	var start_point = { x: enemy.x+enemy.width/2 - 10, y: enemy.y-y-10 }

	this.ctx.beginPath()
	this.ctx.lineWidth = line_width
	this.ctx.strokeStyle = 'yellow'

	this.ctx.moveTo(start_point.x, start_point.y)
	this.ctx.lineTo(start_point.x+10, start_point.y+10)
	this.ctx.lineTo(start_point.x+20, start_point.y)

	this.ctx.stroke()
	this.ctx.closePath()
}

function drawSelected() {
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
	
	if(Attack.objectInRange.bind(this)()) {
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
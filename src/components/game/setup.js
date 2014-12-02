var Setup = module.exports
  , User = require('./user')
  , Render = require('./render')

Setup.init = function() {
	var self = this

  	self.canvas = self.getDOMNode().querySelector('#canvas')
  	self.ctx = self.canvas.getContext("2d")

	self.scale = 1
  	self.attack_frequency = 2 // attacks/s
  	self.prev_time = new Date()
  	self.time = new Date()
  	self.selected = null

  	self.defeated_enemies = []

  	setUpDragonData.bind(self)()
  	buildEnvironment.bind(self)()

  	window.onresize = setDimensions.bind(self)
  	setDimensions.bind(self)()
}

function setUpDragonData() {
	this.dragon = {
  		  angle: 0 // degrees
  		, width: 50 // pixels
  		, height: 50 // pixels
  		, terminal_velocity: 2 // px/s
  		, flap_speed: 500 // ms
  		, attacking: null
  		, velocity: {
  			  x: 0 // px/s
  			, y: 0 // px/s
  		}
  		, position: {
  			  current: {
  			    x: this.props.level.start.x // px
  			  , y: this.props.level.start.y // px
  			}
  			, previous: {
  			    x: this.props.level.start.x // px
  			  , y: this.props.level.start.y // px
  			}
  			, destination: {
  				x: this.props.level.start.x // px
  			  , y: this.props.level.start.y // px
  			}
  		}
  		, state: {
  			up: new Image(),
  			down: new Image()
  		}
  		, hp: 10
  		, current_hp: 10
  		, attack: 1
  		, exp: 0
  	}
	
	this.dragon.level = User.calcLevel.bind(this)()
  	this.dragon.state.up.src = '/src/static/game/dragon/up.png'
  	this.dragon.state.down.src = '/src/static/game/dragon/down.png'
}

function buildEnvironment() {
	var self = this
	  , loading_images = 0

	self.background = {}
	self.background.img = new Image()
  	self.background.img.src = '/src/static/levels/'+self.props.level.id+'/'+self.props.level.id+'.png'

  	loading_images++

  	self.props.level.enemies.forEach(function(enemy, i) {
  		loading_images++
  		self.props.level.enemies[i].data.img = new Image()
  		self.props.level.enemies[i].data.img.src = enemy.img
  		self.props.level.enemies[i].data.index = i

  		self.props.level.enemies[i].current_hp = self.props.level.enemies[i].hp

  		self.props.level.enemies[i].data.img.onload = function() {
	  		if(!--loading_images) {
	  			window.requestAnimationFrame(Render.render.bind(self))
	  		}
	  	}
  	})

  	self.background.img.onload = function() {
  		if(!--loading_images) {
  			window.requestAnimationFrame(Render.render.bind(self))
  		}
  	}
}

function setDimensions() {
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
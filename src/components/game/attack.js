var Attack = module.exports
  , Move = require('./move')

Attack.enemy = function() {
	this.dragon_acceleration.x = 0
	this.dragon_acceleration.y = 0
	this.dragon_velocity.x = 0
	this.dragon_velocity.y = 0

	this.attacking = true
	
	faceObject(this.x - this.selected.x, this.y - this.selected.y)
}

Attack.objectInRange = function() {
	if(this.selected) {
		if(Move.boxContains(
			  {
			  	  left: this.dragon.position.current.x
			  	, right: this.dragon.position.current.x
			  	, top: this.dragon.position.current.y
			  	, bottom: this.dragon.position.current.y
			  }
			, {
				  left: this.selected.x - this.dragon.range
				, right: this.selected.x + this.selected.width/2 + this.dragon.range
				, top: this.selected.y - this.dragon.range
				, bottom: this.selected.y + this.selected.height/2 + this.dragon.range
			}
		)) {
			return true
		}
	}

	return false
}

Attack.continue = function() {
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
				var level = User.calcLevel.bind(this)()
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

function faceObject(x_diff, y_diff) {
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
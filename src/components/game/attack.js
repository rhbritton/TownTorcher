var Attack = module.exports
  , Move = require('./move')

Attack.enemy = function() {
	this.attacking = true
	
	faceObject(this.dragon.position.current.x - this.selected.x, this.dragon.position.current.y - this.selected.y)
}

Attack.objectInRange = function() {
	if(this.selected) {
		if(Move.boxContains(
			  {
			  	  left: this.dragon.position.current.x - this.dragon.width/2 - this.dragon.range
			  	, right: this.dragon.position.current.x + this.dragon.width/2 + this.dragon.range
			  	, top: this.dragon.position.current.y  - this.dragon.height/2 - this.dragon.range
			  	, bottom: this.dragon.position.current.y + this.dragon.height/2 + this.dragon.range
			  }
			, {
				  left: this.selected.x
				, right: this.selected.x + this.selected.width
				, top: this.selected.y
				, bottom: this.selected.y + this.selected.height
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
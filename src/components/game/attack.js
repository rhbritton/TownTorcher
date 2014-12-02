var Attack = module.exports

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
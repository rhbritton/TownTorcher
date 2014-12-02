var Tap = module.exports

Tap.onSelectHub = function(x, y) {
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

Tap.onAttack = function(x, y) {
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

Tap.onObject = function(x, y) {
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
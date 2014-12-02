var Move = module.exports

Move.dragon = function(x, y) {

	this.dragon.position.previous.x = this.dragon.position.current.x
	this.dragon.position.previous.y = this.dragon.position.current.y

	this.dragon.position.current.x = x
	this.dragon.position.current.y = y

	// calculate new position given Point this.dragon.position.destination, Vector this.dragon.velocity, Point this.dragon.position.current
	

	

	// console.log(e)

	// var relative_x = this.x - x
	//   , relative_ y = this.y - y

	// if(Math.abs(relative_x) > Math.abs(relative_y)) {
	// 	this.velocity.x = this.terminal_velocity
	// 	this.velocity.y = this.velocity.x*(relative_y/relative_x)
	// } else {
	// 	this.velocity.y = this.terminal_velocity
	// 	this.velocity.x = this.velocity.y*(relative_x/relative_y)
	// }

	// this.last_time = new Date()
	// this.velocity
}

Move.boxContains = function(box1, box2) {
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
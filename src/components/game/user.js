var User = module.exports

User.calcLevel = function() {
	var level = Math.floor(Math.sqrt(this.dragon.exp))

	if(level <= 0) level = 1

	return level
}

User.calcExp = function(level) {
	var exp = Math.pow(level, 2)
	if(level <= 1) exp = 0

	return exp
}

User.calcExpBarPercentage = function() {
	return (this.dragon.exp - User.calcExp(this.dragon.level))/(User.calcExp(this.dragon.level+1) - User.calcExp(this.dragon.level))
}
/** @jsx React.DOM */

var React = require('react')
  , LevelsJSON = require('../../static/levels.json')

module.exports = React.createClass({
	loadLevel: function(level) {
		this.props.onLoad(level)
	}
	, render: function() {
		var self = this
		  , levels = Object.keys(LevelsJSON)
		
		return (
			<div id="levels">
				{levels.map(function(key) {
					return (
						<div class="level" onClick={self.loadLevel.bind(self, LevelsJSON[key])}>
							{LevelsJSON[key].name}
						</div>
					)
				})}
			</div>
		)
	}
})
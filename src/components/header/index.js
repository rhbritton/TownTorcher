/** @jsx React.DOM */

var React = require('react')
  , Gold = require('./gold')

module.exports = React.createClass({
	render: function() {
		return (
			<div id="header" onClick={this.props.onClick}>
				<Gold gold={this.props.gold} />

			</div>
		)
	}
})
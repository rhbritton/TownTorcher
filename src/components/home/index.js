/** @jsx React.DOM */

var React = require('react')

module.exports = React.createClass({
	render: function() {
		return (
			<div id="home" onClick={this.props.onClick}>
				<h1>TownTorcher</h1>
			</div>
		)
	}
})
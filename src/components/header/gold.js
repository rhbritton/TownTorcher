/** @jsx React.DOM */

var React = require('react')

module.exports = React.createClass({
	render: function() {
		return ( 
			<div class="gold">
				<img src="" />
				<span class="amount">{this.props.gold}</span>
			</div>
		)
	}
})
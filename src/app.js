var React = require('react')
  , Header = require('./components/header/index')
  , Home = require('./components/home/index')
  , Game = require('./components/game/index')
  , Levels = require('./components/levels/index')
  , LevelsJSON = require('./static/levels.json')

require('./styles/core.styl')
require('./styles/header/core.styl')

require('./styles/home/core.styl')
require('./styles/levels/core.styl')
require('./styles/game/core.styl')

var App = React.createClass({
	  getInitialState: function() {
        return {
              gold: 12
            , levels: [{
            	  name: 'Lonely Farmlands 1'
            }]
            , view: 'Home'
        }
    }
    , gainGold: function() {
    	this.setState({
            gold: this.state.gold+1
        })
    }
    , loadLevelSelect: function() {
    	this.setState({
    		view: 'Levels'
    	})
    }
    , loadLevel: function(level) {
    	this.setState({
    		  view: 'Game'
    		, level: level.id
    	})
    }
	, render: function() {
		if(this.state.view == 'Home') {
			return <Home onClick={this.loadLevelSelect} />
		} else if(this.state.view == 'Levels') {
			return (
				<div id="levels">
					<Header gold={this.state.gold} onClick={this.gainGold} />
					<Levels levels={this.state.levels} onLoad={this.loadLevel} />
				</div>
			)
		} else if(this.state.view == 'Game') {
			return (
				<Game level={LevelsJSON[this.state.level]} />
			)
		}
		
	}
})

React.render(
	  <App />
	, document.getElementById('app')
)
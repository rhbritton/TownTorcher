module.exports = {
	  entry: './src/app.js'
	, output: {
		  path: 'bin/'
		, filename: 'app.js'
		, publicPath: '/bin/'
	}
	, module: {
		loaders: [
			{
				test: /\.js$/
			  , loader: 'jsx-loader'
			}
			, { 
				test: /\.styl$/
			  , loader: 'style-loader!css-loader!stylus-loader'
			}
			, { 
				test: /\.json$/
			  , loader: 'json-loader'
			}
		]
	}
	, externals: []
	, devtool: 'sourcemap'
	, debug: true
}
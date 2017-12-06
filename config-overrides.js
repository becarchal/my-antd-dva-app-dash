const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const autoprefixer = require('autoprefixer');

function cssModule() {
	return function(config, env) {
		const	cssRules = 
		{
			test: /\.css$/,
			use: [
				require.resolve('style-loader'),
				{
					loader: require.resolve('css-loader'),
					options: {
						modules: true,
						localIdentName: '[path][name]__[local]__[hash:base64:5]',
						importLoaders: 1,
					},
				},
				{
					loader: require.resolve('postcss-loader'),
					options: {
						// Necessary for external CSS imports to work
						// https://github.com/facebookincubator/create-react-app/issues/2677
						ident: 'postcss',
						plugins: () => [
							require('postcss-flexbugs-fixes'),
							autoprefixer({
								browsers: [
									'>1%',
									'last 4 versions',
									'Firefox ESR',
									'not ie < 9', // React doesn't support IE8 anyway
								],
								flexbox: 'no-2009',
							}),
						],
					},
				},
			],
		};
	  const oneOfRule = config.module.rules.find((rule) => rule.oneOf !== undefined);
	  if (oneOfRule) {
		oneOfRule.oneOf.unshift(cssRules);
	  }
	  else {
		// Fallback to previous behaviour of adding to the end of the rules list.
		config.module.rules.push(cssRules);
	  }
  
	  return config;
	};
}
module.exports = function override(config, env) {
	// do stuff with the webpack config...
	config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
	config = injectBabelPlugin("transform-runtime", config);
	config = injectBabelPlugin("syntax-dynamic-import", config);
	if (env === "development") {
		config = injectBabelPlugin("dva-hmr", config);
	}
	config = rewireLess.withLoaderOptions({
	   modifyVars: { "@primary-color": "#1DA57A" },
	})(config, env);
	config = cssModule()(config, env);
	return config;
};
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
	entry: {
		build: "./src/index.js"
	},
	output: {
		path: path.resolve(__dirname, "./dist/"),
		filename: "[name].js",
		publicPath: "/"
	},
	devServer: {
		contentBase: path.join(__dirname, "/"),
		overlay: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: "babel-loader"
				}]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader, // перемещает css в отдельный файл
					"css-loader", 				 // интерпретация import/require()
					"postcss-loader",			 // обработка css плагинами постобработки
					"sass-loader"			 	 // интерпретация синтаксиса scss в css
				]
			},
			{
				test: /\.(svg|png)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'img/'
						}
					}
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "build.css"
		}),
		new HtmlWebpackPlugin({
			template: __dirname + "/src/index.html",
			inject: 'body',
			filename: "index.html"
		})
	]
};

module.exports = (env, options) => {
	let development = options.mode === "development"; // -> (boolean)
	config.devtool = development ? "eval-sourcemap" : "source-map";
	return config;
};

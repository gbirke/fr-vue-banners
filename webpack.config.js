const StyleLintPlugin = require( 'stylelint-webpack-plugin' );
const toml = require( 'toml' );
const webpack = require( 'webpack' );
const { merge } = require( 'webpack-merge' );
const { exec } = require( 'child_process' );
const fs = require( 'fs/promises' );
const path = require( 'path' );
const webpackBuildApiRoute = require( './webpack/build_api' );
const { campaignInfoToCampaignConfig } = require( './webpack/convert_info_to_type' );
const CommonConfig = require( './webpack.common.js' );

const getBranch = () => new Promise( ( resolve ) => {
	return exec( 'git rev-parse --abbrev-ref HEAD', ( err, stdout ) => {
		if ( err ) {
			console.log( `getBranch Error: ${err}` );
			resolve( `UNKNOWN - ${err}` );
		} else if ( typeof stdout === 'string' ) {
			resolve( stdout.trim() );
		}
	} );
} );

// eslint-disable-next-line security/detect-non-literal-fs-filename
const readCampaignFile = ( fileName ) => fs.readFile( fileName, 'utf8' )
	.then( contents => toml.parse( contents ) );

module.exports = ( env ) => Promise.all( [
	getBranch(),
	readCampaignFile( env.campaign_info ?? 'campaign_info.toml' )
] ).then( ( [ currentBranch, campaignConfig ] ) => merge(
	CommonConfig( env ),
	{
		mode: 'development',
		entry: {
			dashboard: './dashboard/dashboard.ts',
			// eslint-disable-next-line camelcase
			inject_tracking: './dashboard/inject_tracking.ts'
		},
		resolve: {
			alias: {
				'@environment': path.resolve( __dirname, 'src/environment/dev/' )
			}
		},
		plugins: [
			new webpack.DefinePlugin( {
				CAMPAIGNS: JSON.stringify( campaignInfoToCampaignConfig( campaignConfig ) ),
				GIT_BRANCH: JSON.stringify( currentBranch )
			} ),
			new StyleLintPlugin( {
				files: [ '**/*.{vue,css,sss,less,scss,sass}' ]
			} )
		],
		devServer: {
			'port': 8084,
			'allowedHosts': 'all',
			'static': [
				{
					directory: path.resolve( __dirname, 'dist' ),
					publicPath: '/compiled-banners/'
				},
				{
					directory: path.resolve( __dirname, 'dashboard' ),
					publicPath: '/',
					serveIndex: false
				}
			],
			'headers': {
				'Access-Control-Allow-Origin': '*'
			},
			'proxy': [
				{
					context: [ '/mobile' ],
					pathRewrite: { '^/mobile': '' },
					target: 'https://de.m.wikipedia.org',
					changeOrigin: true
				},
				{
					context: [ '/en-mobile' ],
					pathRewrite: { '^/en-mobile': '' },
					target: 'https://en.m.wikipedia.org',
					changeOrigin: true
				},
				{
					context: [ '/wiki/Main_Page' ],
					target: 'https://en.wikipedia.org',
					changeOrigin: true
				},
				{
					context: [ '/wikipedia.de', '/FundraisingBanners', '/img', '/js', '/style.css', '/suggest.js' ],
					pathRewrite: { '^/wikipedia.de': '' },
					target: 'https://www.wikipedia.de',
					changeOrigin: true
				},
				{
					context: [ '/wiki', '/w/', '/static' ],
					target: 'https://de.wikipedia.org',
					changeOrigin: true
				}
			],

			'setupMiddlewares': ( middlewares, devServer ) => {
				if ( !devServer ) {
					throw new Error( 'webpack-dev-server is not defined' );
				}

				devServer.app.get( '/compile-banner/:bannerName', webpackBuildApiRoute );

				return middlewares;
			}
		}
	} ) );

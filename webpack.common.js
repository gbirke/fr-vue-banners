const { VueLoaderPlugin } = require( 'vue-loader' );
const path = require( 'path' );

const CampaignConfig = require( './webpack/campaign_config' );

module.exports = ( env ) => {
	const campaigns = CampaignConfig.readFromFile( env.campaign_info ?? 'campaign_info.toml' );
	return {
		entry: campaigns.getEntryPoints(),
		output: {
			filename: '[name].js',
			path: path.resolve( __dirname, 'dist' ),
			publicPath: '/'
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					loader: 'ts-loader',
					options: {
						appendTsSuffixTo: [ /\.vue$/ ]
					}
				},
				// This is a "special" rule for all wikipedia.de banner entry points. It should be in sync with the rules for `.ts` files.
				// It replaces tracking parameter placeholders with tracking parameters read from the campaign configuration.
				{
					test: /(wpde_desktop|wpde_mobile)\/\w+\/banner(_ctrl|_var)\.ts/,
					use: [
						{
							loader: 'ts-loader',
							options: {
								appendTsSuffixTo: [ /\.vue$/ ]
							}
						},
						{
							loader: 'string-replace-loader',
							options: {
								search: /!insert-(campaign|keyword)-here!/g,
								/**
								 * @param { string } match The whole matched placeholder
								 * @param { string } captureGroupMatch Either "campaign" or "keyword" from the regex match group
								 * @return { string }
								 */
								replace( match, captureGroupMatch ) {
									const tracking = campaigns.getCampaignTrackingForEntryPoint( this.resource );
									const placeholderToTrackingKeyMap = {
										campaign: 'campaignTracking',
										keyword: 'bannerTracking'
									};
									return tracking[ placeholderToTrackingKeyMap[ captureGroupMatch ] ];
								}
							}
						}
					]
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.html$/,
					use: 'html-loader'
				},
				{
					test: /\.(scss|css)$/,
					use: [
						'style-loader',
						'css-loader',
						{
							loader: 'sass-loader',
							options: {
								sassOptions: {
									// This option allows us to specify a project-relative path in our SCSS files
									// see https://sass-lang.com/documentation/at-rules/import/#load-paths
									loadPaths: [
										path.resolve( __dirname )
									]
								}
							}
						}
					]
				}
			]
		},
		resolve: {
			extensions: [ '.ts', '.js', '.json' ],
			alias: {
				'@banners': path.resolve( __dirname, 'banners' ),
				'@src': path.resolve( __dirname, 'src' )
			},
			fallback: {
				// Don't import node.js 'path' polyfill in compiled code. it shouldn't be used.
				path: false
			}
		},
		plugins: [
			new VueLoaderPlugin()
		]
	};
};

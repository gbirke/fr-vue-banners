const rimraf = require( 'rimraf' );
const { mergeWithCustomize, customizeObject } = require( 'webpack-merge' );
const fs = require( 'fs' );
const path = require( 'path' );
const CampaignConfig = require( './webpack/campaign_config' );
const LoadVueOnWpde = require( './webpack/load_vue_on_wpde' );
const MediaWikiTextWrapper = require( './webpack/mediawiki_text_wrapper' );
const CommonConfig = require( './webpack.common.js' );

function readWrapperTemplate( name ) {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	return fs.readFileSync( `./webpack/wikitext_templates/${name}.hbs`, 'utf8' );
}

module.exports = ( env ) => {
	let entrypointRules = {};
	let customizationRules = { customizeObject: () => undefined };
	const campaigns = CampaignConfig.readFromFile( env.campaign_info ?? 'campaign_info.toml' );

	// Compile a specific banner, usually requested by the API
	if ( env.banner ) {
		const bannerName = env.banner;
		const singleEntry = campaigns.getEntryPoints()[ bannerName ];
		if ( !singleEntry ) {
			throw new Error( `${bannerName} not found in entry point list` );
		}
		entrypointRules = {
			entry: { [ bannerName ]: singleEntry }
		};
		customizationRules.customizeObject = customizeObject( {
			entry: 'replace'
		} );
	}
	// compile specific channel, usually requested on the CLI
	if ( env.channel ) {
		const channel = env.channel;
		const bannerNames = campaigns.getBannerNamesForChannel( channel );
		const configuredEntryPonts = campaigns.getEntryPoints();
		entrypointRules = {
			entry: bannerNames.reduce( ( entries, bannerName ) => {
				entries[ bannerName ] = configuredEntryPonts[ bannerName ];
				return entries;
			}, {} )
		};
		customizationRules.customizeObject = customizeObject( {
			entry: 'replace'
		} );
	}

	return mergeWithCustomize( customizationRules )(
		CommonConfig( env ),
		{
			devtool: false,
			mode: 'production',
			resolve: {
				alias: {
					'@environment': path.resolve( __dirname, 'src/environment/prod' )
				}
			},
			plugins: [
				new MediaWikiTextWrapper( {
					templates: campaigns.getWrapperTemplates( readWrapperTemplate ),
					context: {
						bannerValues: '{{MediaWiki:WMDE_Fundraising/Campaign_Parameters_2024}}'
					},
					filePattern: '{B,WMDE}*.js',
					campaignConfig: campaigns.getConfigForPages()
				} ),
				// TODO use wpde url instead
				new LoadVueOnWpde( {
					// URL where Vue will be loaded from. Should have only the minified runtime version
					vueURL: 'https://unpkg.com/vue@3/dist/vue.runtime.global.prod.js',
					// Regex matching output names to wrap.
					// Should match 'pagename' of WPDE banners in campaigns_info.toml
					test: /B.*WPDE_.*\.js/
				} ),
				// Remove generated license files
				// See https://stackoverflow.com/a/72237744/130121
				new ( class {
					apply( compiler ) {
						compiler.hooks.done.tap( 'Remove LICENSE', () => {
							rimraf.sync( './dist/*.LICENSE.txt' );
						} );
					}
				} )()
			],
			externals: [
				/**
				 * In production builds we'll use the Vue class provided by MediaWiki and declare everything imported from
				 * 'vue' and '@vue/something' an external dependency
				 *
				 * To make the Vue class available to the bundled code, you need to wrap it like this:
				 *
				 *    mw.loader.using( [ 'vue' ], function() { bundled code goes here } );
				 *
				 * The MediaWikiTextWrapper webpack plugin (and the template it uses) must take care of the wrapping
				 */
				function ( { request }, callback ) {
					if ( /(^@vue\/|^vue$)/.test( request ) ) {
						callback( null, 'Vue' );
						return;
					}
					callback();
				}
			],
			performance: {
				// Size limit in Bytes for the generated JS files
				maxAssetSize: 310_000,
				// Size limit in Bytes for the combined code of entry points
				maxEntrypointSize: 310_000
			}
		},
		entrypointRules
	);
};

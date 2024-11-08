/**
 * Wrap javascript assets in MediaWiki wikitext and script tags for inlining them in wiki pages
 */

const Handlebars = require( 'handlebars' );
const Minimatch = require( 'minimatch' ).Minimatch;

function MediaWikiTextWrapper( options ) {
	this.templates = {};
	this.filePattern = options.filePattern || '*.js';
	this.context = options.context || {};
	this.campaignConfig = options.campaignConfig || {};

	Object.keys( options.templates ).forEach( function ( pageName ) {
		this.templates[ pageName ] = Handlebars.compile( options.templates[ pageName ] );
	}.bind( this ) );
}

MediaWikiTextWrapper.prototype.apply = function ( compiler ) {
	const self = this;
	const { webpack } = compiler;
	const { Compilation } = webpack;
	const { RawSource } = webpack.sources;
	const pluginName = 'MediaWikiTextWrapper';

	compiler.hooks.compilation.tap( pluginName, function ( compilation ) {
		compilation.hooks.processAssets.tap(
			{
				name: pluginName,
				stage: Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING
			},
			function ( assets ) {
				const mm = new Minimatch( self.filePattern, { matchBase: true } );
				for ( let filename in assets ) {
					if ( !mm.match( filename ) || filename.indexOf( 'hot-update' ) > -1 ) {
						continue;
					}

					const pagename = filename.replace( /\.js$/, '' );

					if ( !self.campaignConfig[ pagename ] ) {
						throw new Error( 'Unconfigured JavaScript output: ' + filename );
					}

					// WPDE campaign configuration must prevent WikiText wrapping
					if ( self.campaignConfig[ pagename ].wrap_in_wikitext === false ) {
						continue;
					}

					const template = self.templates[ pagename ];
					const buildDate = new Date().toISOString()
						.replace( 'T', ' ' )
						.replace( /\.\d+Z$/, '' );
					const compiledSource = compilation.assets[ filename ].source();
					const bannerConfig = self.campaignConfig[ pagename ];
					const templateContext = {
						banner: compiledSource.replace( /\/\*! For license information please see.*?\*\/\s*/, '' ),
						campaignConfig: bannerConfig || {},
						useOfFundsTransclude: bannerConfig.use_of_funds_source ? '{{' + bannerConfig.use_of_funds_source + '}}' : '',
						buildDate,
						// BannerValues come from webpack.production config
						...self.context
					};
					const wrappedFile = template( templateContext );

					compilation.emitAsset(
						filename + '.wikitext',
						new RawSource( wrappedFile )
					);
					compilation.deleteAsset( filename );
				}
			}
		);
	} );
};

module.exports = MediaWikiTextWrapper;

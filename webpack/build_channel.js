// This is a custom npm script that clears the `dist` directory and compiles all banners for a given channel.

const rimraf = require( 'rimraf' );
const webpack = require( 'webpack' );
const CampaignConfig = require( './campaign_config' );
const newProductionConfiguration = require( '../webpack.production' );

if ( process.argv.length < 3 ) {
	console.log( 'Please provide a channel name, e.g. "desktop", "mobile", "english", etc' );
	console.log( 'If the channel name is not recognized for an npm script, you try to to separate it with two dashes' );
	console.log( 'e.g. "npm run build:channel -- desktop"' );
	process.exit( 1 );
}

let channel, statusMessage;
const channelOrCampaign = process.argv[ 2 ];
const campaignConfig = CampaignConfig.readFromFile( 'campaign_info.toml' );
const channelNames = campaignConfig.getChannelNames();
const campaignsAndChannels = campaignConfig.getCampaignsAndChannels();

if ( channelNames.indexOf( channelOrCampaign ) > -1 ) {
	channel = channelOrCampaign;
	statusMessage = `Compiling banners for channel '${channel}' ...`;
} else if ( campaignsAndChannels[ channelOrCampaign ] ) {
	channel = campaignsAndChannels[ channelOrCampaign ];
	statusMessage = `Compiling banners for campaign '${channelOrCampaign}' ...`;
} else {
	console.log( `Neither campaign nor channel with name '${channelOrCampaign}' found in campaign config` );
	console.log( `Available channels are: ${channelNames.join( ', ' )}` );
	console.log( `Available campaigns are: ${Object.keys( campaignsAndChannels ).join( ', ' )}` );
	process.exit( 1 );
}

console.log( `Clearing dist/ directory` );
rimraf.sync( [ 'dist/*.js', 'dist/*.wikitext', 'dist/*.map' ], { glob: true } );

const config = newProductionConfiguration( { channel } );

console.log( statusMessage );
webpack( config, ( err, stats ) => {
	console.log( stats.toString( {
		chunks: false,
		colors: true
	} ) );
} );

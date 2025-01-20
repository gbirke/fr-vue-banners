import fg from 'fast-glob';
import path from 'path';
import { parse as parseTOML } from 'toml';
import { readFileSync } from 'fs';

function getCampaignNamesAndMappings( campaignConfigPath ) {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const config = parseTOML( readFileSync( campaignConfigPath, 'utf-8' ) );
	return Object.entries( config ).reduce( function ( acc, [ channelName, channelConfig ] ) {
		acc.activeCampaigns.push( channelConfig.campaign );
		acc.campaignsToChannels[ channelConfig.campaign ] = channelName;
		return acc;
	}, { activeCampaigns: [], campaignsToChannels: {} } );
}

/**
 * Get "exclude" globs for vitest by examining current test folder hierarchy and comparing with the names
 * of current campaigns in the campaign configuration.
 *
 * @param {string} bannerGlob Glob pattern for banner entry point files, e.g. 'banners/*\/*.js Make sure to glob only one level deep, don't use '**' in the pattern.
 * @param {string} bannerTestGlob Glob pattern for banner test folders, e.g. 'test/banners/*\/* Make sure to glob only one level deep, don't use '**' in the pattern.
 * @param {string} campaignConfigPath Path to the campaign config file, defaults to 'campaign_info.toml'
 * @return {{inactiveCampaignGlobs: string[], campaignsWithoutTests: string[], activeCampaigns: string[]}}
 */
export function getFilterForInactiveCampaigns( bannerGlob, bannerTestGlob, campaignConfigPath ) {
	const potentialCampaignTestFolders = fg.globSync( bannerTestGlob, { onlyDirectories: true } );
	const potentialBannerFolders = fg.globSync( bannerGlob, { onlyDirectories: true } );

	const { activeCampaigns, campaignsToChannels } = getCampaignNamesAndMappings( campaignConfigPath );

	// Filter out "legacy" tests that are not in a CAMPAIGN_NAME/components folder
	const campaignTestFolders = potentialCampaignTestFolders.filter( folder => path.basename( folder ) !== 'components' );

	const campaignsWithoutTests = activeCampaigns.filter( campaign => {
		const campaignTestFolder = path.join( 'test/banners', campaignsToChannels[ campaign ], campaign );
		return !campaignTestFolders.includes( campaignTestFolder );
	} );

	const inactiveCampaignTestFolders = campaignTestFolders.filter( folder => {
		const campaignName = path.basename( folder );
		// If you want to see which campaigns are being excluded, uncomment the line below
		// console.log( 'Checking', campaignName, 'active:', activeCampaigns.includes( campaignName ) );
		return !activeCampaigns.includes( campaignName );
	} );

	const inactiveBannerFolders = potentialBannerFolders.filter( folder => {
		const campaignName = path.basename( folder );
		return !activeCampaigns.includes( campaignName );
	} );

	// Create recursive glob expressions for use in vitest "exclude"
	const inactiveCampaignGlobs = inactiveCampaignTestFolders.map( folder => path.join( folder, '**' ) );

	// Create recursive glob expressions for use in vitest "coverage.exclude"
	const inactiveBannerGlobs = inactiveBannerFolders.map( folder => path.join( folder, '**' ) );

	return {
		activeCampaigns,
		inactiveCampaignGlobs,
		inactiveBannerGlobs,
		campaignsWithoutTests,
	};
}

import { createDonationURL } from '@src/createDonationURL';
import { TrackingParameters } from '@src/domain/TrackingParameters';
import { ImpressionCount } from '@src/utils/ImpressionCount';

/**
 * This function is used for the fallback banner, as it replaces the usual tracking parameters with mini
 *
 * @param {TrackingParameters} tracking
 * @param {ImpressionCount} impressionCount
 * @param {Record<string, string>} extraUrlParameters
 */
export function createFallbackDonationURL( tracking: TrackingParameters, impressionCount: ImpressionCount, extraUrlParameters: Record<string, string> = {} ): string {
	const fallbackTracking: TrackingParameters = {
		keyword: tracking.keyword.replace( /(ctrl|var)/g, 'mini' ),
		campaign: tracking.campaign
	};
	return createDonationURL( fallbackTracking, impressionCount, extraUrlParameters );
}

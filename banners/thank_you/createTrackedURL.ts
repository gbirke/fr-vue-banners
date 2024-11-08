/* eslint-disable camelcase */
import { Locales } from '@src/domain/Locales';
import { TrackingParameters } from '@src/domain/TrackingParameters';
import { ImpressionCount } from '@src/utils/ImpressionCount';

export const SUBSCRIBE_URL = 'https://www.wikimedia.de/mitglieder/';
export const USE_OF_FUNDS_URL = 'https://spenden.wikimedia.de/use-of-funds/';

export function createTrackedURL( url: string, tracking: TrackingParameters, impressionCount: ImpressionCount, locale: Locales ): string {
	const urlParameters = new URLSearchParams( {
		piwik_kwd: tracking.keyword,
		piwik_campaign: tracking.campaign,
		impCount: String( impressionCount.overallCountIncremented ),
		bImpCount: String( impressionCount.bannerCountIncremented ),
		locale
	} );

	return `${url}?${urlParameters}`;
}

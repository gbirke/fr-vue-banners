/* eslint-disable camelcase */
import { Locales } from '@src/domain/Locales';
import { TrackingParameters } from '@src/domain/TrackingParameters';
import { ImpressionCount } from '@src/utils/ImpressionCount';

const MEMBERSHIP_FORM_URL = 'https://spenden.wikimedia.de/apply-for-membership';

export interface MembershipFormActions {
	create( extraUrlParameters: Record<string, string> ): string;
}

export class TrackingMembershipFormActions implements MembershipFormActions {
	private _tracking: TrackingParameters;
	private _impressionCount: ImpressionCount;
	private readonly _locale: Locales;

	public constructor( tracking: TrackingParameters, impressionCount: ImpressionCount, locale: Locales ) {
		this._tracking = tracking;
		this._impressionCount = impressionCount;
		this._locale = locale;
	}

	public create( extraUrlParameters: Record<string, string> = {} ): string {
		const urlParameters = new URLSearchParams( {
			piwik_kwd: this._tracking.keyword,
			piwik_campaign: this._tracking.campaign,
			impCount: String( this._impressionCount.overallCountIncremented ),
			bImpCount: String( this._impressionCount.bannerCountIncremented ),
			locale: this._locale,
			...extraUrlParameters
		} );

		return `${MEMBERSHIP_FORM_URL}?${urlParameters}`;
	}
}

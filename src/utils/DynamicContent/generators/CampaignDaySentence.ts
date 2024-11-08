import { Translator } from '@src/Translator';
import { Ordinal } from '@src/utils/DynamicContent/formatters/Ordinal';
import { TextGenerator } from '@src/utils/DynamicContent/generators/TextGenerator';
import TimeRange from '@src/utils/TimeRange';

export class CampaignDaySentence implements TextGenerator {
	private _ordinal: Ordinal;
	private readonly _translator: Translator;
	private readonly _campaignTimeRange: TimeRange;
	/**
	 * We show a more urgent sounding message to donors when days
	 * left in the campaign is below this threshold
	 */
	private readonly _urgencyMessageDaysLeft: number = 10;

	public constructor( campaignTimeRange: TimeRange, translator: Translator, ordinal: Ordinal, urgencyMessageDaysLeft: number = 10 ) {
		this._campaignTimeRange = campaignTimeRange;
		this._translator = translator;
		this._ordinal = ordinal;
		this._urgencyMessageDaysLeft = urgencyMessageDaysLeft;
	}

	public getText(): string {
		if ( !this._campaignTimeRange.hasStarted() ) {
			return this._translator.translate( 'campaign-day-before-campaign' );
		}

		if ( this._campaignTimeRange.hasEnded() ) {
			return '';
		}

		const daysUntilCampaignEnds = this._campaignTimeRange.numberOfDaysUntilEnd();
		const daysSinceCampaignStart = this._campaignTimeRange.daysSinceStart();

		if ( daysUntilCampaignEnds === 1 ) {
			return this._translator.translate( 'campaign-day-last-day' );
		} else if ( daysUntilCampaignEnds === 2 ) {
			return this._translator.translate( 'campaign-day-second-last-day' );
		} else if ( daysUntilCampaignEnds <= this._urgencyMessageDaysLeft ) {
			return this._translator.translate( 'campaign-day-only-n-days', {
				days: daysUntilCampaignEnds
			} );
		}

		if ( daysSinceCampaignStart === 1 ) {
			return this._translator.translate( 'campaign-day-first-day' );
		}

		return this._translator.translate( 'campaign-day-nth-day', {
			days: this._ordinal.getFormatted( daysSinceCampaignStart )
		} );
	}
}

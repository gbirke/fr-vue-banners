import { Translator } from '@src/Translator';
import { TextGenerator } from '@src/utils/DynamicContent/generators/TextGenerator';
import TimeRange from '@src/utils/TimeRange';

/**
 * Return a sentence that describes how many days are left in the campaign.
 */
export class DaysLeftSentence implements TextGenerator {
	private readonly _campaignDays: TimeRange;
	private readonly _translator: Translator;

	public constructor( campaignDays: TimeRange, translator: Translator ) {
		this._campaignDays = campaignDays;
		this._translator = translator;
	}

	public getText(): string {
		const numberOfDaysUntilCampaignEnd = this._campaignDays.numberOfDaysUntilEnd();
		return [
			this._translator.translate( 'prefix-days-left' ),
			numberOfDaysUntilCampaignEnd,
			this.getDayTranslation( numberOfDaysUntilCampaignEnd ),
			this._translator.translate( 'suffix-days-left' )
		].join( ' ' );
	}

	private getDayTranslation( numberOfDaysUntilCampaignEnd: number ): string {
		return numberOfDaysUntilCampaignEnd === 1 ?
			this._translator.translate( 'day-singular' ) :
			this._translator.translate( 'day-plural' );
	}

}

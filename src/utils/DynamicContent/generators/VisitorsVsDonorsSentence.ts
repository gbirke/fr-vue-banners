import { Translator } from '@src/Translator';
import { Integer } from '@src/utils/DynamicContent/formatters/Integer';
import { TextGenerator } from '@src/utils/DynamicContent/generators/TextGenerator';

export class VisitorsVsDonorsSentence implements TextGenerator {
	private readonly _translator: Translator;
	private readonly _millionImpressionsPerDay: number;
	private readonly _projectedNumberOfDonors: number;
	private readonly _integerFormatter: Integer;

	public constructor( translator: Translator, millionImpressionsPerDay: number, projectedNumberOfDonors: number, integerFormatter: Integer ) {
		this._translator = translator;
		this._millionImpressionsPerDay = millionImpressionsPerDay;
		this._projectedNumberOfDonors = projectedNumberOfDonors;
		this._integerFormatter = integerFormatter;
	}

	public getText(): string {
		const messageKey = ( this._millionImpressionsPerDay === 0 || this._projectedNumberOfDonors === 0 ) ?
			'visitors-vs-donors-sentence-no-impressions' :
			'visitors-vs-donors-sentence';

		return this._translator.translate( messageKey, {
			millionImpressionsPerDay: this._millionImpressionsPerDay,
			totalNumberOfDonors: this._integerFormatter.format( this._projectedNumberOfDonors )
		} );
	}
}

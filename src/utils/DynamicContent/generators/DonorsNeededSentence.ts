import { Translator } from '@src/Translator';
import { TextGenerator } from '@src/utils/DynamicContent/generators/TextGenerator';

export class DonorsNeededSentence implements TextGenerator {
	private readonly _translator: Translator;
	private readonly _donorsNeeded: number;

	public constructor( donorsNeeded: number, translator: Translator ) {
		this._donorsNeeded = donorsNeeded;
		this._translator = translator;
	}

	public getText(): string {
		if ( this._donorsNeeded <= 0 ) {
			return '';
		}

		const donorsNeededRounded = this._donorsNeeded > 100 ? Math.round( this._donorsNeeded / 100 ) * 100 : this._donorsNeeded;

		return this._translator.translate( 'remaining-donors-needed-sentence', {
			donorsNeeded: donorsNeededRounded
		} );
	}
}

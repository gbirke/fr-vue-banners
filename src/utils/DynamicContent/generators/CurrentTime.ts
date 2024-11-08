import { Time } from '@src/utils/DynamicContent/formatters/Time';
import { TextGenerator } from '@src/utils/DynamicContent/generators/TextGenerator';

export class CurrentTime implements TextGenerator<Date> {
	private _timeFormatter: Time;

	public constructor( timeFormatter: Time ) {
		this._timeFormatter = timeFormatter;
	}

	public getText( date: Date ): string {
		return this._timeFormatter.getFormatted( date );
	}
}

import formatter from 'format-number';
import { Integer } from '@src/utils/DynamicContent/formatters/Integer';
import { NumberFormatter } from '@src/utils/DynamicContent/formatters/NumberFormatter';

export class IntegerDe implements Integer {

	private readonly _integerFormatter: NumberFormatter;

	public constructor() {
		this._integerFormatter = formatter( { round: 0, integerSeparator: '.' } );
	}

	public format( amount: number ): string {
		return this._integerFormatter( amount );
	}
}

import formatter from 'format-number';
import { Currency } from '@src/utils/DynamicContent/formatters/Currency';
import { NumberFormatter } from '@src/utils/DynamicContent/formatters/NumberFormatter';

export class CurrencyDe implements Currency {

	private readonly _euroAmountFormatter: NumberFormatter;
	private readonly _customAmountInputFormatter: NumberFormatter;
	private readonly _millionsFormatter: NumberFormatter;
	private readonly _millionsNumericFormatter: NumberFormatter;
	private readonly _euroAmountWithThousandSeparatorFormatter: ( amount: number ) => string;

	public constructor() {
		this._euroAmountFormatter = formatter( { round: 2, suffix: ' €', decimal: ',', integerSeparator: '', padRight: 2 } );
		this._customAmountInputFormatter = formatter( { round: 2, decimal: ',', integerSeparator: '', padRight: 2 } );
		this._millionsFormatter = formatter( { round: 1, decimal: ',', suffix: ' Mio. €', padRight: 1 } );
		this._millionsNumericFormatter = formatter( { round: 1, decimal: ',', padRight: 1 } );
		this._euroAmountWithThousandSeparatorFormatter = formatter( { truncate: 0, integerSeparator: '.', suffix: ' Euro' } );
	}

	// TODO: investigate if we need rounding behaviour or can do 'truncate':0 instead of replace( ',00', '' )
	public euroAmount( amount: number ): string {
		return this._euroAmountFormatter( amount ).replace( ',00', '' );
	}

	public customAmountInput( amount: number ): string {
		return this._customAmountInputFormatter( amount );
	}

	public millions( amount: number ): string {
		return this._millionsFormatter( amount / 1_000_000 );
	}

	public millionsNumeric( amount: number ): string {
		return this._millionsNumericFormatter( amount / 1_000_000 );
	}

	public euroAmountWithThousandSeparator( amount: number ): string {
		return this._euroAmountWithThousandSeparatorFormatter( amount );
	}
}

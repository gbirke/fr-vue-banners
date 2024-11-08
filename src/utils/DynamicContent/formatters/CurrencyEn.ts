import formatter from 'format-number';
import { Currency } from '@src/utils/DynamicContent/formatters/Currency';
import { NumberFormatter } from '@src/utils/DynamicContent/formatters/NumberFormatter';

export class CurrencyEn implements Currency {
	private readonly _euroAmountFormatter: NumberFormatter;
	private readonly _customAmountInputFormatter: NumberFormatter;
	private readonly _millionsFormatter: ( amount: number ) => string;
	private readonly _millionsNumericFormatter: ( amount: number ) => string;
	private readonly _euroAmountWithThousandSeparatorFormatter: ( amount: number ) => string;

	public constructor() {
		this._euroAmountFormatter = formatter( { round: 2, prefix: '€', integerSeparator: '', padRight: 2 } );
		this._customAmountInputFormatter = formatter( { round: 2, integerSeparator: '', padRight: 2 } );
		this._millionsFormatter = formatter( { round: 1, decimal: '.', suffix: 'M', prefix: '€', padRight: 1 } );
		this._millionsNumericFormatter = formatter( { round: 1, decimal: '.', padRight: 1 } );
		this._euroAmountWithThousandSeparatorFormatter = formatter( { round: 2, integerSeparator: ',', suffix: ' euro' } );
	}

	public euroAmount( amount: number ): string {
		return this._euroAmountFormatter( amount ).replace( '.00', '' );
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

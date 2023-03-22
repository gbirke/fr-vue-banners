import { Currency } from '@src/utils/DynamicContent/formatters/Currency';
import formatter from 'format-number';

export class CurrencyDe implements Currency {

	private readonly millionsNumericFormatter: ( amount: number ) => string;

	public constructor() {
		this.millions = formatter( { round: 1, decimal: ',', suffix: ' Mio. €', padRight: 1 } );
		this.millionsNumericFormatter = formatter( { round: 1, decimal: ',', padRight: 1 } );
	}

	public millions: ( amount: number ) => string;

	public millionsNumeric( amount: number ): string {
		return this.millionsNumericFormatter( amount / 1_000_000 );
	}

}

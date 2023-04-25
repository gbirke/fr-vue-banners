import { LocaleFactory } from '@src/utils/LocaleFactory';
import { CurrencyDe } from '@src/utils/DynamicContent/formatters/CurrencyDe';
import { Currency } from '@src/utils/DynamicContent/formatters/Currency';
import { Formatters } from '@src/utils/DynamicContent/Formatters';
import { FundsContentLoader } from '@src/utils/UseOfFunds/FundsContentLoader';
import { OrdinalDe } from '@src/utils/DynamicContent/formatters/OrdinalDe';
import { IntegerDe } from '@src/utils/DynamicContent/formatters/IntegerDe';
// TODO import from @environment instead of src
import { DeJSONFundsContentLoader } from '@src/utils/UseOfFunds/DeJSONFundsContentLoader';

export class LocaleFactoryDe implements LocaleFactory {
	private readonly _currencyFormatter: Currency;

	public constructor() {
		this._currencyFormatter = new CurrencyDe();
	}

	public getCurrencyFormatter(): Currency {
		return this._currencyFormatter;
	}

	public getFormatters(): Formatters {
		return {
			currency: this._currencyFormatter,
			ordinal: new OrdinalDe(),
			integer: new IntegerDe()
		};
	}

	public getUseOfFundsLoader(): FundsContentLoader {
		return new DeJSONFundsContentLoader();
	}

}

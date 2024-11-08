import { Formatters } from '@src/utils/DynamicContent/Formatters';
import { Currency } from '@src/utils/DynamicContent/formatters/Currency';
import { CurrencyDe } from '@src/utils/DynamicContent/formatters/CurrencyDe';
import { IntegerDe } from '@src/utils/DynamicContent/formatters/IntegerDe';
import { OrdinalDe } from '@src/utils/DynamicContent/formatters/OrdinalDe';
import { TimeDe } from '@src/utils/DynamicContent/formatters/TimeDe';
import { LocaleFactory } from '@src/utils/LocaleFactory';
import { DeJSONFundsContentLoader } from '@src/utils/UseOfFunds/DeJSONFundsContentLoader';
import { FundsContentLoader } from '@src/utils/UseOfFunds/FundsContentLoader';

export class LocaleFactoryWpDe implements LocaleFactory {
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
			integer: new IntegerDe(),
			time: new TimeDe()
		};
	}

	public getUseOfFundsLoader(): FundsContentLoader {
		return new DeJSONFundsContentLoader();
	}
}

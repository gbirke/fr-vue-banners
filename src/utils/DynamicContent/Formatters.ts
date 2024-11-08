import { Currency } from '@src/utils/DynamicContent/formatters/Currency';
import { Integer } from '@src/utils/DynamicContent/formatters/Integer';
import { Ordinal } from '@src/utils/DynamicContent/formatters/Ordinal';
import { Time } from '@src/utils/DynamicContent/formatters/Time';

export interface Formatters {
	currency: Currency;
	ordinal: Ordinal;
	integer: Integer;
	time: Time;
}

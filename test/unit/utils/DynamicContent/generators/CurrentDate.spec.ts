import { describe, expect, test } from 'vitest';
import { Translator } from '@src/Translator';
import { Ordinal } from '@src/utils/DynamicContent/formatters/Ordinal';
import { CurrentDate } from '@src/utils/DynamicContent/generators/CurrentDate';

const translator = new Translator( {
	'date-month-1': 'Ick {{day}}',
	'date-month-2': 'Offle {{day}}',
	'date-month-10': 'Spune {{day}}',
	'date-month-11': 'Sektober {{day}}'
} );

const staticOrdinal: Ordinal = {
	getFormatted: ( figure: number ) => figure + 'sth'
};

describe( 'CurrentDate', () => {
	test.each( [
		[ 1, 14, 'Ick 14sth' ],
		[ 2, 27, 'Offle 27sth' ],
		[ 10, 2, 'Spune 2sth' ],
		[ 11, 8, 'Sektober 8sth' ]
	] )( 'returns the proper month name and date', ( month: number, day: number, expected: string ) => {
		const currentDate = new CurrentDate( translator, staticOrdinal );

		expect( currentDate.getText( new Date( 2023, month - 1, day, 12, 0, 0 ) ) ).toEqual( expected );
	} );
} );

import { describe, expect, it } from 'vitest';
import { Translator } from '@src/Translator';
import { DayName } from '@src/utils/DynamicContent/generators/DayName';

const translator = new Translator( {
	'day-name-christmas-day': 'day-name-christmas-day',
	'day-name-tuesday': 'day-name-tuesday'
} );

describe( 'DayName', () => {

	it( 'returns the proper message key for a date defined as special day', function () {
		const dayName = new DayName( new Date( 2023, 11, 25, 12, 0, 0 ), translator );
		expect( dayName.getText() ).toBe( 'day-name-christmas-day' );
	} );

	it( 'returns the general message key for the week of the day', function () {
		const dayName = new DayName( new Date( 2023, 10, 14, 12, 0, 0 ), translator );
		expect( dayName.getText() ).toBe( 'day-name-tuesday' );
	} );
} );

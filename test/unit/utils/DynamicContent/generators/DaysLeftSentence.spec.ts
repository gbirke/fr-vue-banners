import { describe, it, expect } from 'vitest';
import { DaysLeftSentence } from '@src/utils/DynamicContent/generators/DaysLeftSentence';
import TimeRange from '@src/utils/TimeRange';
import { Translator } from '@src/Translator';

describe( 'DaysLeftSentence', function () {
	const translator = new Translator( {
		'prefix-days-left': 'only',
		'suffix-days-left': 'left',
		'day-singular': 'day',
		'day-plural': 'days'
	} );

	it( 'should return a sentence for when a several days are left', function () {
		const campaignDays = new TimeRange( new Date( 2023, 10, 11 ), new Date( 2023, 11, 31, 23, 59, 59 ), new Date( 2023, 11, 25 ) );
		const daysLeft = new DaysLeftSentence( campaignDays, translator );
		expect( daysLeft.getText() ).toBe( 'only 7 days left' );
	} );

	it( 'should return a sentence for when one days is left', function () {
		const campaignDays = new TimeRange( new Date( 2023, 10, 11 ), new Date( 2023, 11, 31, 23, 59, 59 ), new Date( 2023, 11, 30, 23, 59, 59 ) );
		const daysLeft = new DaysLeftSentence( campaignDays, translator );
		expect( daysLeft.getText() ).toBe( 'only 1 day left' );
	} );
} );

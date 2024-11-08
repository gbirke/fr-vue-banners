import { describe, expect, it } from 'vitest';
import { Translator } from '@src/Translator';
import { DaysLeftSentence } from '@src/utils/DynamicContent/generators/DaysLeftSentence';
import TimeRange from '@src/utils/TimeRange';

describe( 'DaysLeftSentence', function () {
	const translator = new Translator( {
		'prefix-days-left': 'only',
		'suffix-days-left': 'left',
		'day-singular': 'day',
		'day-plural': 'days'
	} );

	it( 'should return a sentence for when a several days are left', function () {
		const campaignDays = new TimeRange( new Date( 2023, 10, 11 ), new Date( 2024, 0, 1 ), new Date( 2023, 11, 25 ) );
		const daysLeft = new DaysLeftSentence( campaignDays, translator );
		expect( daysLeft.getText() ).toBe( 'only 7 days left' );
	} );

	it( 'should return a sentence for when less than 12 hours on the last day are left', function () {
		const campaignDays = new TimeRange( new Date( 2023, 10, 11 ), new Date( 2024, 0, 1 ), new Date( 2023, 11, 31, 12 ) );
		const daysLeft = new DaysLeftSentence( campaignDays, translator );
		expect( daysLeft.getText() ).toBe( 'only 1 day left' );
	} );
} );

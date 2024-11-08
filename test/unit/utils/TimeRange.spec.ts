import { describe, expect, it } from 'vitest';

import TimeRange from '@src/utils/TimeRange';

describe( 'TimeRange', function () {

	const START_DATE = new Date( 2016, 10, 1, 0, 0, 0 );
	const END_DATE = new Date( 2016, 11, 31, 23, 59, 59 );

	describe( '#constructor', function () {
		it( 'throws error when the end date is before the start date', function () {
			expect( () => new TimeRange( START_DATE, START_DATE ) ).toThrow( 'start date must not be larger than end date' );
			expect( () => new TimeRange( END_DATE, START_DATE ) ).toThrow( 'start date must not be larger than end date' );
		} );
	} );

	describe( '#newFromStrings', function () {

		it( 'returns the first second of the start day', function () {
			const now = new Date( 2017, 10, 1, 0, 0, 0 );
			expect( TimeRange.createFromStrings( '2017-11-01', '2017-12-04', now ).secondsSinceStart() )
				.toEqual( 0 );
		} );

		it( 'returns the first second of the day after the end day', function () {
			const now = new Date( 2017, 11, 31, 23, 59, 59 );
			expect( TimeRange.createFromStrings( '2017-11-01', '2017-12-31', now ).secondsUntilEnd() )
				.toEqual( 1 );
		} );

		it( 'throws errors when start date string is malformed', function () {
			expect( () => TimeRange.createFromStrings( '2017-01-4', '2017-12-31' ) ).toThrow( /wrong date string format/i );
		} );

		it( 'throws errors when end date string is malformed', function () {
			expect( () => TimeRange.createFromStrings( '2017-01-04', '2017-12-1' ) ).toThrow( /wrong date string format/i );
		} );
	} );

	describe( '#hasStarted', function () {
		it( 'returns false when range has not started yet', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 9, 1, 0, 0, 0 ) );
			expect( range.hasStarted() ).toBe( false );
		} );

		it( 'returns true when on first day of range', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 10, 1, 0, 0, 5 ) );
			expect( range.hasStarted() ).toBe( true );
		} );

		it( 'returns true when on last day of range', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 11, 31, 23, 59, 58 ) );
			expect( range.hasStarted() ).toBe( true );
		} );

		it( 'returns true when range is over', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2017, 0, 1, 0, 0, 0 ) );
			expect( range.hasStarted() ).toBe( true );
		} );
	} );

	describe( '#hasEnded', function () {
		it( 'returns false when range has not started yet', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 9, 1, 0, 0, 0 ) );
			expect( range.hasEnded() ).toBe( false );
		} );

		it( 'returns false when on first day of range', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 10, 1, 0, 0, 5 ) );
			expect( range.hasEnded() ).toBe( false );
		} );

		it( 'returns false when on last day of range', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 11, 31, 23, 59, 58 ) );
			expect( range.hasEnded() ).toBe( false );
		} );

		it( 'returns true when range is over', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2017, 0, 1, 0, 0, 0 ) );
			expect( range.hasEnded() ).toBe( true );
		} );
	} );

	describe( '#secondsSinceStart', function () {
		it( 'returns a negative number before the range', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 9, 31, 0, 0, 0 ) );
			expect( range.secondsSinceStart() ).toBe( -86400 );
		} );

		it( 'returns a positive number after the range started', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 10, 3, 0, 0, 0 ) );
			expect( range.secondsSinceStart() ).toBe( 172800 );
		} );

		it( 'continues counting when the range has ended', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2017, 2, 4, 0, 0, 0 ) );
			expect( range.secondsSinceStart() ).toBe( 10627200 );
		} );

	} );

	describe( '#secondsBetweenStartAndEnd', function () {
		it( 'returns a number of seconds', function () {
			let range = new TimeRange( START_DATE, new Date( 2016, 10, 2, 0, 0, 0 ), new Date( 2016, 9, 31, 0, 0, 0 ) );
			expect( range.secondsBetweenStartAndEnd() ).toBe( 86400 );

			range = new TimeRange( START_DATE, new Date( 2016, 10, 3, 0, 0, 0 ), new Date( 2016, 9, 31, 0, 0, 0 ) );
			expect( range.secondsBetweenStartAndEnd() ).toBe( 172800 );
		} );

	} );

	describe( '#secondsUntilEnd', function () {
		it( 'returns a positive number before the range', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 9, 31, 23, 59, 59 ) );
			expect( range.secondsUntilEnd() ).toBe( 5270400 );
		} );

		it( 'returns a positive number after the range started', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 11, 31, 23, 59, 54 ) );
			expect( range.secondsUntilEnd() ).toBe( 5 );
		} );

		it( 'returns a negative number when the range has ended', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2017, 0, 1, 0, 0, 4 ) );
			expect( range.secondsUntilEnd() ).toBe( -5 );
		} );

	} );

	describe( '#numberOfDaysUntilEnd', function () {
		it( 'returns the number of days until the defined end of the range', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 9, 31, 23, 59, 59 ) );
			expect( range.numberOfDaysUntilEnd() ).toBe( 61 );
		} );

		it( 'returns 1 on the last day of the range', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2016, 11, 31, 23, 59, 54 ) );
			expect( range.numberOfDaysUntilEnd() ).toBe( 1 );
		} );

		it( 'returns negative zero on exactly the first day after the range', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2017, 0, 1, 0, 0, 4 ) );
			expect( range.numberOfDaysUntilEnd() ).toBe( -0 );
		} );

		it( 'returns negative number on the second day after the range', function () {
			const range = new TimeRange( START_DATE, END_DATE, new Date( 2017, 0, 2, 0, 0, 4 ) );
			expect( range.numberOfDaysUntilEnd() ).toBe( -1 );
		} );

	} );

} );

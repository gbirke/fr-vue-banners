import { describe, expect, it, test } from 'vitest';
import { DailyDonorStatsValues } from '@src/utils/DynamicContent/DailyDonorAverage';
import { IntegerEn } from '@src/utils/DynamicContent/formatters/IntegerEn';
import {
	HourlyConfigurableDailyDonorAverage,
	HourlyDonorPercentages
} from '@src/utils/DynamicContent/HourlyConfigurableDailyDonorAverage';

const averageDailyDonors = 4760;
const hourlyDonorPercentages: HourlyDonorPercentages = [ 1, 1, 1, 1, 1, 1, 5, 5, 5, 10, 10, 10, 10, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1 ];

describe( 'HourlyConfigurableDailyDonorAverage', () => {

	it( 'throws an error if provided with an array whose values do not sum to 100', () => {
		const incorrectValueDonorPercentages: HourlyDonorPercentages = [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ];

		expect( () => new HourlyConfigurableDailyDonorAverage( averageDailyDonors, incorrectValueDonorPercentages, new IntegerEn() ) )
			.toThrow( 'The sum of the hourly percentages must be 100' );
	} );

	test.each( [
		[
			new Date( 2023, 12, 1, 0, 30, 0 ),
			{ currentDailyPercentage: 0.005, averageDailyDonors: '4,760', currentDonorsSoFar: '24', currentDonorsNeeded: '4,736' }
		],
		[
			new Date( 2023, 12, 1, 11, 42, 0 ),
			{ currentDailyPercentage: 0.48, averageDailyDonors: '4,760', currentDonorsSoFar: '2,285', currentDonorsNeeded: '2,475' }
		],
		[
			new Date( 2023, 12, 1, 23, 11, 0 ),
			{ currentDailyPercentage: 0.9, averageDailyDonors: '4,760', currentDonorsSoFar: '4,284', currentDonorsNeeded: '476' }
		]
	] )( 'calculates the correct values for time', ( time: Date, expected: DailyDonorStatsValues ) => {
		const dailyDonorAverage = new HourlyConfigurableDailyDonorAverage( averageDailyDonors, hourlyDonorPercentages, new IntegerEn() );

		expect( dailyDonorAverage.getDonorStatsForTime( time ) ).toStrictEqual( expected );
	} );
} );

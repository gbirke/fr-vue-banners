import { describe, expect, test } from 'vitest';
import { DailyDonorStatsValues } from '@src/utils/DynamicContent/DailyDonorAverage';
import { IntegerEn } from '@src/utils/DynamicContent/formatters/IntegerEn';
import { LinearDailyDonorAverage } from '@src/utils/DynamicContent/LinearDailyDonorAverage';

const averageDailyDonors = 4760;
describe( 'LinearDailyDonorAverage', () => {
	test.each( [
		[
			new Date( 2023, 12, 1, 0, 30, 0 ),
			{ currentDailyPercentage: 0.020833333333333332, averageDailyDonors: '4,760', currentDonorsSoFar: '99', currentDonorsNeeded: '4,661' }
		],
		[
			new Date( 2023, 12, 1, 11, 42, 0 ),
			{ currentDailyPercentage: 0.4875, averageDailyDonors: '4,760', currentDonorsSoFar: '2,321', currentDonorsNeeded: '2,440' }
		],
		[
			new Date( 2023, 12, 1, 23, 11, 0 ),
			{ currentDailyPercentage: 0.9, averageDailyDonors: '4,760', currentDonorsSoFar: '4,284', currentDonorsNeeded: '476' }
		]
	] )( 'calculates the correct values for time', ( time: Date, expected: DailyDonorStatsValues ) => {
		const dailyDonorAverage = new LinearDailyDonorAverage( averageDailyDonors, new IntegerEn() );

		expect( dailyDonorAverage.getDonorStatsForTime( time ) ).toStrictEqual( expected );
	} );
} );

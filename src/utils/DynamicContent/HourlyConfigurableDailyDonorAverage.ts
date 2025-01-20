import { DailyDonorAverage, DailyDonorStatsValues } from '@src/utils/DynamicContent/DailyDonorAverage';
import { Integer } from '@src/utils/DynamicContent/formatters/Integer';

export type HourlyDonorPercentages = [
	number, number, number, number, number, number, number, number, number, number, number, number,
	number, number, number, number, number, number, number, number, number, number, number, number
];

export class HourlyConfigurableDailyDonorAverage implements DailyDonorAverage {
	private readonly _averageDailyDonors: number;
	private readonly _hourlyDonorPercentages: HourlyDonorPercentages;
	private readonly _integerFormatter: Integer;

	public constructor( averageDailyDonors: number, hourlyDonorPercentages: HourlyDonorPercentages, integerFormatter: Integer ) {
		const total = hourlyDonorPercentages.reduce( ( currentTotal: number, percentage: number ) => currentTotal + percentage );
		if ( total !== 100 ) {
			throw new Error( 'The sum of the hourly percentages must be 100' );
		}

		this._averageDailyDonors = averageDailyDonors;
		this._hourlyDonorPercentages = hourlyDonorPercentages;
		this._integerFormatter = integerFormatter;
	}

	public getDonorStatsForTime( time: Date ): DailyDonorStatsValues {
		const currentHourIndex = time.getHours();
		const previousHours = this._hourlyDonorPercentages.filter( ( _, index ) => index < currentHourIndex );

		const currentHourPercentage = this._hourlyDonorPercentages[ currentHourIndex ] * time.getMinutes() / 60;
		const previousHoursPercentage = previousHours.reduce( ( currentTotal: number, previousHourPercentage: number ) => currentTotal + previousHourPercentage, 0 );

		const percentage = ( previousHoursPercentage + currentHourPercentage ) / 100;
		const cappedPercentage = Math.min( percentage, 0.9 );
		const donorsSoFar = this._averageDailyDonors * cappedPercentage;

		return {
			currentDailyPercentage: cappedPercentage,
			averageDailyDonors: this._integerFormatter.format( this._averageDailyDonors ),
			currentDonorsNeeded: this._integerFormatter.format( this._averageDailyDonors - donorsSoFar ),
			currentDonorsSoFar: this._integerFormatter.format( donorsSoFar )
		};
	}
}

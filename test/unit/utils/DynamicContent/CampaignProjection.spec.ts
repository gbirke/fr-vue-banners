import { beforeEach, describe, expect, it } from 'vitest';
import { CampaignProjectionParameters } from '@src/domain/CampaignParameters';
import { CampaignProjection } from '@src/utils/DynamicContent/CampaignProjection';
import TimeRange from '@src/utils/TimeRange';

const beforeStartDate = new Date( 2023, 10, 10 );
const startDate = new Date( 2023, 10, 11 );
const endDate = new Date( 2023, 11, 31, 23, 59, 59 );
const afterEndDate = new Date( 2024, 0, 15 );
const after12HoursDate = new Date( 2023, 10, 11, 12 );
const after24HoursDate = new Date( 2023, 10, 12 );

describe( 'CampaignProjection', function () {
	let campaignProjectionParameters: CampaignProjectionParameters;

	beforeEach( () => {
		campaignProjectionParameters = {
			averageAmountPerDonation: 20,
			updatedAt: 'Not used by CampaignProjection directly',
			donationSumBase: 100_000,
			donationAmountPerMinute: 10.3,
			donationCountBase: 105,
			donationCountPerMinute: 2,
			donationTarget: 9_000_000
		};
	} );

	describe( '#projectedDonationSum()', function () {
		it( 'should return donation sum projection based on number of passed seconds', function () {
			campaignProjectionParameters.donationSumBase = 0;
			const campaignProjection = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, after12HoursDate )
			);

			expect( campaignProjection.projectedDonationSum() ).toBeCloseTo( 7416, 5 );
		} );

		it( 'should add the base value to the projected sum', function () {
			const campaignProjectionAfter12Hours = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, after12HoursDate )
			);
			const campaignProjectionAfter24Hours = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, after24HoursDate )
			);

			expect( campaignProjectionAfter12Hours.projectedDonationSum() ).toBe( 107416 );
			expect( campaignProjectionAfter24Hours.projectedDonationSum() ).toBe( 114832 );
		} );

		it( 'should return zero before the range starts', function () {
			const campaignProjection = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, beforeStartDate )
			);

			expect( campaignProjection.projectedDonationSum() ).toBe( 0 );
		} );

		it( 'should stop projecting donations after the campaign ends', function () {
			const campaignProjection = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, afterEndDate )
			);

			expect( campaignProjection.projectedDonationSum() ).toBeCloseTo( 856421.7 );
		} );
	} );

	describe( '#projectedDonors()', function () {
		it( 'should return projected number of donors based on seconds passed', function () {
			const campaignProjectionAfter12Hours = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, after12HoursDate )
			);
			const campaignProjectionAfter24Hours = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, after24HoursDate )
			);

			expect( campaignProjectionAfter12Hours.projectedDonationCount() ).toBe( 1545 );
			expect( campaignProjectionAfter24Hours.projectedDonationCount() ).toBe( 2985 );
		} );

		it( 'should return zero before the campaign starts', function () {
			const campaignProjection = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, beforeStartDate )
			);

			expect( campaignProjection.projectedDonationCount() ).toBe( 0 );
		} );

		it( 'should stop projecting donors after the campaign ends', function () {
			const campaignProjection = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, afterEndDate )
			);

			expect( campaignProjection.projectedDonationCount() ).toBeCloseTo( 146_983 );
		} );
	} );

	describe( '#remainingDonorsNeeded()', function () {
		it( 'should project donors needed, based on the remaining amount, donation target and average donation per donor', function () {
			const campaignProjection = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, after24HoursDate )
			);

			expect( campaignProjection.remainingNumberOfDonationsNeeded() ).toBe( 445_000 );
		} );

		it( 'should project donors needed to the nearest 100_000 donors', function () {
			const campaignProjectionAfter12Hours = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, after12HoursDate )
			);
			const campaignProjectionAfter24Hours = new CampaignProjection(
				campaignProjectionParameters,
				new TimeRange( startDate, endDate, after24HoursDate )
			);

			expect( campaignProjectionAfter12Hours.remainingNumberOfDonationsNeeded() ).toBe( 445_000 );
			expect( campaignProjectionAfter24Hours.remainingNumberOfDonationsNeeded() ).toBe( 445_000 );
		} );
	} );
} );

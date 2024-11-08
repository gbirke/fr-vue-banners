import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CampaignParameters } from '@src/domain/CampaignParameters';
import { Translator } from '@src/Translator';
import DynamicCampaignText from '@src/utils/DynamicContent/DynamicCampaignText';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';
import { Formatters } from '@src/utils/DynamicContent/Formatters';
import { CurrencyEn } from '@src/utils/DynamicContent/formatters/CurrencyEn';
import { IntegerEn } from '@src/utils/DynamicContent/formatters/IntegerEn';
import { OrdinalEn } from '@src/utils/DynamicContent/formatters/OrdinalEn';
import { TimeEn } from '@src/utils/DynamicContent/formatters/TimeEn';
import { ImpressionCount } from '@src/utils/ImpressionCount';

const translator = new Translator( {
	'campaign-day-nth-day': 'campaign day {{days}}',
	'date-month-11': 'current month {{day}}',
	'date-month-time-11': 'current month {{day}} current time {{time}}',
	'day-name-friday': 'current day name',
	'prefix-days-left': 'only',
	'suffix-days-left': 'left',
	'day-singular': 'day',
	'day-plural': 'days',
	'remaining-donors-needed-sentence': '{{donorsNeeded}}',
	'visitors-vs-donors-sentence': '{{millionImpressionsPerDay}}-{{totalNumberOfDonors}}',
	'amount-total': 'Progress total',
	'amount-missing': 'Progress missing {{amount}}'
} );
const formatters: Formatters = { currency: new CurrencyEn(), ordinal: new OrdinalEn(), integer: new IntegerEn(), time: new TimeEn() };
const campaignParameters: CampaignParameters = {
	campaignProjection: {
		averageAmountPerDonation: 20,
		donationSumBase: 100_000,
		donationAmountPerMinute: 10.3,
		donationCountBase: 105,
		donationCountPerMinute: 2,
		donationTarget: 9_000_000,
		updatedAt: '2023-11-08'
	},
	endDate: '2023-12-31',
	millionImpressionsPerDay: 42,
	numberOfMembers: 200,
	startDate: '2023-11-03',
	isLateProgress: false,
	thankYouCampaign: {
		progressBarPercentage: 80,
		numberOfDonors: 42
	}
};
const impressionCount: ImpressionCount = {
	bannerCount: 42,
	bannerCountIncremented: 43,
	overallCount: 543,
	overallCountIncremented: 544,
	incrementImpressionCounts(): void {},
	getRemainingImpressions( maxImpressions: number ): number {
		return maxImpressions;
	}
};

describe( 'DynamicCampaignText', () => {
	let dynamicCampaignText: DynamicContent;

	beforeEach( () => {
		vi.useFakeTimers();
		dynamicCampaignText = new DynamicCampaignText(
			new Date( 2023, 10, 10, 12, 0, 0 ),
			translator,
			formatters,
			campaignParameters,
			impressionCount
		);
	} );

	afterEach( () => {
		vi.useRealTimers();
	} );

	it( 'Gets the campaign day sentence', () => {
		expect( dynamicCampaignText.campaignDaySentence ).toBe( 'campaign day 8th' );
	} );

	it( 'Gets the current date', () => {
		expect( dynamicCampaignText.currentDate ).toBe( 'current month 10th' );
	} );

	it( 'Gets the current date and time', () => {
		vi.setSystemTime( new Date( 2023, 10, 10, 13, 42, 0 ) );
		const currentDateAndTime = dynamicCampaignText.getCurrentDateAndTime();

		// In some test environments the output of Date.toLocaleString includes the code for a space,
		// but in others it doesn't. To fix that we manually replace it in this test
		expect( currentDateAndTime.currentTime.replace( '\u202f', ' ' ) ).toStrictEqual( '1:42 pm' );
		expect( currentDateAndTime.currentDate ).toStrictEqual( 'current month 10th' );
	} );

	it( 'Gets the current day name', () => {
		expect( dynamicCampaignText.currentDayName ).toBe( 'current day name' );
	} );

	it( 'Gets the days left sentence', () => {
		expect( dynamicCampaignText.daysLeftSentence ).toBe( 'only 52 days left' );
	} );

	it( 'Gets the donors needed sentence', () => {
		expect( dynamicCampaignText.donorsNeededSentence ).toBe( '445000' );
	} );

	it( 'Gets the goal donation sum', () => {
		expect( dynamicCampaignText.goalDonationSum ).toBe( '9.0' );
	} );

	it( 'Gets the overall impression count', () => {
		expect( dynamicCampaignText.overallImpressionCount ).toBe( 544 );
	} );

	it( 'Gets the current donation sum', () => {
		expect( dynamicCampaignText.remainingDonationSum ).toBe( '8,900,000 euro' );
	} );

	it( 'Gets the visitors vs donors sentence', () => {
		expect( dynamicCampaignText.visitorsVsDonorsSentence ).toBe( '42-7,305' );
	} );

	it( 'Gets the progress bar content', () => {
		expect( dynamicCampaignText.progressBarContent.percentageTowardsTarget ).toBeCloseTo( 1.523 );
		expect( dynamicCampaignText.progressBarContent.donationTarget ).toBe( 'Progress total €9.0M' );
		expect( dynamicCampaignText.progressBarContent.donationTargetAmount ).toBe( '€9.0M' );
		expect( dynamicCampaignText.progressBarContent.amountDonated ).toBe( '€0.1M' );
		expect( dynamicCampaignText.progressBarContent.amountNeeded ).toBe( 'Progress missing 8,900,000 euro' );
	} );

	it( 'Gets the average donation', () => {
		expect( dynamicCampaignText.averageDonation ).toBe( '€20' );
	} );
} );

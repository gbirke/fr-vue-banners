import { describe, expect, it } from 'vitest';
import { Translator } from '@src/Translator';
import { Ordinal } from '@src/utils/DynamicContent/formatters/Ordinal';
import { OrdinalDe } from '@src/utils/DynamicContent/formatters/OrdinalDe';
import { CampaignDaySentence } from '@src/utils/DynamicContent/generators/CampaignDaySentence';
import TimeRange from '@src/utils/TimeRange';

const beforeStartDate = new Date( 2023, 10, 10 );
const startDate = new Date( 2023, 10, 11 );
const endDate = new Date( 2024, 0, 1 );
const after24HoursDate = new Date( 2023, 10, 12 );
const after48HoursDate = new Date( 2023, 10, 13 );
const urgencyDate = new Date( 2023, 11, 22 );
const secondLastDayDate = new Date( 2023, 11, 30 );
const lastDayDate = new Date( 2023, 11, 31 );
const afterEndDate = new Date( 2024, 0, 1, 0, 0, 1 );

const staticOrdinal: Ordinal = {
	getFormatted: ( figure: number ) => figure + 'sth'
};

describe( 'CampaignDaySentence', function () {
	it( 'returns correct sentence when the campaign has not started yet', () => {
		const campaignDays = new TimeRange( startDate, endDate, beforeStartDate );
		const campaignDaySentence = new CampaignDaySentence( campaignDays, new Translator( {} ), new OrdinalDe() );

		expect( campaignDaySentence.getText() ).toEqual( 'campaign-day-before-campaign' );
	} );

	it( 'returns the correct sentence for the first day of the campaign', () => {
		const campaignDays = new TimeRange( startDate, endDate, after24HoursDate );
		const campaignDaySentence = new CampaignDaySentence( campaignDays, new Translator( {} ), new OrdinalDe() );

		expect( campaignDaySentence.getText() ).toEqual( 'campaign-day-first-day' );
	} );

	it( 'returns the correct sentence from the second day of the campaign onwards', () => {
		const campaignDays = new TimeRange( startDate, endDate, after48HoursDate );
		const campaignDaySentence = new CampaignDaySentence( campaignDays, new Translator( {} ), new OrdinalDe() );

		expect( campaignDaySentence.getText() ).toEqual( 'campaign-day-nth-day' );
	} );

	it( 'adds an ordinal to the main campaign text', () => {
		const campaignDays = new TimeRange( startDate, endDate, after48HoursDate );
		const campaignDaySentence = new CampaignDaySentence( campaignDays, new Translator( { 'campaign-day-nth-day': '{{days}}' } ), staticOrdinal );

		expect( campaignDaySentence.getText() ).toEqual( '2sth' );
	} );

	it( 'returns the urgency sentence when the campaign is getting close to the end', () => {
		const campaignDays = new TimeRange( startDate, endDate, urgencyDate );
		const campaignDaySentence = new CampaignDaySentence( campaignDays, new Translator( {} ), new OrdinalDe(), 10 );

		expect( campaignDaySentence.getText() ).toEqual( 'campaign-day-only-n-days' );
	} );

	it( 'returns the second last day sentence when the campaign is on the second last day', () => {
		const campaignDays = new TimeRange( startDate, endDate, secondLastDayDate );
		const campaignDaySentence = new CampaignDaySentence( campaignDays, new Translator( {} ), new OrdinalDe(), 10 );

		expect( campaignDaySentence.getText() ).toEqual( 'campaign-day-second-last-day' );
	} );

	it( 'returns the last day sentence when the campaign is on the last day', () => {
		const campaignDays = new TimeRange( startDate, endDate, lastDayDate );
		const campaignDaySentence = new CampaignDaySentence( campaignDays, new Translator( {} ), new OrdinalDe(), 10 );

		expect( campaignDaySentence.getText() ).toEqual( 'campaign-day-last-day' );
	} );

	it( 'returns nothing after the campaign', () => {
		const campaignDays = new TimeRange( startDate, endDate, afterEndDate );
		const campaignDaySentence = new CampaignDaySentence( campaignDays, new Translator( {} ), new OrdinalDe(), 10 );

		expect( campaignDaySentence.getText() ).toEqual( '' );
	} );
} );

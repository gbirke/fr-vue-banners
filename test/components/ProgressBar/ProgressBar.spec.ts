import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import ProgressBar from '@src/components/ProgressBar/ProgressBar.vue';
import { DateAndTime } from '@src/utils/DynamicContent/DateAndTime';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

describe( 'ProgressBar.vue', () => {
	let dynamicCampaignContent: DynamicContent;

	beforeEach( () => {
		dynamicCampaignContent = {
			campaignDaySentence: '',
			currentDate: '',
			getCurrentDateAndTime(): DateAndTime {
				return { currentDate: '', currentTime: '' };
			},
			currentDayName: '',
			daysLeftSentence: 'daysLeftSentence',
			donorsNeededSentence: '',
			goalDonationSum: '',
			remainingDonationSum: '',
			overallImpressionCount: 0,
			progressBarContent: {
				percentageTowardsTarget: 42,
				donationTarget: 'donationTarget',
				donationTargetAmount: 'donationTargetAmount',
				amountDonated: 'amountDonated',
				amountNeeded: 'amountNeeded',
				isLateProgress: false
			},
			visitorsVsDonorsSentence: '',
			averageDonation: ''
		};
	} );

	it( 'should add the donation progress percentage as a css variable', () => {
		const wrapper = mount( ProgressBar, {
			props: { amountToShowOnRight: 'TARGET' },
			global: {
				provide: { dynamicCampaignText: dynamicCampaignContent }
			}
		} );

		expect( wrapper.attributes( 'style' ) ).toContain( '--wmde-banner-progress-bar-width: 42%' );
	} );

	it( 'should show the amount donated on left when not late progress', () => {
		dynamicCampaignContent.progressBarContent.isLateProgress = false;
		const wrapper = mount( ProgressBar, {
			props: {
				amountToShowOnRight: 'TARGET'
			},
			global: {
				provide: { dynamicCampaignText: dynamicCampaignContent }
			}
		} );

		expect( wrapper.find( '.wmde-banner-progress-bar-text-left' ).text() ).toContain( 'amountDonated' );
	} );

	it( 'should show the days left sentence on left when late progress', () => {
		dynamicCampaignContent.progressBarContent.isLateProgress = true;
		const wrapper = mount( ProgressBar, {
			props: {
				amountToShowOnRight: 'TARGET'
			},
			global: {
				provide: { dynamicCampaignText: dynamicCampaignContent }
			}
		} );

		expect( wrapper.find( '.wmde-banner-progress-bar-text-left' ).text() ).toContain( 'daysLeftSentence' );
	} );

	it( 'should show the total on right when prop is passed', () => {
		const wrapper = mount( ProgressBar, {
			props: { amountToShowOnRight: 'TARGET' },
			global: {
				provide: { dynamicCampaignText: dynamicCampaignContent }
			}
		} );

		expect( wrapper.find( '.wmde-banner-progress-bar-text-right' ).text() ).toContain( 'donationTarget' );
	} );

	it( 'should show missing amount on right when prop is passed', () => {
		const wrapper = mount( ProgressBar, {
			props: { amountToShowOnRight: 'MISSING' },
			global: {
				provide: { dynamicCampaignText: dynamicCampaignContent }
			}
		} );

		expect( wrapper.find( '.wmde-banner-progress-bar-text-right' ).text() ).toContain( 'amountNeeded' );
	} );

	it( 'should show the amount donated in the progress bar', () => {
		const wrapper = mount( ProgressBar, {
			props: { amountToShowOnRight: 'MISSING' },
			global: {
				provide: { dynamicCampaignText: dynamicCampaignContent }
			}
		} );

		expect( wrapper.find( '.wmde-banner-progress-bar-fill-text' ).text() ).toContain( 'amountDonated' );
	} );

	it( 'should set late progress as a class', () => {
		dynamicCampaignContent.progressBarContent.isLateProgress = true;
		const wrapper = mount( ProgressBar, {
			props: {
				amountToShowOnRight: 'MISSING'
			},
			global: {
				provide: { dynamicCampaignText: dynamicCampaignContent }
			}
		} );

		expect( wrapper.attributes( 'class' ) ).toContain( 'wmde-banner-progress-bar--late-progress' );
	} );

} );

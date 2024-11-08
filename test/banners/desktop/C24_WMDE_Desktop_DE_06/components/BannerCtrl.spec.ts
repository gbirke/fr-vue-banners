import { mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, test } from 'vitest';
import Banner from '@banners/desktop/C24_WMDE_Desktop_DE_06/components/BannerCtrl.vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { useFormModel } from '@src/components/composables/useFormModel';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';
import { CurrencyEn } from '@src/utils/DynamicContent/formatters/CurrencyEn';
import { Timer } from '@src/utils/Timer';
import { newDynamicContent } from '@test/banners/dynamicCampaignContent';
import { formItems } from '@test/banners/formItems';
import { useOfFundsContent } from '@test/banners/useOfFundsContent';
import { bannerContentAnimatedTextFeatures, bannerContentDateAndTimeFeatures, bannerContentDisplaySwitchFeatures, bannerContentFeatures } from '@test/features/BannerContent';
import { formActionSwitchFeatures } from '@test/features/form_action_switch/MainDonation_UpgradeToYearlyButton';
import { donationFormFeatures } from '@test/features/forms/MainDonation_UpgradeToYearlyButton';
import { bannerMainFeatures } from '@test/features/MainBanner';
import { useOfFundsFeatures } from '@test/features/UseOfFunds';
import { TimerStub } from '@test/fixtures/TimerStub';
import { TrackerStub } from '@test/fixtures/TrackerStub';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();
const translator = ( key: string ): string => key;

describe( 'BannerCtrl.vue', () => {

	beforeEach( () => {
		resetFormModel( formModel );
	} );

	const getWrapper = ( dynamicContent: DynamicContent = null, timer: Timer = null ): VueWrapper<any> => {
		return mount( Banner, {
			attachTo: document.body,
			props: {
				bannerState: BannerStates.Pending,
				useOfFundsContent,
				remainingImpressions: 10
			},
			global: {
				mocks: {
					$translate: translator
				},
				provide: {
					translator: { translate: translator },
					dynamicCampaignText: dynamicContent ?? newDynamicContent(),
					currentCampaignTimePercentage: 42,
					formActions: {
						donateWithAddressAction: 'https://example.com/with-address',
						donateAnonymouslyAction: 'https://example.com/without-address'
					},
					currencyFormatter: new CurrencyEn(),
					formItems,
					tracker: new TrackerStub(),
					timer: timer ?? new TimerStub()
				}
			}
		} );
	};

	describe( 'Main Banner', () => {
		test.each( [
			[ 'expectEmitsCloseEvent' ]
		] )( '%s', async ( testName: string ) => {
			await bannerMainFeatures[ testName ]( getWrapper() );
		} );
	} );

	describe( 'Content', () => {
		test.each( [
			[ 'expectSlideShowPlaysWhenBecomesVisible' ],
			[ 'expectSlideShowStopsOnFormInteraction' ]
		] )( '%s', async ( testName: string ) => {
			await bannerContentFeatures[ testName ]( getWrapper() );
		} );

		test.each( [
			[ 'expectShowsSlideShowOnSmallSizes' ],
			[ 'expectShowsMessageOnLargeSizes' ]
		] )( '%s', async ( testName: string ) => {
			await bannerContentDisplaySwitchFeatures[ testName ]( getWrapper, 1300 );
		} );

		test.each( [
			[ 'expectShowsAnimatedVisitorsVsDonorsSentenceInMessage' ],
			[ 'expectShowsAnimatedVisitorsVsDonorsSentenceInSlideShow' ]
		] )( '%s', async ( testName: string ) => {
			await bannerContentAnimatedTextFeatures[ testName ]( getWrapper );
		} );

		test.each( [
			[ 'expectShowsLiveDateAndTimeInMessage' ],
			[ 'expectShowsLiveDateAndTimeInSlideshow' ]
		] )( '%s', async ( testName: string ) => {
			await bannerContentDateAndTimeFeatures[ testName ]( getWrapper );
		} );
	} );

	describe( 'Donation Form Happy Paths', () => {
		test.each( [
			[ 'expectMainDonationFormSubmitsWhenSofortIsSelected' ],
			[ 'expectMainDonationFormSubmitsWhenYearlyIsSelected' ],
			[ 'expectMainDonationFormGoesToUpgrade' ],
			[ 'expectUpgradeToYearlyFormSubmitsUpgrade' ],
			[ 'expectUpgradeToYearlyFormSubmitsDontUpgrade' ]
		] )( '%s', async ( testName: string ) => {
			await donationFormFeatures[ testName ]( getWrapper() );
		} );

		test.each( [
			[ 'expectMainDonationFormSubmitsWithAddressForDirectDebit' ],
			[ 'expectMainDonationFormSubmitsWithAddressForPayPal' ],
			[ 'expectUpgradeToYearlyFormSubmitsWithAddressForDirectDebit' ],
			[ 'expectUpgradeToYearlyFormSubmitsWithAddressForPayPal' ]
		] )( '%s', async ( testName: string ) => {
			await formActionSwitchFeatures[ testName ]( getWrapper() );
		} );
	} );

	describe( 'Use of Funds', () => {
		test.each( [
			[ 'expectShowsUseOfFunds' ],
			[ 'expectHidesUseOfFunds' ]
		] )( '%s', async ( testName: string ) => {
			await useOfFundsFeatures[ testName ]( getWrapper() );
		} );
	} );
} );

import { mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, test } from 'vitest';
import Banner from '@banners/wpde_desktop/C24_WPDE_Desktop_01/components/BannerVar.vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { useFormModel } from '@src/components/composables/useFormModel';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';
import { CurrencyEn } from '@src/utils/DynamicContent/formatters/CurrencyEn';
import { Timer } from '@src/utils/Timer';
import { newDynamicContent } from '@test/banners/dynamicCampaignContent';
import { formItems } from '@test/banners/formItems';
import { useOfFundsContent } from '@test/banners/useOfFundsContent';
import { alreadyDonatedModalFeatures } from '@test/features/AlreadyDonatedModal';
import { bannerContentAnimatedTextFeatures, bannerContentDateAndTimeFeatures, bannerContentDisplaySwitchFeatures, bannerContentFeatures } from '@test/features/BannerContent';
import { donationFormTransactionFeeFeatures } from '@test/features/forms/MainDonation_TransactionFee';
import { donationFormFeatures } from '@test/features/forms/MainDonation_UpgradeToYearlyButton';
import { bannerMainFeatures } from '@test/features/MainBanner';
import { setCookieImageFeatures } from '@test/features/SetCookieImage';
import { softCloseFeatures } from '@test/features/SoftCloseDesktop';
import { useOfFundsFeatures } from '@test/features/UseOfFunds';
import { TimerStub } from '@test/fixtures/TimerStub';
import { TrackerStub } from '@test/fixtures/TrackerStub';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();
const translator = ( key: string, context: any ): string => context ? `${key} -- ${Object.entries( context )}` : key;

describe( 'BannerVar.vue', () => {

	beforeEach( () => {
		resetFormModel( formModel );
	} );

	const getWrapper = ( dynamicContent: DynamicContent = null, timer: Timer = null ): VueWrapper<any> => {
		return mount( Banner, {
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
					formActions: { donateWithAddressAction: 'https://example.com', donateWithoutAddressAction: 'https://example.com' },
					currencyFormatter: new CurrencyEn(),
					formItems,
					tracker: new TrackerStub(),
					timer: timer ?? new TimerStub()
				}
			},
			// Needed for isVisible checks, see https://test-utils.vuejs.org/api/#isVisible
			attachTo: document.body
		} );
	};

	describe( 'Main Banner', () => {
		test.each( [
			[ 'expectDoesNotEmitCloseEvent' ]
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
			[ 'expectHidesAnimatedVisitorsVsDonorsSentenceInMessage' ],
			[ 'expectShowsAnimatedVisitorsVsDonorsSentenceInMessage' ],
			[ 'expectHidesAnimatedVisitorsVsDonorsSentenceInSlideShow' ],
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
	} );

	describe( 'Donation Form Transaction Fees', () => {
		test.each( [
			[ 'expectMainDonationFormShowsTransactionFeeForPayPalAndCreditCard' ],
			[ 'expectMainDonationFormSetsSubmitValuesWithTransactionFee' ],
			[ 'expectUpsellFormHasTransactionFee' ]
		] )( '%s', async ( testName: string ) => {
			await donationFormTransactionFeeFeatures[ testName ]( getWrapper() );
		} );
	} );

	describe( 'Soft Close', () => {
		test.each( [
			[ 'expectShowsSoftClose' ],
			[ 'expectEmitsSoftCloseCloseEvent' ],
			[ 'expectEmitsSoftCloseMaybeLaterEvent' ],
			[ 'expectEmitsSoftCloseTimeOutEvent' ],
			[ 'expectEmitsBannerContentChangedOnSoftClose' ],
			[ 'expectDoesNotShowSoftCloseOnFinalBannerImpression' ]
		] )( '%s', async ( testName: string ) => {
			await softCloseFeatures[ testName ]( getWrapper );
		} );
	} );

	describe( 'Set Cookie Image', () => {
		test.each( [
			[ 'expectSetsCookieImageOnSoftCloseClose' ],
			[ 'expectSetsCookieImageOnSoftCloseTimeOut' ],
			[ 'expectDoesNotSetCookieImageOnSoftCloseMaybeLater' ],
			[ 'expectSetCookieImageOnAlreadyDonatedLink' ],
			[ 'expectSetsMaybeLaterCookieOnSoftCloseMaybeLater' ]
		] )( '%s', async ( testName: string ) => {
			await setCookieImageFeatures[ testName ]( getWrapper );
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

	describe( 'Already Donated', () => {
		test.each( [
			[ 'expectFiresMaybeLaterEventOnLinkClick' ]
		] )( '%s', async ( testName: string ) => {
			await alreadyDonatedModalFeatures[ testName ]( getWrapper() );
		} );
	} );

} );

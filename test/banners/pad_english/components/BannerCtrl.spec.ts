import { afterEach, beforeEach, describe, test } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import Banner from '../../../../banners/pad_english/components/BannerCtrl.vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { useOfFundsContent } from '@test/banners/useOfFundsContent';
import { newDynamicContent } from '@test/banners/dynamicCampaignContent';
import { CurrencyEn } from '@src/utils/DynamicContent/formatters/CurrencyEn';
import { formItems } from '@test/banners/formItems';
import { TrackerStub } from '@test/fixtures/TrackerStub';
import { useOfFundsFeatures } from '@test/features/UseOfFunds';
import { bannerContentFeatures } from '@test/features/BannerContent';
import { resetFormModel } from '@test/resetFormModel';
import { useFormModel } from '@src/components/composables/useFormModel';
import { donationFormFeatures } from '@test/features/forms/MainDonation_UpgradeToYearlyButton_CustomAmount';
import { bannerMainFeatures } from '@test/features/BannerMain';

const formModel = useFormModel();
const translator = ( key: string ): string => key;

describe( 'BannerCtrl.vue', () => {
	let wrapper: VueWrapper<any>;
	beforeEach( () => {
		resetFormModel( formModel );

		// attachTo the document body to fix an issue with Vue Test Utils where
		// clicking a submit button in a form does not fire the submit event
		wrapper = mount( Banner, {
			attachTo: document.body,
			props: {
				bannerState: BannerStates.Pending,
				useOfFundsContent
			},
			global: {
				mocks: {
					$translate: translator
				},
				provide: {
					translator: { translate: translator },
					dynamicCampaignText: newDynamicContent(),
					formActions: { donateWithAddressAction: 'https://example.com', donateWithoutAddressAction: 'https://example.com' },
					currencyFormatter: new CurrencyEn(),
					formItems,
					tracker: new TrackerStub()
				}
			}
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
	} );

	describe( 'Banner Main', () => {
		test.each( [
			[ 'expectEmitsCloseEvent' ]
		] )( '%s', async ( testName: string ) => {
			await bannerMainFeatures[ testName ]( wrapper );
		} );
	} );

	describe( 'Content', () => {
		test.each( [
			[ 'expectSlideShowPlaysWhenBecomesVisible' ],
			[ 'expectSlideShowStopsOnFormInteraction' ]
		] )( '%s', async ( testName: string ) => {
			await bannerContentFeatures[ testName ]( wrapper );
		} );
	} );

	describe( 'Donation Form Happy Paths', () => {
		test.each( [
			[ 'expectMainDonationFormSubmitsWhenSofortIsSelected' ],
			[ 'expectMainDonationFormSubmitsWhenYearlyIsSelected' ],
			[ 'expectMainDonationFormGoesToUpgrade' ],
			[ 'expectUpgradeToYearlyFormSubmitsUpgrade' ],
			[ 'expectUpgradeToYearlyFormSubmitsDontUpgrade' ],
			[ 'expectUpgradeToYearlyFormGoesCustomAmount' ],
			[ 'expectCustomAmountFormSubmits' ]
		] )( '%s', async ( testName: string ) => {
			await donationFormFeatures[ testName ]( wrapper );
		} );
	} );

	describe( 'Use of Funds', () => {
		test.each( [
			[ 'expectShowsUseOfFunds' ],
			[ 'expectHidesUseOfFunds' ]
		] )( '%s', async ( testName: string ) => {
			await useOfFundsFeatures[ testName ]( wrapper );
		} );
	} );

} );

import { VueWrapper } from '@vue/test-utils';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { expectCustomAmountFormSubmits } from '@test/features/forms/subForms/CustomAmountForm';
import {
	expectMainDonationFormGoesToPageOnSubmit,
	expectMainDonationFormSubmits,
	submitMainDonationForm
} from '@test/features/forms/subForms/MainDonationForm';
import {
	expectUpgradeToYearlyFormGoesToPageOnLinkClick,
	expectUpgradeToYearlyFormSubmits
} from '@test/features/forms/subForms/UpgradeToYearlyButtonForm';

enum Pages {
	UpgradeToYearly = 2,
	CustomAmount = 3
}

export const donationFormFeatures: Record<string, ( wrapper: VueWrapper<any> ) => Promise<any>> = {
	expectMainDonationFormSubmitsWhenSofortIsSelected: ( wrapper: VueWrapper<any> ) => expectMainDonationFormSubmits(
		wrapper,
		Intervals.ONCE,
		PaymentMethods.SOFORT
	),
	expectMainDonationFormSubmitsWhenYearlyIsSelected: ( wrapper: VueWrapper<any> ) => expectMainDonationFormSubmits(
		wrapper,
		Intervals.YEARLY,
		PaymentMethods.PAYPAL
	),
	expectMainDonationFormGoesToUpgrade: ( wrapper: VueWrapper<any> ) => expectMainDonationFormGoesToPageOnSubmit( wrapper,
		Pages.UpgradeToYearly,
		Intervals.ONCE,
		PaymentMethods.PAYPAL
	),
	expectUpgradeToYearlyFormSubmitsUpgrade: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToYearlyFormSubmits( wrapper, 'yes' );
	},
	expectUpgradeToYearlyFormSubmitsDontUpgrade: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToYearlyFormSubmits( wrapper, 'no' );
	},
	expectUpgradeToYearlyFormGoesCustomAmount: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToYearlyFormGoesToPageOnLinkClick( wrapper, Pages.CustomAmount );
	},
	expectCustomAmountFormSubmits: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await wrapper.find( '.wmde-banner-form-upgrade-custom' ).trigger( 'click' );
		await expectCustomAmountFormSubmits( wrapper, '10' );
	}
};

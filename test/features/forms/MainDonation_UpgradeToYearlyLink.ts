import { VueWrapper } from '@vue/test-utils';
import {
	expectMainDonationFormGoesToPageOnSubmit,
	expectMainDonationFormSubmits,
	submitMainDonationForm
} from '@test/features/forms/subForms/MainDonationForm';
import {
	expectUpgradeToYearlyFormGoesToPageOnLinkClick,
	expectUpgradeToYearlyFormSubmits
} from '@test/features/forms/subForms/UpgradeToYearlyForm';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';

enum Pages {
	MainDonation = 1,
	UpgradeToYearly = 2
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
	expectUpgradeToYearlyFormGoesToMainDonation: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToYearlyFormGoesToPageOnLinkClick( wrapper, Pages.MainDonation );
	}
};

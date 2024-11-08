import { VueWrapper } from '@vue/test-utils';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import {
	expectMainDonationFormGoesToPageOnSubmit,
	expectMainDonationFormSubmits,
	submitMainDonationForm
} from '@test/features/forms/subForms/MainDonationForm';
import {
	expectUpgradeToMonthlyFormGoesToPageOnLinkClick,
	expectUpgradeToMonthlyFormSubmits
} from '@test/features/forms/subForms/UpgradeToMonthlyForm';
import {
	expectUpgradeToYearlyFormGoesToPageOnLinkClick,
	expectUpgradeToYearlyFormSubmits
} from '@test/features/forms/subForms/UpgradeToYearlyForm';

enum Pages {
	MainDonation = 1,
	UpgradeToYearly = 2,
	UpgradeToMonthly = 3
}

export const donationFormFeatures: Record<string, ( wrapper: VueWrapper<any> ) => Promise<any>> = {
	expectMainDonationFormSubmitsWhenSofortIsSelected: ( wrapper: VueWrapper<any> ) => expectMainDonationFormSubmits(
		wrapper,
		Intervals.ONCE,
		PaymentMethods.SOFORT,
		'5'
	),
	expectMainDonationFormSubmitsWhenYearlyIsSelected: ( wrapper: VueWrapper<any> ) => expectMainDonationFormSubmits(
		wrapper,
		Intervals.YEARLY,
		PaymentMethods.PAYPAL,
		'5'
	),
	expectMainDonationFormSubmitsWhenMonthlyIsSelected: ( wrapper: VueWrapper<any> ) => expectMainDonationFormSubmits(
		wrapper,
		Intervals.MONTHLY,
		PaymentMethods.PAYPAL,
		'5'
	),
	expectMainDonationFormSubmitsWhenAmountIsGreaterThanMaxAmount: async ( wrapper: VueWrapper<any> ) => expectMainDonationFormSubmits(
		wrapper,
		Intervals.YEARLY,
		PaymentMethods.PAYPAL,
		'25'
	),
	expectMainDonationFormGoesToUpgradeYearlyOnHighAmounts: ( wrapper: VueWrapper<any> ) => expectMainDonationFormGoesToPageOnSubmit( wrapper,
		Pages.UpgradeToYearly,
		Intervals.ONCE,
		PaymentMethods.PAYPAL,
		'200'
	),
	expectMainDonationFormGoesToUpgradeYearlyOnVeryLowAmounts: ( wrapper: VueWrapper<any> ) => expectMainDonationFormGoesToPageOnSubmit( wrapper,
		Pages.UpgradeToYearly,
		Intervals.ONCE,
		PaymentMethods.PAYPAL,
		'1'
	),
	expectMainDonationFormGoesToUpgradeMonthly: ( wrapper: VueWrapper<any> ) => expectMainDonationFormGoesToPageOnSubmit( wrapper,
		Pages.UpgradeToMonthly,
		Intervals.ONCE,
		PaymentMethods.PAYPAL,
		'20'
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
	},

	expectUpgradeToMonthlyFormSubmitsUpgrade: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToMonthlyFormSubmits( wrapper, 'yes' );
	},
	expectUpgradeToMonthlyFormSubmitsDontUpgrade: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToMonthlyFormSubmits( wrapper, 'no' );
	},
	expectUpgradeToMonthlyFormGoesToMainDonation: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToMonthlyFormGoesToPageOnLinkClick( wrapper, Pages.MainDonation );
	}
};

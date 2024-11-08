import { VueWrapper } from '@vue/test-utils';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { expectAddressTypeFormSubmits } from '@test/features/forms/subForms/AddressTypeButtonForm';
import {
	expectMainDonationFormGoesToPageOnSubmit,
	submitMainDonationForm
} from '@test/features/forms/subForms/MainDonationForm';
import {
	expectUpgradeToYearlyFormGoesToPageOnLinkClick,
	expectUpgradeToYearlyFormGoesToPageOnSubmit
} from '@test/features/forms/subForms/UpgradeToYearlyButtonForm';

enum Pages {
	MainDonation = 1,
	UpgradeToYearly = 2,
	AddressType = 3,
}

export const donationFormFeatures: Record<string, ( wrapper: VueWrapper<any> ) => Promise<any>> = {
	expectMainDonationFormGoesToAddressFormWhenSofortIsSelected: ( wrapper: VueWrapper<any> ) => expectMainDonationFormGoesToPageOnSubmit(
		wrapper,
		Pages.AddressType,
		Intervals.ONCE,
		PaymentMethods.SOFORT
	),
	expectMainDonationFormGoesToAddressFormWhenYearlyIsSelected: ( wrapper: VueWrapper<any> ) => expectMainDonationFormGoesToPageOnSubmit(
		wrapper,
		Pages.AddressType,
		Intervals.YEARLY,
		PaymentMethods.PAYPAL
	),
	expectMainDonationFormGoesToUpgrade: ( wrapper: VueWrapper<any> ) => expectMainDonationFormGoesToPageOnSubmit( wrapper,
		Pages.UpgradeToYearly,
		Intervals.ONCE,
		PaymentMethods.PAYPAL
	),
	expectUpgradeToYearlyFormGoesToAddressTypeOnUpgrade: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToYearlyFormGoesToPageOnSubmit( wrapper, Pages.AddressType, 'yes' );
	},
	expectUpgradeToYearlyFormGoesToAddressTypeOnDontUpgrade: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToYearlyFormGoesToPageOnSubmit( wrapper, Pages.AddressType, 'no' );
	},
	expectUpgradeToYearlyFormGoesToMainDonation: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToYearlyFormGoesToPageOnLinkClick( wrapper, Pages.MainDonation );
	},
	expectAddressTypeButtonFormSubmits: async ( wrapper: VueWrapper<any> )=> {
		await submitMainDonationForm( wrapper, Intervals.YEARLY, '5', PaymentMethods.PAYPAL );
		await expectAddressTypeFormSubmits( wrapper, AddressTypes.FULL );
	}
};

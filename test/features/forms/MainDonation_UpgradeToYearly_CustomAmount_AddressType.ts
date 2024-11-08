import { VueWrapper } from '@vue/test-utils';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { expectAddressTypeFormSubmits } from '@test/features/forms/subForms/AddressTypeForm';
import { expectCustomAmountFormGoesToPageOnSubmit } from '@test/features/forms/subForms/CustomAmountForm';
import {
	expectMainDonationFormGoesToPageOnSubmit,
	submitMainDonationForm
} from '@test/features/forms/subForms/MainDonationForm';
import {
	expectUpgradeToYearlyFormGoesToPageOnLinkClick,
	expectUpgradeToYearlyFormGoesToPageOnSubmit
} from '@test/features/forms/subForms/UpgradeToYearlyForm';

enum Pages {
	UpgradeToYearly = 2,
	CustomAmount = 3,
	Address = 4,
}

export const donationFormFeatures: Record<string, ( wrapper: VueWrapper<any> ) => Promise<any>> = {
	expectMainDonationFormGoesToAddressFormWhenSofortIsSelected: ( wrapper: VueWrapper<any> ) => expectMainDonationFormGoesToPageOnSubmit(
		wrapper,
		Pages.Address,
		Intervals.ONCE,
		PaymentMethods.SOFORT
	),
	expectMainDonationFormGoesToAddressFormWhenYearlyIsSelected: ( wrapper: VueWrapper<any> ) => expectMainDonationFormGoesToPageOnSubmit(
		wrapper,
		Pages.Address,
		Intervals.YEARLY,
		PaymentMethods.PAYPAL
	),
	expectMainDonationFormGoesToUpgrade: ( wrapper: VueWrapper<any> ) => expectMainDonationFormGoesToPageOnSubmit(
		wrapper,
		Pages.UpgradeToYearly,
		Intervals.ONCE,
		PaymentMethods.PAYPAL
	),
	expectUpgradeToYearlyFormGoesToAddressTypeOnUpgrade: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToYearlyFormGoesToPageOnSubmit( wrapper, Pages.Address, 'yes' );
	},
	expectUpgradeToYearlyFormGoesToAddressTypeOnDontUpgrade: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToYearlyFormGoesToPageOnSubmit( wrapper, Pages.Address, 'no' );
	},
	expectUpgradeToYearlyFormGoesToCustomAmount: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await expectUpgradeToYearlyFormGoesToPageOnLinkClick( wrapper, Pages.CustomAmount );
	},
	expectCustomAmountGoesToAddressFormOnSubmit: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		await wrapper.find( '.wmde-banner-form-upgrade-custom' ).trigger( 'click' );
		await expectCustomAmountFormGoesToPageOnSubmit( wrapper, Pages.Address, '10' );
	},
	expectAddressFormSubmits: async ( wrapper: VueWrapper<any> ) => {
		await submitMainDonationForm( wrapper, Intervals.YEARLY, '5', PaymentMethods.PAYPAL );
		await expectAddressTypeFormSubmits( wrapper, AddressTypes.FULL );
	}
};

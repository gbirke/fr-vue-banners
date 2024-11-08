import { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';

import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { FormItem } from '@src/utils/FormItemsBuilder/FormItem';

const setMainDonationFormValues = async ( wrapper: VueWrapper<any>, interval: FormItem, amount: string, payment: FormItem ): Promise<void> => {
	await wrapper.find( `.${interval.className} .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( `.wmde-banner-select-custom-amount-radio` ).setValue();
	await wrapper.find( `.wmde-banner-select-custom-amount-input` ).setValue( amount );
	await wrapper.find( `.${payment.className} .wmde-banner-select-group-input` ).setValue();
};

export const donationFormTransactionFeeFeatures: Record<string, ( wrapper: VueWrapper<any> ) => Promise<any>> = {

	expectMainDonationFormShowsTransactionFeeForPayPalAndCreditCard: async ( wrapper: VueWrapper<any> ) => {
		await setMainDonationFormValues( wrapper, Intervals.ONCE, '5', PaymentMethods.PAYPAL );
		const transactionFeeConsentContainer = wrapper.find( `.wmde-banner-form-transaction-fee` );
		expect( transactionFeeConsentContainer.exists(), 'Fee consent checkbox should exist' ).toBe( true );
		expect( transactionFeeConsentContainer.isVisible(), 'Fee consent checkbox should be visible' ).toBe( true );
		await setMainDonationFormValues( wrapper, Intervals.ONCE, '5', PaymentMethods.SOFORT );
		expect( transactionFeeConsentContainer.isVisible(), 'Fee consent checkbox should NOT be visible' ).toBe( false );
		await setMainDonationFormValues( wrapper, Intervals.ONCE, '5', PaymentMethods.CREDIT_CARD );
		expect( transactionFeeConsentContainer.isVisible(), 'Fee consent checkbox should be visible' ).toBe( true );
		await setMainDonationFormValues( wrapper, Intervals.ONCE, '5', PaymentMethods.DIRECT_DEBIT );
		expect( transactionFeeConsentContainer.isVisible(), 'Fee consent checkbox should NOT be visible' ).toBe( false );
	},

	expectMainDonationFormSetsSubmitValuesWithTransactionFee: async ( wrapper: VueWrapper<any> ) => {
		await setMainDonationFormValues( wrapper, Intervals.MONTHLY, '23', PaymentMethods.CREDIT_CARD );
		await wrapper.find<HTMLInputElement>( `.wmde-banner-form-transaction-fee  .wmde-banner-form-field-checkbox` ).setValue( true );
		const formattedSubmitAmount = wrapper.find<HTMLInputElement>( '.wmde-banner-submit-form input[name=amount]' ).element.value;
		// 23 * 0.0175 + 0.29 = 0.69 rounded to 2 decimal places
		expect( formattedSubmitAmount ).toBe( '2369' );
	},

	expectUpsellFormHasTransactionFee: async ( wrapper: VueWrapper<any> ) => {
		await setMainDonationFormValues( wrapper, Intervals.ONCE, '42', PaymentMethods.PAYPAL );
		await wrapper.find<HTMLInputElement>( `.wmde-banner-form-transaction-fee  .wmde-banner-form-field-checkbox` ).setValue( true );

		// 42 * 0.015 + 0.35 = 0.98 rounded to 2 decimal places
		// To make this work, the translator mock for the wrapper needs to output the placeholder values passed to it
		expect( wrapper.find( `.wmde-banner-form-upgrade-title` ).text() ).toContain( '42.98' );
		expect( wrapper.find( `.t-annual-upgrade-no` ).text() ).toContain( '42.98' );
		expect( wrapper.find( `.t-annual-upgrade-yes` ).text() ).toContain( '42.98' );
	}
};

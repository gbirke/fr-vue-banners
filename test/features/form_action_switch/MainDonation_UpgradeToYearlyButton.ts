import { VueWrapper } from '@vue/test-utils';
import { expect, vi } from 'vitest';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { FormItem } from '@src/utils/FormItemsBuilder/FormItem';

const goToUpgradeStep = async ( wrapper: VueWrapper<any>, payment: FormItem ): Promise<any> => {
	await wrapper.find( `.interval-0 .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( `.amount-10 .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( `.${payment.className} .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( '.wmde-banner-sub-form-donation' ).trigger( 'submit' );
};

const expectMainDonationFormSubmitsWithAddressForDirectDebit = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
	submitForm.element.submit = vi.fn();

	await wrapper.find( `.interval-1 .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( `.amount-10 .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( `.payment-bez .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( '.wmde-banner-sub-form-donation' ).trigger( 'submit' );

	expect( submitForm.element.submit ).toHaveBeenCalledOnce();
	expect( submitForm.attributes( 'action' ) ).contains( 'with-address' );
};

const expectMainDonationFormSubmitsWithoutAddressForPayPal = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
	submitForm.element.submit = vi.fn();

	await wrapper.find( `.interval-1 .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( `.amount-10 .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( `.payment-ppl .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( '.wmde-banner-sub-form-donation' ).trigger( 'submit' );

	expect( submitForm.element.submit ).toHaveBeenCalledOnce();
	expect( submitForm.attributes( 'action' ) ).contains( 'without-address' );
};

const expectMainDonationFormSubmitsWithAddressForPayPal = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
	submitForm.element.submit = vi.fn();

	await wrapper.find( `.interval-1 .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( `.amount-10 .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( `.payment-ppl .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( '.wmde-banner-sub-form-donation' ).trigger( 'submit' );

	expect( submitForm.element.submit ).toHaveBeenCalledOnce();
	expect( submitForm.attributes( 'action' ) ).contains( 'with-address' );
};

const expectUpgradeToYearlyFormSubmitsWithAddressForDirectDebit = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
	submitForm.element.submit = vi.fn();

	await goToUpgradeStep( wrapper, PaymentMethods.DIRECT_DEBIT );

	await wrapper.find( `.wmde-banner-form-upgrade button[value="0"]` ).trigger( 'click' );

	expect( submitForm.element.submit ).toHaveBeenCalledOnce();
	expect( submitForm.attributes( 'action' ) ).contains( 'with-address' );
};

const expectUpgradeToYearlyFormSubmitsWithoutAddressForPayPal = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
	submitForm.element.submit = vi.fn();

	await goToUpgradeStep( wrapper, PaymentMethods.PAYPAL );

	await wrapper.find( `.wmde-banner-form-upgrade button[value="0"]` ).trigger( 'click' );

	expect( submitForm.element.submit ).toHaveBeenCalledOnce();
	expect( submitForm.attributes( 'action' ) ).contains( 'without-address' );
};

const expectUpgradeToYearlyFormSubmitsWithAddressForPayPal = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
	submitForm.element.submit = vi.fn();

	await goToUpgradeStep( wrapper, PaymentMethods.PAYPAL );

	await wrapper.find( `.wmde-banner-form-upgrade button[value="0"]` ).trigger( 'click' );

	expect( submitForm.element.submit ).toHaveBeenCalledOnce();
	expect( submitForm.attributes( 'action' ) ).contains( 'with-address' );
};

export const formActionSwitchFeatures: Record<string, ( wrapper: VueWrapper<any> ) => Promise<any>> = {
	expectMainDonationFormSubmitsWithAddressForDirectDebit,
	expectMainDonationFormSubmitsWithoutAddressForPayPal,
	expectMainDonationFormSubmitsWithAddressForPayPal,
	expectUpgradeToYearlyFormSubmitsWithAddressForDirectDebit,
	expectUpgradeToYearlyFormSubmitsWithoutAddressForPayPal,
	expectUpgradeToYearlyFormSubmitsWithAddressForPayPal
};

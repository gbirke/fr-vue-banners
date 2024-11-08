import { VueWrapper } from '@vue/test-utils';
import { expect, vi } from 'vitest';
import { FormItem } from '@src/utils/FormItemsBuilder/FormItem';

export const submitAddressTypeForm = async ( wrapper: VueWrapper<any>, addressType: FormItem ): Promise<void> => {
	await wrapper.find( `.${addressType.className} .wmde-banner-select-group-input` ).setValue();
	await wrapper.find( '.wmde-banner-form-address-type' ).trigger( 'submit' );
};

export const expectAddressTypeFormSubmits = async ( wrapper: VueWrapper<any>, addressType: FormItem ): Promise<void> => {
	const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
	submitForm.element.submit = vi.fn();

	await submitAddressTypeForm( wrapper, addressType );

	expect( submitForm.element.submit ).toHaveBeenCalledOnce();
};

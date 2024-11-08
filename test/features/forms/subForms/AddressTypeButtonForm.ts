import { VueWrapper } from '@vue/test-utils';
import { expect, vi } from 'vitest';
import { FormItem } from '@src/utils/FormItemsBuilder/FormItem';

export const submitAddressTypeButtonForm = async ( wrapper: VueWrapper<any>, addressType: FormItem ): Promise<void> => {
	await wrapper.find( `button[value=${ addressType.value }]` ).trigger( 'click' );
};

export const expectAddressTypeFormSubmits = async ( wrapper: VueWrapper<any>, addressType: FormItem ): Promise<void> => {
	const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
	submitForm.element.submit = vi.fn();

	await submitAddressTypeButtonForm( wrapper, addressType );

	expect( submitForm.element.submit ).toHaveBeenCalledOnce();
};

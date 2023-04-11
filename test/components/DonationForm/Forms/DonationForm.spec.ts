import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import DonationForm from '@src/components/DonationForm/Forms/MainDonationForm.vue';
import { DonationFormItems } from '@src/utils/FormItemsBuilder/DonationFormItems';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { newDonationFormValidator } from '@src/validation/DonationFormValidator';
import { useFormModel } from '@src/components/composables/useFormModel';
import { resetFormModel } from '@test/resetFormModel';

const formItems: DonationFormItems = {
	addressType: [ AddressTypes.NO, AddressTypes.EMAIL ],
	amounts: [
		{ value: '1', label: '€1', className: 'amount-1' },
		{ value: '5', label: '€5', className: 'amount-5' }
	],
	intervals: [ Intervals.ONCE, Intervals.MONTHLY ],
	paymentMethods: [ PaymentMethods.PAYPAL, PaymentMethods.CREDIT_CARD ]
};

vi.mock( '@src/validation/DonationFormValidator', () => {
	return {
		newDonationFormValidator: vi.fn()
	};
} );

const formModel = useFormModel();

describe( 'DonationForm.vue', () => {

	// The model values are in the global scope, and they need to be reset before each test
	beforeEach( () => resetFormModel( formModel ) );

	const getWrapper = (): VueWrapper<any> => {
		return mount( DonationForm, {
			global: {
				mocks: {
					$translate: ( key: string ) => key
				},
				provide: {
					currencyFormatter: ( amount: number ) => String( amount ),
					formActions: { donateWithAddressAction: 'https://example.com', donateWithoutAddressAction: 'https://example.com' },
					formItems: formItems
				}
			}
		} );
	};

	it( 'should clear selected amount when input field is focused', () => {
		const input = getWrapper().find<HTMLInputElement>( '.wmde-banner-select-custom-amount-input' );
		formModel.selectedAmount.value = '100';

		input.trigger( 'focus' );

		expect( formModel.selectedAmount.value ).toBe( '' );
	} );

	it( 'should format custom amount when custom amount input field is blurred and it has a value', async () => {
		const input = getWrapper().find<HTMLInputElement>( '.wmde-banner-select-custom-amount-input' );

		await input.setValue( '3,14' );
		await input.trigger( 'blur' );

		expect( input.element.value ).toBe( '3.14' );
	} );

	it( 'should not format custom amount to 0.00 when input field is blurred and is blank', async () => {
		const input = getWrapper().find<HTMLInputElement>( '.wmde-banner-select-custom-amount-input' );

		await input.trigger( 'blur' );

		expect( input.element.value ).toBe( '' );
	} );

	it( 'shows invalid fields on submit when fields are invalid', async () => {
		vi.mocked( newDonationFormValidator ).mockReturnValue( { validate: () => false } );
		const wrapper = getWrapper();

		await wrapper.trigger( 'submit' );

		expect( wrapper.find( '.select-interval .wmde-banner-select-group-error-message' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.select-amount .wmde-banner-select-group-error-message' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.select-payment-method .wmde-banner-select-group-error-message' ).exists() ).toBeTruthy();
	} );

	it( 'emits an event on submit when fields are valid', () => {
		vi.mocked( newDonationFormValidator ).mockReturnValue( { validate: () => true } );
		const wrapper = getWrapper();

		wrapper.trigger( 'submit' );

		expect( wrapper.emitted( 'submit' ).length ).toBe( 1 );
	} );

	it( 'does not emit our own submit event when form fields are invalid', () => {
		vi.mocked( newDonationFormValidator ).mockReturnValue( { validate: () => false } );
		const wrapper = getWrapper();

		wrapper.trigger( 'submit' );

		expect( wrapper.emitted( 'submit' ) ).toBeUndefined();
	} );
} );

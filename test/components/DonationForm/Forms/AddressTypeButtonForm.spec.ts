import { mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { useFormModel } from '@src/components/composables/useFormModel';
import AddressTypeButtonForm from '@src/components/DonationForm/Forms/AddressTypeButtonForm.vue';
import { FormStepShownEvent } from '@src/tracking/events/FormStepShownEvent';
import { DonationFormItems } from '@src/utils/FormItemsBuilder/DonationFormItems';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { TrackerSpy } from '@test/fixtures/TrackerSpy';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

document.body.innerHTML = `<div id="app"></div>`;

describe( 'AddressTypeForm.vue', () => {

	const translator = ( key: string ): string => key;

	const formItems: DonationFormItems = {
		addressType: [ AddressTypes.ANONYMOUS, AddressTypes.EMAIL, AddressTypes.FULL ],
		amounts: [],
		intervals: [],
		paymentMethods: []
	};

	let wrapper: VueWrapper<any>;
	let tracker: TrackerSpy;

	beforeEach( () => {
		resetFormModel( formModel );
		tracker = new TrackerSpy();
		wrapper = mount( AddressTypeButtonForm, {
			props: {
				isCurrent: false
			},
			global: {
				mocks: {
					$translate: translator
				},
				provide: {
					translator: { translate: translator },
					formItems: formItems,
					tracker
				}
			},
			attachTo: document.getElementById( 'app' )
		} );
	} );

	it( 'should render all the address type items as buttons', () => {
		expect( wrapper.findAll( `.wmde-banner-form-address-type-button` ).length ).toBe( 3 );
		expect( wrapper.find( `button[value=${ AddressTypes.FULL.value }]` ).exists() ).toBe( true );
		expect( wrapper.find( `button[value=${ AddressTypes.EMAIL.value }]` ).exists() ).toBe( true );
		expect( wrapper.find( `button[value=${ AddressTypes.ANONYMOUS.value }]` ).exists() ).toBe( true );
	} );

	it( 'should change the form model when an address button is clicked', async () => {
		await wrapper.find( `button[value=${ AddressTypes.FULL.value }]` ).trigger( 'click' );

		expect( formModel.addressType.value ).toBe( AddressTypes.FULL.value );
	} );

	it( 'should emit a submit event when an address button is clicked', async () => {
		await wrapper.find( `button[value=${ AddressTypes.ANONYMOUS.value }]` ).trigger( 'click' );

		expect( wrapper.emitted( 'submit' ).length ).toBe( 1 );
	} );

	it( 'should show direct debit hint when direct debit was selected on donation form page', async () => {
		formModel.paymentMethod.value = PaymentMethods.DIRECT_DEBIT.value;
		await nextTick();

		expect( wrapper.find( '.wmde-banner-form-address-type-notice' ).text() ).toBe( 'address-type-notice-direct-debit' );

		formModel.paymentMethod.value = PaymentMethods.BANK_TRANSFER.value;
		await nextTick();

		expect( wrapper.find( '.wmde-banner-form-address-type-notice' ).text() ).toBe( '' );
	} );

	it( 'should disable anonymous address option when direct debit was selected on donation form page', async () => {
		formModel.paymentMethod.value = PaymentMethods.DIRECT_DEBIT.value;
		await nextTick();

		const anonButton = wrapper.find( `button[value=${ AddressTypes.ANONYMOUS.value }]` );

		expect( anonButton.attributes().disabled ).toBeDefined();

		formModel.paymentMethod.value = PaymentMethods.BANK_TRANSFER.value;
		await nextTick();

		expect( anonButton.attributes().disabled ).toBe( undefined );
	} );

	it( 'should add "disabled" class to anonymous address wrapper when direct debit was selected on donation form page', async () => {
		formModel.paymentMethod.value = PaymentMethods.DIRECT_DEBIT.value;
		await nextTick();

		const childElement = wrapper.find( `.wmde-banner-form-address-type-button:nth-child(1)` );

		expect( childElement.classes() ).toContain( 'wmde-banner-form-address-type-button--disabled' );

		formModel.paymentMethod.value = PaymentMethods.BANK_TRANSFER.value;
		await nextTick();

		expect( childElement.classes() ).not.toContain( 'wmde-banner-form-address-type-button--disabled' );
	} );

	it( 'should emit "previous" event when back button is clicked', async () => {
		await wrapper.find( '.previous' ).trigger( 'click' );

		expect( wrapper.emitted( 'previous' ).length ).toBe( 1 );
	} );

	describe( 'tracking events', function () {

		it( 'sends the FormStepShownEvent to tracker when the form becomes the current form', async () => {
			await wrapper.setProps( { isCurrent: true } );

			expect( tracker.hasTrackedEvent( FormStepShownEvent.EVENT_NAME ) ).toBe( true );
			expect( tracker.getTrackedEvent( FormStepShownEvent.EVENT_NAME ) ).toEqual( new FormStepShownEvent( 'AddressTypeForm' ) );
		} );
	} );

} );

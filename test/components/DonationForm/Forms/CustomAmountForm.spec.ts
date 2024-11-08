import { shallowMount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, test } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import CustomAmountForm from '@src/components/DonationForm/Forms/CustomAmountForm.vue';
import { CustomAmountChangedEvent } from '@src/tracking/events/CustomAmountChangedEvent';
import { FormStepShownEvent } from '@src/tracking/events/FormStepShownEvent';
import { CurrencyEn } from '@src/utils/DynamicContent/formatters/CurrencyEn';
import { TrackerSpy } from '@test/fixtures/TrackerSpy';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

describe( 'CustomAmountForm.vue', () => {
	let tracker: TrackerSpy;

	beforeEach( () => {
		resetFormModel( formModel );
		tracker = new TrackerSpy();
	} );

	const getWrapper = (): VueWrapper<any> => {
		return shallowMount( CustomAmountForm, {
			props: {
				isCurrent: false
			},
			global: {
				mocks: {
					$translate: ( key: string, templateTags: Record<string, string | number> = {} ) => {
						return `${ key } ${ JSON.stringify( templateTags ) }`;
					}
				},
				provide: {
					currencyFormatter: new CurrencyEn(),
					tracker
				}
			}
		} );
	};

	test.each( [
		[ 0, true ],
		[ 100_000, true ],
		[ 5000, false ],
		[ 'tttt', true ]
	] )( 'should show error message on blur when validation fails', async ( amount: number|string, showError: boolean ) => {
		const wrapper = getWrapper();
		const input = await wrapper.find( '.wmde-banner-select-custom-amount-input' );

		await input.setValue( amount );
		await input.trigger( 'blur' );

		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBe( showError );
		expect( wrapper.find( '.wmde-banner-select-group-container--with-error' ).exists() ).toBe( showError );
	} );

	it( 'skips validation when amount input field is blurred with empty content', async () => {
		const wrapper = getWrapper();
		const input = await wrapper.find<HTMLInputElement>( '.wmde-banner-select-custom-amount-input' );

		await input.setValue( '' );
		await input.trigger( 'blur' );

		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBe( false );
		expect( wrapper.find( '.wmde-banner-select-group-container--with-error' ).exists() ).toBe( false );
		expect( input.element.value ).toBe( '' );
	} );

	test.each( [
		[ '42', '€42' ],
		[ '42,42', '€42.42' ],
		[ '42,40', '€42.40' ]
	] )( 'should format the custom amount for the button', async ( amount: string, buttonAmount: string ) => {
		const wrapper = getWrapper();
		const input = await wrapper.find( '.wmde-banner-select-custom-amount-input' );

		await input.setValue( amount );

		expect( wrapper.find( '.wmde-banner-form-button' ).text() ).toContain( `{"amount":"${buttonAmount}"}` );
	} );

	it( 'should emit previous event', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.previous' ).trigger( 'click' );

		expect( wrapper.emitted( 'previous' ).length ).toBe( 1 );
	} );

	it( 'should clear new custom amount input when previous event is emitted', async () => {
		const wrapper = getWrapper();
		const input = await wrapper.find<HTMLInputElement>( '.wmde-banner-select-custom-amount-input' );

		await input.setValue( '34.34' );
		await wrapper.find( '.previous' ).trigger( 'click' );

		expect( input.element.value ).toBe( '' );
	} );

	it( 'should emit "submit" event with new amount', async function () {
		const wrapper = getWrapper();
		const input = await wrapper.find( '.wmde-banner-select-custom-amount-input' );

		await input.setValue( '56,789' );
		await wrapper.trigger( 'submit' );

		expect( wrapper.emitted( 'submit' ).length ).toBe( 1 );
		expect( wrapper.emitted( 'submit' )[ 0 ][ 0 ] ).toEqual( { newCustomAmount: '56.79' } );
	} );

	test.each( [
		[ '0' ],
		[ 'tttt' ],
		[ '100_000' ]
	] )( 'should show error message when user hits submit with invalid custom amount', async function ( amount: string ) {
		const wrapper = getWrapper();
		const input = await wrapper.find( '.wmde-banner-select-custom-amount-input' );

		await input.setValue( amount );
		await wrapper.trigger( 'submit' );

		expect( wrapper.emitted( 'submit' ) ).toBe( undefined );
		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBe( true );
		expect( wrapper.find( '.wmde-banner-select-group-container--with-error' ).exists() ).toBe( true );
	} );

	describe( 'tracking events ', function () {

		it( 'should track "increased amount"', async function () {
			const wrapper = getWrapper();
			formModel.customAmount.value = '1';

			const input = await wrapper.find( '.wmde-banner-select-custom-amount-input' );
			await input.setValue( '99.99' );
			await wrapper.trigger( 'submit' );

			expect( tracker.hasTrackedEvent( CustomAmountChangedEvent.EVENT_NAME ) ).toBe( true );
			expect( tracker.getTrackedEvent( CustomAmountChangedEvent.EVENT_NAME ) ).toEqual( new CustomAmountChangedEvent( 'increased' ) );

		} );

		it( 'should track "decreased amount"', async function () {
			const wrapper = getWrapper();
			formModel.customAmount.value = '42';

			const input = await wrapper.find( '.wmde-banner-select-custom-amount-input' );
			await input.setValue( '23' );
			await wrapper.trigger( 'submit' );

			expect( tracker.hasTrackedEvent( CustomAmountChangedEvent.EVENT_NAME ) ).toBe( true );
			expect( tracker.getTrackedEvent( CustomAmountChangedEvent.EVENT_NAME ) ).toEqual( new CustomAmountChangedEvent( 'decreased' ) );
		} );

		it( 'sends the FormStepShownEvent to tracker when the form becomes the current form', async () => {
			const wrapper = getWrapper();

			await wrapper.setProps( { isCurrent: true } );

			expect( tracker.hasTrackedEvent( FormStepShownEvent.EVENT_NAME ) ).toBe( true );
			expect( tracker.getTrackedEvent( FormStepShownEvent.EVENT_NAME ) ).toEqual( new FormStepShownEvent( 'CustomAmountForm' ) );
		} );
	} );
} );

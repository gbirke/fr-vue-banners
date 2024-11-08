import { shallowMount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { useFormModel } from '@src/components/composables/useFormModel';
import UpgradeToMonthlyForm from '@src/components/DonationForm/Forms/UpgradeToMonthlyForm.vue';
import { FormStepShownEvent } from '@src/tracking/events/FormStepShownEvent';
import { UpgradeToMonthlyEvent } from '@src/tracking/events/UpgradeToMonthlyEvent';
import { CurrencyEn } from '@src/utils/DynamicContent/formatters/CurrencyEn';
import { TrackerSpy } from '@test/fixtures/TrackerSpy';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

describe( 'UpgradeToMonthlyForm.vue', () => {
	let tracker: TrackerSpy;

	// The model values are in the global scope, and they need to be reset before each test
	beforeEach( () => {
		resetFormModel( formModel );
		tracker = new TrackerSpy();
	} );

	const getWrapper = (): VueWrapper<any> => {
		return shallowMount( UpgradeToMonthlyForm, {
			props: {
				pageIndex: 4,
				isCurrent: false,
				suggestions: [
					{
						lowerRangeLimit: 11,
						upperRangeLimit: 100,
						suggestedAmount: 666
					}
				]
			},
			global: {
				mocks: {
					$translate: ( key: string, templateTags: Record<string, string | number> = {} ) => {
						return `${key} ${JSON.stringify( templateTags )}`;
					}
				},
				provide: {
					currencyFormatter: new CurrencyEn(),
					tracker
				}
			}
		} );
	};

	it( 'should emit "previous" event when back button is clicked', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-form-upgrade-back' ).trigger( 'click' );

		expect( wrapper.emitted( 'previous' ).length ).toBe( 1 );
	} );

	it( 'should emit "submit" event with payload when user wants to donate monthly with different amount', async () => {
		const wrapper = getWrapper();
		const monthlyIntervalValue = '1';

		await wrapper.find( '.wmde-banner-form-upgrade-custom' ).trigger( 'click' );

		expect( wrapper.emitted( 'submit' ).length ).toBe( 1 );
		expect( wrapper.emitted( 'submit' )[ 0 ][ 0 ] ).toEqual( { changeOfAmount: true, upgradeToMonthlyInterval: monthlyIntervalValue } );
	} );

	it( 'should show an error when user does not select any interval ', async function () {
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-sub-form' ).trigger( 'submit' );

		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBe( true );
		expect( wrapper.emitted( 'submit' ) ).toBe( undefined );
	} );

	it( 'should hide the error when user selects an option', async function () {
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-sub-form' ).trigger( 'submit' );

		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBe( true );

		await wrapper.find( '.wmde-banner-select-group-input' ).trigger( 'change' );

		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBe( false );
	} );

	it( 'should hide the error when user clicks on the "link" option', async function () {
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-sub-form' ).trigger( 'submit' );

		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBe( true );

		await wrapper.find( '.wmde-banner-form-upgrade-custom' ).trigger( 'click' );

		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBe( false );
	} );

	it( 'should emit "submit" event when user selects an interval and submits ', async function () {
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-select-group-input' ).trigger( 'change' );
		await wrapper.find( '.wmde-banner-sub-form' ).trigger( 'submit' );

		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBe( false );
		expect( wrapper.emitted( 'submit' ).length ).toBe( 1 );
	} );

	it( 'should submit the chosen interval and new numeric amount when form was submitted ', async function () {
		const wrapper = getWrapper();
		formModel.selectedAmount.value = '22';
		const monthlyIntervalValue = '1';

		await wrapper.find( '.wmde-banner-select-group-option-no .wmde-banner-select-group-input' ).trigger( 'change' );
		await wrapper.find( '.wmde-banner-sub-form' ).trigger( 'submit' );

		await wrapper.find( '.wmde-banner-select-group-option-yes .wmde-banner-select-group-input' ).trigger( 'change' );
		await wrapper.find( '.wmde-banner-sub-form' ).trigger( 'submit' );

		expect( wrapper.emitted( 'submit' ).length ).toBe( 2 );
		expect( wrapper.emitted( 'submit' )[ 0 ][ 0 ] ).toEqual( {
			changeOfAmount: false,
			newNumericAmount: Number( '22' ),
			upgradeToMonthlyInterval: '0'
		} );
		expect( wrapper.emitted( 'submit' )[ 1 ][ 0 ] ).toEqual( {
			changeOfAmount: false,
			newNumericAmount: Number( '666' ),
			upgradeToMonthlyInterval: monthlyIntervalValue
		} );
	} );

	it( 'should insert the euroAmount into the translations', async () => {
		const wrapper = getWrapper();

		// this simulates the user selecting an amount on the first page, triggering the watcher for the visible amounts
		formModel.selectedAmount.value = '20';
		await nextTick();

		expect( wrapper.find( '.wmde-banner-form-upgrade-notice strong' ).text() ).toContain( '{"amount":"€666"}' );
		expect( wrapper.find( '.wmde-banner-select-group-option-no .wmde-banner-select-group-label' ).text() ).toContain( '{"amount":"€20"}' );
		expect( wrapper.find( '.wmde-banner-select-group-option-yes .wmde-banner-select-group-label' ).text() ).toContain( '{"amount":"€666"}' );
	} );

	it( 'should not change visible amounts when monthly form is the current form', async () => {
		const wrapper = getWrapper();

		// this simulates the user selecting an amount on the first page, triggering the watcher for the visible amounts
		formModel.selectedAmount.value = '20';
		await nextTick();

		wrapper.setProps( { isCurrent: true } );

		// this simulates the submit event handler setting the new amount (in the store)
		formModel.selectedAmount.value = '30';
		await nextTick();

		expect( wrapper.find( '.wmde-banner-form-upgrade-notice strong' ).text() ).toContain( '{"amount":"€666"}' );
		expect( wrapper.find( '.wmde-banner-select-group-option-no .wmde-banner-select-group-label' ).text() ).toContain( '{"amount":"€20"}' );
		expect( wrapper.find( '.wmde-banner-select-group-option-yes .wmde-banner-select-group-label' ).text() ).toContain( '{"amount":"€666"}' );
	} );

	it( 'should reset the error message when going to the previous page', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-sub-form' ).trigger( 'submit' );

		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBe( true );

		await wrapper.find( '.wmde-banner-form-upgrade-back' ).trigger( 'click' );

		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBe( false );
	} );

	it( 'should reset the value when going to the previous page', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-select-group-option-no .wmde-banner-select-group-input' ).trigger( 'change' );
		await wrapper.find( '.wmde-banner-form-upgrade-back' ).trigger( 'click' );

		const options = wrapper.findAll<HTMLInputElement>( '.wmde-banner-select-group-input' );
		expect( options[ 0 ].element.checked ).toBe( false );
		expect( options[ 1 ].element.checked ).toBe( false );
	} );

	it( 'should emit back event', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-form-upgrade-back' ).trigger( 'click' );

		expect( wrapper.emitted( 'previous' ).length ).toBe( 1 );
	} );

	describe( 'tracking events ', function () {

		it( 'should track "Upgrade to monthly" event when user chooses Upgrade to monthly', async function () {
			const wrapper = getWrapper();

			await wrapper.find( '.wmde-banner-select-group-option-yes .wmde-banner-select-group-input' ).trigger( 'change' );
			await wrapper.find( '.wmde-banner-sub-form' ).trigger( 'submit' );

			expect( tracker.hasTrackedEvent( UpgradeToMonthlyEvent.EVENT_NAME ) ).toBe( true );
			expect( tracker.getTrackedEvent( UpgradeToMonthlyEvent.EVENT_NAME ) ).toEqual( new UpgradeToMonthlyEvent( 'upgraded-to-monthly' ) );

		} );

		it( 'should track "Not upgraded to monthly" event when user does not choose Upgrade to monthly', async function () {
			const wrapper = getWrapper();

			await wrapper.find( '.wmde-banner-select-group-option-no .wmde-banner-select-group-input' ).trigger( 'change' );
			await wrapper.find( '.wmde-banner-sub-form' ).trigger( 'submit' );

			expect( tracker.hasTrackedEvent( UpgradeToMonthlyEvent.EVENT_NAME ) ).toBe( true );
			expect( tracker.getTrackedEvent( UpgradeToMonthlyEvent.EVENT_NAME ) ).toEqual( new UpgradeToMonthlyEvent( 'not-upgraded-to-monthly' ) );
		} );

		it( 'sends the FormStepShownEvent to tracker when the form becomes the current form', async () => {
			const wrapper = getWrapper();

			await wrapper.setProps( { isCurrent: true } );

			expect( tracker.hasTrackedEvent( FormStepShownEvent.EVENT_NAME ) ).toBe( true );
			expect( tracker.getTrackedEvent( FormStepShownEvent.EVENT_NAME ) ).toEqual( new FormStepShownEvent( 'UpgradeToMonthlyForm' ) );
		} );
	} );
} );

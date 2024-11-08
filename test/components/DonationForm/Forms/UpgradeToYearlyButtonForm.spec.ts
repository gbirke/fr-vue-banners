import { shallowMount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import UpgradeToYearlyButtonForm from '@src/components/DonationForm/Forms/UpgradeToYearlyButtonForm.vue';
import { FormStepShownEvent } from '@src/tracking/events/FormStepShownEvent';
import { UpgradeToYearlyEvent } from '@src/tracking/events/UpgradeToYearlyEvent';
import { CurrencyEn } from '@src/utils/DynamicContent/formatters/CurrencyEn';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { TrackerSpy } from '@test/fixtures/TrackerSpy';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

document.body.innerHTML = `<div id="app"></div>`;

describe( 'UpgradeToYearlyButtonForm.vue', () => {

	let tracker: TrackerSpy;
	// The model values are in the global scope, and they need to be reset before each test
	beforeEach( () => resetFormModel( formModel ) );

	const getWrapper = (): VueWrapper<any> => {
		tracker = new TrackerSpy();
		return shallowMount( UpgradeToYearlyButtonForm, {
			props: {
				pageIndex: 5555,
				isCurrent: false
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
			},
			attachTo: document.getElementById( 'app' )
		} );
	};

	it( 'should emit "previous" event when back button is clicked', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.previous' ).trigger( 'click' );

		expect( wrapper.emitted( 'previous' ).length ).toBe( 1 );
	} );

	it( 'should emit "submit" event with payload when user wants to donate yearly with different amount', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-form-upgrade-custom' ).trigger( 'click' );

		expect( wrapper.emitted( 'submit' ).length ).toBe( 1 );
		expect( wrapper.emitted( 'submit' )[ 0 ][ 0 ] ).toEqual( { changeOfAmount: true, upgradeToYearlyInterval: '12' } );
	} );

	it( 'should emit "submit" event when user clicks a submit button for an interval', async function () {
		const wrapper = getWrapper();

		await wrapper.find( `button[value="${ Intervals.YEARLY.value }"]` ).trigger( 'click' );

		const emitted = wrapper.emitted( 'submit' );
		expect( emitted.length ).toBe( 1 );
		expect( emitted[ 0 ][ 0 ] ).toEqual( { upgradeToYearlyInterval: '12' } );
	} );

	it( 'should insert the euroAmount into the translations', async () => {
		formModel.selectedAmount.value = '5';
		const wrapper = getWrapper();

		expect( wrapper.find( `button[value="${ Intervals.ONCE.value }"]` ).text() ).toContain( '{"amount":"€5"}' );
		expect( wrapper.find( `button[value="${ Intervals.YEARLY.value }"]` ).text() ).toContain( '{"amount":"€5"}' );
	} );

	it( 'should emit back event', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.previous' ).trigger( 'click' );

		expect( wrapper.emitted( 'previous' ).length ).toBe( 1 );
	} );

	describe( 'tracking events ', function () {

		it( 'should track "Upgrade to yearly" event when user chooses Upgrade to yearly', async function () {
			const wrapper = getWrapper();

			await wrapper.find( `button[value="${ Intervals.YEARLY.value }"]` ).trigger( 'click' );

			expect( tracker.hasTrackedEvent( UpgradeToYearlyEvent.EVENT_NAME ) ).toBe( true );
			expect( tracker.getTrackedEvent( UpgradeToYearlyEvent.EVENT_NAME ) ).toEqual( new UpgradeToYearlyEvent( 'upgraded-to-yearly' ) );

		} );

		it( 'should track "Not upgraded to yearly" event when user does not choose Upgrade to yearly', async function () {
			const wrapper = getWrapper();

			await wrapper.find( `button[value="${ Intervals.ONCE.value }"]` ).trigger( 'click' );

			expect( tracker.hasTrackedEvent( UpgradeToYearlyEvent.EVENT_NAME ) ).toBe( true );
			expect( tracker.getTrackedEvent( UpgradeToYearlyEvent.EVENT_NAME ) ).toEqual( new UpgradeToYearlyEvent( 'not-upgraded-to-yearly' ) );
		} );

		it( 'sends the FormStepShownEvent to tracker when the form becomes the current form', async () => {
			const wrapper = getWrapper();

			await wrapper.setProps( { isCurrent: true } );

			expect( tracker.hasTrackedEvent( FormStepShownEvent.EVENT_NAME ) ).toBe( true );
			expect( tracker.getTrackedEvent( FormStepShownEvent.EVENT_NAME ) ).toEqual( new FormStepShownEvent( 'UpgradeToYearlyForm' ) );
		} );
	} );
} );

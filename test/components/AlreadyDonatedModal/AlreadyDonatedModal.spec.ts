import { mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AlreadyDonatedModal from '@src/components/AlreadyDonatedModal/AlreadyDonatedModal.vue';
import { AlreadyDonatedShownEvent } from '@src/tracking/events/AlreadyDonatedShownEvent';
import { Tracker } from '@src/tracking/Tracker';

describe( 'AlreadyDonatedModal', () => {
	let tracker: Tracker;

	beforeEach( () => {
		tracker = { trackEvent: vi.fn() };
	} );

	const getWrapper = (): VueWrapper<any> => {
		return mount( AlreadyDonatedModal, {
			global: {
				mocks: {
					$translate: ( key: string ) => key
				},
				provide: {
					tracker
				}
			},
			props: {
				isVisible: true
			}
		} );
	};

	it( 'should emit "maybeLater" event when user clicks "maybe later" button', function () {
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-already-donated-button-maybe-later' ).trigger( 'click' );

		expect( wrapper.emitted( 'maybeLater' ).length ).toBe( 1 );
	} );

	it( 'should emit "goAway" event when user clicks "enough for this year" button', function () {
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-already-donated-button-go-away' ).trigger( 'click' );

		expect( wrapper.emitted( 'goAway' ).length ).toBe( 1 );
	} );

	it( 'should emit "hideAlreadyDonatedModal" event when user clicks the X button', function () {
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-already-donated .wmde-banner-close' ).trigger( 'click' );

		expect( wrapper.emitted( 'hideAlreadyDonatedModal' ).length ).toBe( 1 );
	} );

	it( 'should send already donated shown tracking event on first open', async function () {
		const wrapper = getWrapper();

		await wrapper.setProps( { isVisible: true } );
		await wrapper.setProps( { isVisible: false } );
		await wrapper.setProps( { isVisible: true } );

		expect( tracker.trackEvent ).toHaveBeenCalledOnce();
		expect( tracker.trackEvent ).toHaveBeenCalledWith( new AlreadyDonatedShownEvent() );

	} );

} );

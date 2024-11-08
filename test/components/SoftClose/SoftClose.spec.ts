import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ButtonClose from '@src/components/ButtonClose/ButtonClose.vue';
import SoftClose from '@src/components/SoftClose/SoftClose.vue';
import { Timer } from '@src/utils/Timer';
import { TimerSpy } from '@test/fixtures/TimerSpy';
import { TimerStub } from '@test/fixtures/TimerStub';

describe( 'SoftClose', function () {

	beforeEach( () => {
		vi.useFakeTimers();
	} );

	afterEach( () => {
		vi.restoreAllMocks();
	} );

	const getWrapper = ( translate: ( key: string ) => string = ( key: string ) => key, timer: Timer = null ): VueWrapper<any> => {
		return mount( SoftClose, {
			global: {
				mocks: {
					$translate: translate
				},
				provide: {
					timer: timer ?? new TimerStub()
				}
			}
		} );
	};

	it( 'should emit close event when user clicks close button', function () {
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-soft-close-button-close' ).trigger( 'click' );

		expect( wrapper.emitted( 'close' ).length ).toBe( 1 );
	} );

	it( 'should emit maybeLater event when user clicks maybe later button', function () {
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-soft-close-button-maybe-later' ).trigger( 'click' );

		expect( wrapper.emitted( 'maybeLater' ).length ).toBe( 1 );
	} );

	it( 'should display the remaining seconds decremented every second', async () => {
		const translate = ( key: string, templateTags: Record<string, string | number> = {} ): string => {
			return templateTags === undefined ? key : templateTags.seconds?.toString();
		};
		const timer = new TimerSpy();

		const wrapper = getWrapper( translate, timer );

		const seconds = wrapper.find( '.wmde-banner-soft-close-countdown-text-wrapper' );

		expect( seconds.text() ).toBe( '15' );

		await timer.advanceInterval();
		expect( seconds.text() ).toBe( '14' );

		await timer.advanceInterval();
		expect( seconds.text() ).toBe( '13' );

		await timer.advanceInterval();
		expect( seconds.text() ).toBe( '12' );
	} );

	it( 'should emit timeOutClose when the internal countdown is <= 1', async () => {
		const timer = new TimerSpy();
		const wrapper = getWrapper( ( key: string ) => key, timer );

		// The soft close counts down over 15 seconds so we need to keep advancing until it runs out
		for ( let i: number = 0; i < 15; i++ ) {
			await timer.advanceInterval();
		}

		expect( wrapper.emitted( 'timeOutClose' ).length ).toBe( 1 );
	} );

	it( 'should not show the extra close icon', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { showCloseIcon: false } );

		expect( wrapper.classes() ).not.toContain( 'wmde-banner-soft-close-with-close-icon' );
		expect( wrapper.findComponent( ButtonClose ).exists() ).toBeFalsy();
	} );

	it( 'should show the extra close icon', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { showCloseIcon: true } );

		expect( wrapper.classes() ).toContain( 'wmde-banner-soft-close-with-close-icon' );
		expect( wrapper.findComponent( ButtonClose ).exists() ).toBeTruthy();
	} );

	it( 'should emit close event when user clicks close icon', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { showCloseIcon: true } );

		await wrapper.findComponent( ButtonClose ).trigger( 'click' );

		expect( wrapper.emitted( 'close' ).length ).toBe( 1 );
	} );
} );

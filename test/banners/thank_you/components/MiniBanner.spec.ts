import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MiniBanner from '@banners/thank_you/components/MiniBanner.vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';

describe( 'MiniBanner.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( MiniBanner, {
			props: {
				bannerState: BannerStates.Pending,
				showFireworks: true
			},
			global: {
				mocks: {
					$translate: ( key: string ): string => key
				}
			}
		} );
	};

	it( 'shows slider content on small screens', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 750 } );
		const wrapper = getWrapper();

		expect( wrapper.find( '.wmde-banner-mini-slider' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.wmde-banner-mini-text' ).exists() ).toBeFalsy();
	} );

	it( 'shows slider content on big screens', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 751 } );
		const wrapper = getWrapper();

		expect( wrapper.find( '.wmde-banner-mini-text' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.wmde-banner-mini-slider' ).exists() ).toBeFalsy();
	} );

	it( 'shows fireworks', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { showFireworks: true } );

		expect( wrapper.findAll( '.wmde-banner-firework' ).length ).toStrictEqual( 5 );
	} );

	it( 'hides fireworks', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { showFireworks: false } );

		expect( wrapper.findAll( '.wmde-banner-firework' ).length ).toStrictEqual( 0 );
	} );

	it( 'emits showModal events from slider content', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 750 } );
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-info-button' ).trigger( 'click' );
		wrapper.find( '.wmde-banner-button' ).trigger( 'click' );

		expect( wrapper.emitted( 'showModal' ).length ).toStrictEqual( 2 );
	} );

	it( 'emits showModal events from text content', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 751 } );
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-info-button' ).trigger( 'click' );
		wrapper.find( '.wmde-banner-button' ).trigger( 'click' );

		expect( wrapper.emitted( 'showModal' ).length ).toStrictEqual( 2 );
	} );

	it( 'emits close event', () => {
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-close' ).trigger( 'click' );

		expect( wrapper.emitted( 'close' ).length ).toStrictEqual( 1 );
	} );
} );

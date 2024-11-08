import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BannerFooter from '@src/components/Footer/BannerFooter.vue';

describe( 'BannerFooter.vue', () => {

	it( 'hides use of funds link', () => {
		const wrapper = shallowMount( BannerFooter, {
			props: {
				showFundsLink: false
			},
			global: {
				mocks: {
					$translate: ( key: string ) => key
				}
			}
		} );

		expect( wrapper.find( '.wmde-banner-footer-usage' ).exists() ).toBeFalsy();
	} );

	it( 'emits event when use of funds link is clicked', () => {
		const wrapper = shallowMount( BannerFooter, {
			global: {
				mocks: {
					$translate: ( key: string ) => key
				}
			}
		} );

		wrapper.find( '.wmde-banner-footer-usage-link' ).trigger( 'click' );

		expect( wrapper.emitted( 'showFundsModal' ).length ).toBe( 1 );
	} );
} );

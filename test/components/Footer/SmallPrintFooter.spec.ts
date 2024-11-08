import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SmallPrintFooter from '@src/components/Footer/SmallPrintFooter.vue';

describe( 'SmallPrintFooter.vue', () => {

	it( 'hides use of funds link', () => {
		const wrapper = shallowMount( SmallPrintFooter, {
			props: {
				faqPageLink: '',
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
		const wrapper = shallowMount( SmallPrintFooter, {
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

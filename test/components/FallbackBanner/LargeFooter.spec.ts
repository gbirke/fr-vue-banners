import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import LargeFooter from '@src/components/FallbackBanner/LargeFooter.vue';

describe( 'LargeFooter.vue', () => {
	it( 'emits show use of funds event on use of funds link click', async () => {
		const wrapper = mount( LargeFooter, {
			global: {
				mocks: {
					$translate: ( key: string ) => key
				}
			}
		} );

		await wrapper.find( '.wmde-banner-fallback-usage-link' ).trigger( 'click' );

		expect( wrapper.emitted( 'use-of-funds-button-clicked' ).length ).toStrictEqual( 1 );
	} );

	it( 'emits submit event on submit button click', async () => {
		const wrapper = mount( LargeFooter, {
			global: {
				mocks: {
					$translate: ( key: string ) => key
				}
			}
		} );

		await wrapper.find( '.wmde-banner-fallback-button' ).trigger( 'click' );

		expect( wrapper.emitted( 'submit-button-clicked' ).length ).toStrictEqual( 1 );
	} );
} );

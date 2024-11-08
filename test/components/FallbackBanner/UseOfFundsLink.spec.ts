import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UseOfFundsLink from '@src/components/FallbackBanner/UseOfFundsLink.vue';

describe( 'UseOfFundsLink.vue', () => {
	it( 'emits show use of funds event on use of funds link click', async () => {
		const wrapper = mount( UseOfFundsLink, {
			global: {
				mocks: {
					$translate: ( key: string ) => key
				}
			}
		} );

		await wrapper.trigger( 'click' );

		expect( wrapper.emitted( 'button-clicked' ).length ).toStrictEqual( 1 );
	} );
} );

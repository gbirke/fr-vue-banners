import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FallbackButton from '@src/components/FallbackBanner/FallbackButton.vue';

describe( 'FallbackButton.vue', () => {
	it( 'emits event on click', async () => {
		const wrapper = shallowMount( FallbackButton, {
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

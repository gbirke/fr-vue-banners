import { shallowMount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProgressBar from '@banners/thank_you/components/ProgressBar.vue';

describe( 'ProgressBar.vue', () => {

	const getWrapper = ( fillPercentage: number ): VueWrapper<any> => {
		return shallowMount( ProgressBar, {
			props: {
				fillPercentage
			},
			global: {
				mocks: {
					$translate: ( key: string ): string => key
				}
			}
		} );
	};

	it( 'shows the win content', () => {
		const wrapper = getWrapper( 100 );

		expect( wrapper.attributes( 'style' ) ).toStrictEqual( '--wmde-banner-progress-bar-width: 100%;' );
		expect( wrapper.find( '.wmde-banner-progress-bar-fill-text' ).text() ).toStrictEqual( 'progress-bar-inner-text-win' );
	} );

	it( 'shows the lose content', () => {
		const wrapper = getWrapper( 66 );

		expect( wrapper.attributes( 'style' ) ).toStrictEqual( '--wmde-banner-progress-bar-width: 66%;' );
		expect( wrapper.find( '.wmde-banner-progress-bar-fill-text' ).text() ).toStrictEqual( 'progress-bar-inner-text-lose' );
	} );
} );

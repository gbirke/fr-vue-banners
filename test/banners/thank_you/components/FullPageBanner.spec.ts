import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import FullPageBanner from '@banners/thank_you/components/FullPageBanner.vue';
import { Tracker } from '@src/tracking/Tracker';

describe( 'FullPageBanner.vue', () => {
	let tracker: Tracker;

	const getWrapper = (): VueWrapper<any> => {
		tracker = { trackEvent: vi.fn() };
		return mount( FullPageBanner, {
			global: {
				mocks: {
					$translate: ( key: string ): string => key
				},
				provide: {
					subscribeURL: 'SUBSCRIBE URL',
					tracker
				}
			}
		} );
	};

	it( 'emits close event', () => {
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-close' ).trigger( 'click' );

		expect( wrapper.emitted( 'close' ).length ).toStrictEqual( 1 );
	} );
} );

import { mount, VueWrapper } from '@vue/test-utils';
import { describe, test } from 'vitest';
import FallbackBanner from '@banners/desktop/C24_WMDE_Desktop_DE_08/components/FallbackBanner.vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { Tracker } from '@src/tracking/Tracker';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';
import { newDynamicContent } from '@test/banners/dynamicCampaignContent';
import { useOfFundsContent } from '@test/banners/useOfFundsContent';
import { fallbackBannerFeatures, submitFeatures } from '@test/features/FallbackBanner';
import { TimerStub } from '@test/fixtures/TimerStub';
import { TrackerStub } from '@test/fixtures/TrackerStub';

const translator = ( key: string ): string => key;

describe( 'FallbackBanner.vue', () => {
	const getWrapperAtWidth = ( width: number, dynamicContent: DynamicContent = null, tracker: Tracker = null ): VueWrapper<any> => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: width } );
		return mount( FallbackBanner, {
			props: {
				bannerState: BannerStates.Pending,
				useOfFundsContent,
				donationLink: 'https://spenden.wikimedia.de'
			},
			global: {
				mocks: {
					$translate: translator
				},
				provide: {
					translator: { translate: translator },
					dynamicCampaignText: dynamicContent ?? newDynamicContent(),
					tracker: tracker ?? new TrackerStub(),
					timer: new TimerStub()
				}
			}
		} );
	};

	test.each( [
		[ 'showsTheSmallBanner' ],
		[ 'showsTheLargeBanner' ],
		[ 'emitsTheBannerCloseEvent' ],
		[ 'playsTheSlideshowWhenBecomesVisible' ],
		[ 'showsUseOfFundsFromSmallBanner' ],
		[ 'hidesUseOfFundsFromSmallBanner' ],
		[ 'showsUseOfFundsFromLargeBanner' ],
		[ 'hidesUseOfFundsFromLargeBanner' ]
	] )( '%s', async ( testName: string ) => {
		await fallbackBannerFeatures[ testName ]( getWrapperAtWidth );
	} );

	test.each( [
		[ 'submitsFromLargeBanner' ],
		[ 'submitsFromSmallBanner' ]
	] )( '%s', async ( testName: string ) => {
		await submitFeatures[ testName ]( getWrapperAtWidth );
	} );
} );

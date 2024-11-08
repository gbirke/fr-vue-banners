import { mount, VueWrapper } from '@vue/test-utils';
import { describe, test } from 'vitest';
import FallbackBanner from '@banners/english/C24_WMDE_Desktop_EN_03/components/FallbackBanner.vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { Tracker } from '@src/tracking/Tracker';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';
import { Timer } from '@src/utils/Timer';
import { newDynamicContent } from '@test/banners/dynamicCampaignContent';
import { useOfFundsContent } from '@test/banners/useOfFundsContent';
import { dynamicContentFeatures, fallbackBannerFeatures, submitFeatures } from '@test/features/FallbackBanner';
import { TimerStub } from '@test/fixtures/TimerStub';
import { TrackerStub } from '@test/fixtures/TrackerStub';

const translator = ( key: string ): string => key;

describe( 'FallbackBanner.vue', () => {
	const getWrapperAtWidth = ( width: number, dynamicContent: DynamicContent = null, tracker: Tracker = null, timer: Timer = null ): VueWrapper<any> => {
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
					timer: timer ?? new TimerStub()
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
		[ 'showsLiveTimeInLargeBanner' ]
	] )( '%s', async ( testName: string ) => {
		await dynamicContentFeatures[ testName ]( getWrapperAtWidth );
	} );

	test.each( [
		[ 'submitsFromLargeBanner' ],
		[ 'submitsFromSmallBanner' ]
	] )( '%s', async ( testName: string ) => {
		await submitFeatures[ testName ]( getWrapperAtWidth );
	} );
} );

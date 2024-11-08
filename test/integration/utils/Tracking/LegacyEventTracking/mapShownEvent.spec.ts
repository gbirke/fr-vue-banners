import { describe, expect, it } from 'vitest';

import { ShownEvent } from '@src/tracking/events/ShownEvent';
import { mapShownEvent } from '@src/tracking/LegacyEventTracking/mapShownEvent';
import { WMDESizeIssueEvent } from '@src/tracking/WPORG/WMDEBannerSizeIssue';
import { WMDELegacyBannerEvent } from '@src/tracking/WPORG/WMDELegacyBannerEvent';

describe( 'mapShownEvent', () => {
	it( 'maps size issues to legacy SizeIssueEvent', () => {
		const legacyEvent = mapShownEvent( new ShownEvent( 'FallbackBanner' ) );

		expect( legacyEvent ).toStrictEqual( new WMDESizeIssueEvent(
			'fallback-banner-shown',
			{
				bannerHeight: 0,
				viewportWidth: 1024,
				viewportHeight: 768
			},
			1
		) );
	} );

	it( 'maps other reasons to legacy event without tracking', () => {
		const legacyEvent = mapShownEvent( new ShownEvent( 'Page' ) );

		expect( legacyEvent ).toStrictEqual(
			new WMDELegacyBannerEvent( 'untracked-shown-event', 0 )
		);
	} );
} );

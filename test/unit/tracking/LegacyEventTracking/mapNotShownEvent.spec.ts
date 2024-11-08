import { describe, expect, it } from 'vitest';

import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';
import { NotShownEvent } from '@src/tracking/events/NotShownEvent';
import { mapNotShownEvent } from '@src/tracking/LegacyEventTracking/mapNotShownEvent';
import { WMDESizeIssueEvent } from '@src/tracking/WPORG/WMDEBannerSizeIssue';
import { WMDELegacyBannerEvent } from '@src/tracking/WPORG/WMDELegacyBannerEvent';

describe( 'mapNotShownEvent', () => {
	it( 'maps size issues to legacy SizeIssueEvent', () => {
		const legacyEvent = mapNotShownEvent( new NotShownEvent( {
			reason: BannerNotShownReasons.SizeIssue,
			bannerHeight: 700,
			viewportWidth: 1024,
			viewportHeight: 800
		} ) );

		expect( legacyEvent ).toStrictEqual( new WMDESizeIssueEvent(
			'size_issue',
			{
				bannerHeight: 700,
				viewportWidth: 1024,
				viewportHeight: 800
			},
			1
		) );
	} );

	it( 'maps other reasons to legacy event without tracking', () => {
		const legacyEvent = mapNotShownEvent(
			new NotShownEvent( { bannerHeight: 0, viewportHeight: 0, viewportWidth: 0, reason: BannerNotShownReasons.DisallowedNamespace } )
		);

		expect( legacyEvent ).toStrictEqual(
			new WMDELegacyBannerEvent( 'untracked-not-shown-event', 0 )
		);
	} );

} );

import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';
import { NotShownEvent } from '@src/tracking/events/NotShownEvent';
import { WMDESizeIssueEvent } from '@src/tracking/WPORG/WMDEBannerSizeIssue';
import { WMDELegacyBannerEvent } from '@src/tracking/WPORG/WMDELegacyBannerEvent';

/**
 * @deprecated Will be removed when the new tracking schema is implemented
 */
export function mapNotShownEvent( notShownEvent: NotShownEvent ): WMDESizeIssueEvent|WMDELegacyBannerEvent {
	if ( notShownEvent.customData.reason === BannerNotShownReasons.SizeIssue ) {
		return new WMDESizeIssueEvent(
			'size_issue',
			{
				viewportWidth: Number( notShownEvent.customData.viewportWidth ),
				viewportHeight: Number( notShownEvent.customData.viewportHeight ),
				bannerHeight: Number( notShownEvent.customData.bannerHeight )
			},
			1
		);
	}

	// We don't track other "not shown" events, hence the trackingRate of 0
	return new WMDELegacyBannerEvent( 'untracked-not-shown-event', 0 );
}

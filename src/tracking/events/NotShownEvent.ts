import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';
import { TrackingEvent, TrackingFeatureName } from '@src/tracking/TrackingEvent';

export interface NotShownCustomData {
	reason: BannerNotShownReasons;
	bannerHeight: number;
	viewportWidth: number;
	viewportHeight: number;
}

export class NotShownEvent implements TrackingEvent<NotShownCustomData> {
	public static readonly EVENT_NAME = 'not-shown';

	public readonly eventName: string = NotShownEvent.EVENT_NAME;
	public readonly customData: NotShownCustomData;
	public readonly feature: TrackingFeatureName = 'Page';
	public readonly userChoice: string = '';

	public constructor( customData: NotShownCustomData ) {
		this.customData = customData;
	}
}

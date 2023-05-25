import { TrackingEvent, TrackingFeatureName } from '@src/tracking/TrackingEvent';

export class ClickAlreadyDonatedEvent implements TrackingEvent {
	public static readonly EVENT_NAME = 'clicked-already-donated';

	public readonly eventName = ClickAlreadyDonatedEvent.EVENT_NAME;
	public readonly customData: Record<string, string> = {};
	public readonly feature: TrackingFeatureName = 'AlreadyDonatedModal';
	public readonly userChoice: string = '';
}

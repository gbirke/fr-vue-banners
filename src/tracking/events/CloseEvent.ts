import { EventData } from '@src/tracking/EventData';

export class CloseEvent implements EventData {
	eventName: string;
	trackingRate: number;

	constructor( trackingRate = 0.01 ) {
		this.eventName = 'close';
		this.trackingRate = trackingRate;
	}
}
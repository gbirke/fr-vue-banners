import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { NotShownEvent } from '@src/tracking/events/NotShownEvent';
import { ThankYouModalShownEvent } from '@src/tracking/events/ThankYouModalShownEvent';

export default new Map( [
	[ NotShownEvent.EVENT_NAME, 1 ],
	[ CloseEvent.EVENT_NAME, 0.1 ],
	[ ThankYouModalShownEvent.EVENT_NAME, 1 ],
	[ BannerSubmitEvent.EVENT_NAME, 1 ]
] );

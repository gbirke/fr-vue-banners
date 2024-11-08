import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { CustomAmountChangedEvent } from '@src/tracking/events/CustomAmountChangedEvent';
import { FormStepShownEvent } from '@src/tracking/events/FormStepShownEvent';
import { MobileMiniBannerExpandedEvent } from '@src/tracking/events/MobileMiniBannerExpandedEvent';
import { ShownEvent } from '@src/tracking/events/ShownEvent';

export default new Map( [
	[ MobileMiniBannerExpandedEvent.EVENT_NAME, 1 ],
	[ CloseEvent.EVENT_NAME, 0.1 ],
	[ ShownEvent.EVENT_NAME, 1 ],
	[ FormStepShownEvent.EVENT_NAME, 1 ],
	[ CustomAmountChangedEvent.EVENT_NAME, 1 ],
	[ BannerSubmitEvent.EVENT_NAME, 1 ]
] );

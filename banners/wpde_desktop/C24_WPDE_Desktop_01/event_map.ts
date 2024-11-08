import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { CoverTransactionFeesEvent } from '@src/tracking/events/CoverTransactionFeesEvent';
import { CustomAmountChangedEvent } from '@src/tracking/events/CustomAmountChangedEvent';
import { FormStepShownEvent } from '@src/tracking/events/FormStepShownEvent';
import { ShownEvent } from '@src/tracking/events/ShownEvent';

export default new Map( [
	[ CloseEvent.EVENT_NAME, 0.1 ],
	[ ShownEvent.EVENT_NAME, 1 ],
	[ FormStepShownEvent.EVENT_NAME, 1 ],
	[ CustomAmountChangedEvent.EVENT_NAME, 1 ],
	[ BannerSubmitEvent.EVENT_NAME, 1 ],
	[ CoverTransactionFeesEvent.EVENT_NAME, 1 ]
] );

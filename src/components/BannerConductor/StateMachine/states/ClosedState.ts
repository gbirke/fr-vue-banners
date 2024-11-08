import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';
import { Page } from '@src/page/Page';
import { Tracker } from '@src/tracking/Tracker';
import { TrackingEvent } from '@src/tracking/TrackingEvent';
import { ResizeHandler } from '@src/utils/ResizeHandler';
import { Timer } from '@src/utils/Timer';

export class ClosedState extends BannerState {
	public readonly stateName: BannerStates = BannerStates.Closed;
	private readonly _closeEvent: TrackingEvent<void>;
	private _page: Page;
	private _tracker: Tracker;
	private _resizeHandler: ResizeHandler;
	private _timer: Timer;

	public constructor(
		closeEvent: TrackingEvent<void>,
		page: Page,
		tracker: Tracker,
		resizeHandler: ResizeHandler,
		timer: Timer
	) {
		super();
		this._closeEvent = closeEvent;
		this._page = page;
		this._tracker = tracker;
		this._resizeHandler = resizeHandler;
		this._timer = timer;
	}

	public enter(): Promise<any> {
		this._tracker.trackEvent( this._closeEvent );
		this._page
			.unsetAnimated()
			.setSpace( 0 )
			.setCloseCookieIfNecessary( this._closeEvent )
			.removePageEventListeners();
		this._resizeHandler.onClose();
		this._timer.clearAll();
		return Promise.resolve();
	}

	public exit(): Promise<any> {
		throw new Error( 'This state will never be exited' );
	}

}

import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';
import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';
import { Page } from '@src/page/Page';
import { NotShownEvent } from '@src/tracking/events/NotShownEvent';
import { Tracker } from '@src/tracking/Tracker';
import { ResizeHandler } from '@src/utils/ResizeHandler';
import { Timer } from '@src/utils/Timer';

export class NotShownState extends BannerState {
	public readonly stateName: BannerStates = BannerStates.NotShown;
	private readonly _bannerNotShownReason: BannerNotShownReasons;
	private _page: Page;
	private _tracker: Tracker;
	private _resizeHandler: ResizeHandler;
	private _bannerHeight: number;
	private _timer: Timer;

	public constructor(
		bannerNotShownReason: BannerNotShownReasons,
		page: Page,
		tracker: Tracker,
		resizeHandler: ResizeHandler,
		bannerHeight: number,
		timer: Timer
	) {
		super();
		this._bannerNotShownReason = bannerNotShownReason;
		this._page = page;
		this._tracker = tracker;
		this._resizeHandler = resizeHandler;
		this._bannerHeight = bannerHeight;
		this._timer = timer;
	}

	public enter(): Promise<any> {
		this._tracker.trackEvent( new NotShownEvent( {
			reason: this._bannerNotShownReason,
			bannerHeight: this._bannerHeight,
			viewportWidth: window.innerWidth,
			viewportHeight: window.innerHeight
		} ) );
		this._page
			.preventImpressionCountForHiddenBanner()
			.removePageEventListeners();
		this._resizeHandler.onClose();
		this._timer.clearAll();
		return Promise.resolve( true );
	}

	public exit(): Promise<any> {
		throw new Error( 'This state will never be exited' );
	}
}

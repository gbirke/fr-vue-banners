import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';
import { ClosedState } from '@src/components/BannerConductor/StateMachine/states/ClosedState';
import { InitialState } from '@src/components/BannerConductor/StateMachine/states/InitialState';
import { NotShownState } from '@src/components/BannerConductor/StateMachine/states/NotShownState';
import { PendingState } from '@src/components/BannerConductor/StateMachine/states/PendingState';
import { ShowingState } from '@src/components/BannerConductor/StateMachine/states/ShowingState';
import { VisibleState } from '@src/components/BannerConductor/StateMachine/states/VisibleState';
import { BannerConfig } from '@src/domain/BannerConfig';
import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';
import { Page } from '@src/page/Page';
import { Tracker } from '@src/tracking/Tracker';
import { TrackingEvent, TrackingFeatureName } from '@src/tracking/TrackingEvent';
import { ImpressionCount } from '@src/utils/ImpressionCount';
import { ResizeHandler } from '@src/utils/ResizeHandler';
import { Timer } from '@src/utils/Timer';

export class StateFactory {
	private readonly _bannerConfig: BannerConfig;
	private readonly _page: Page;
	private readonly _tracker: Tracker;
	private readonly _resizeHandler: ResizeHandler;
	private readonly _impressionCount: ImpressionCount;
	private readonly _timer: Timer;

	public constructor( bannerConfig: BannerConfig, page: Page, tracker: Tracker, resizeHandler: ResizeHandler, impressionCount: ImpressionCount, timer: Timer ) {
		this._bannerConfig = bannerConfig;
		this._page = page;
		this._tracker = tracker;
		this._resizeHandler = resizeHandler;
		this._impressionCount = impressionCount;
		this._timer = timer;
	}

	public newInitialState(): BannerState {
		return new InitialState();
	}

	public newPendingState( bannerHeight: number ): BannerState {
		return new PendingState( this._page, bannerHeight, this._bannerConfig.delay, this._timer );
	}

	public newNotShownState( bannerNotShownReason: BannerNotShownReasons, bannerHeight: number ): BannerState {
		return new NotShownState( bannerNotShownReason, this._page, this._tracker, this._resizeHandler, bannerHeight, this._timer );
	}

	public newShowingState(): BannerState {
		return new ShowingState( this._page, this._bannerConfig.transitionDuration, this._timer );
	}

	public newVisibleState( shownEventFeature: TrackingFeatureName ): BannerState {
		return new VisibleState( shownEventFeature, this._page, this._impressionCount, this._tracker );
	}

	public newClosedState( closeEvent: TrackingEvent<void> ): BannerState {
		return new ClosedState( closeEvent, this._page, this._tracker, this._resizeHandler, this._timer );
	}
}

export function newStateFactory(
	bannerConfig: BannerConfig,
	page: Page,
	tracker: Tracker,
	resizeHandler: ResizeHandler,
	impressionCount: ImpressionCount,
	timer: Timer
): StateFactory {
	return new StateFactory(
		bannerConfig,
		page,
		tracker,
		resizeHandler,
		impressionCount,
		timer
	);
}

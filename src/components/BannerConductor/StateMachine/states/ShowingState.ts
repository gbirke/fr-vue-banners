import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';
import { Page } from '@src/page/Page';
import { Timer } from '@src/utils/Timer';

export class ShowingState extends BannerState {
	public readonly stateName: BannerStates = BannerStates.Showing;
	private _timer: Timer;
	private _timerId: number;
	private _page: Page;
	private readonly _transitionDuration: number;

	public constructor( page: Page, transitionDuration: number, timer: Timer ) {
		super();
		this._page = page;
		this._transitionDuration = transitionDuration;
		this._timer = timer;

		this.canMoveToStates.push( BannerStates.Visible );
		this.canMoveToStates.push( BannerStates.Closed );
	}

	public enter(): Promise<any> {
		this._page.setAnimated()
			.setTransitionDuration( this._transitionDuration )
			.showBanner();

		return new Promise( ( resolve ) => {
			this._timerId = this._timer.setTimeout( () => resolve( true ), this._transitionDuration );
		} );
	}

	public exit(): Promise<any> {
		this._timer.clearTimeout( this._timerId );
		return Promise.resolve();
	}

	public onResize( space: number ): void {
		this._page.unsetAnimated().setSpace( space );
	}

	public onContentChanged( space: number ): void {
		this._page.unsetAnimated().setSpace( space );
	}
}

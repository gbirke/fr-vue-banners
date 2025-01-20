import { StateMachine } from '@src/domain/StateMachine/StateMachine';
import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';
import { ReactiveProperty } from '@src/domain/StateMachine/ReactiveProperty';

export class BannerStateMachine implements StateMachine<BannerState> {
	public currentState: ReactiveProperty<BannerState>;

	public constructor( stateRef: ReactiveProperty<BannerState> ) {
		this.currentState = stateRef;
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		this.currentState.value.enter( null ).then( ()=>{} );
	}

	public async changeState( state: BannerState ): Promise<any> {
		if ( this.currentState.value.canMoveToStates.includes( state.stateName ) ) {
			await this.currentState.value.exit( state.stateName );
			const lastStateType = this.currentState.value.stateName;
			this.currentState.value = state;
			await state.enter( lastStateType );
		}
	}
}

export function newBannerStateMachine( stateRef: ReactiveProperty<BannerState> ): StateMachine<BannerState> {
	return new BannerStateMachine( stateRef );
}

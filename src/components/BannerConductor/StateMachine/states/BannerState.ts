import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { StateMachineState } from '@src/domain/StateMachine/StateMachineState';

export abstract class BannerState implements StateMachineState<BannerStates> {
	public abstract stateName: BannerStates;
	public canMoveToStates: BannerStates[] = [];

	public abstract enter( lastState: BannerStates ): Promise<any>;

	public abstract exit( nextState: BannerStates ): Promise<any>;

	public onResize?( space: number ): void;

	public onContentChanged?( space: number ): void;
}

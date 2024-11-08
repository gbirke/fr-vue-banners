import { describe, expect, it, vitest } from 'vitest';
import { ref } from 'vue';
import { newBannerStateMachine } from '@src/components/BannerConductor/StateMachine/BannerStateMachine';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';

describe( 'BannerStateMachine', function () {

	it( 'exits current state on change', () => {
		const startState = {
			stateName: BannerStates.Pending,
			canMoveToStates: [ BannerStates.Showing ],
			enter: vitest.fn().mockReturnValue( Promise.resolve( true ) ),
			exit: vitest.fn()
		};
		const nextState = { stateName: BannerStates.Showing, enter: vitest.fn() };

		const stateMachine = newBannerStateMachine( ref<BannerState>( startState as unknown as BannerState ) );

		stateMachine.changeState( nextState as unknown as BannerState );

		expect( startState.exit ).toHaveBeenCalledOnce();
		expect( startState.exit ).toHaveBeenCalledWith( BannerStates.Showing );
	} );

	it( 'enters next state on change', async () => {
		const startState = {
			stateName: BannerStates.Pending,
			canMoveToStates: [ BannerStates.Showing ],
			enter: vitest.fn().mockReturnValue( Promise.resolve( true ) ),
			exit: vitest.fn()
		};
		const nextState = { stateName: BannerStates.Showing, enter: vitest.fn() };

		const currentState = ref<BannerState>( startState as unknown as BannerState );
		const stateMachine = newBannerStateMachine( currentState );

		await stateMachine.changeState( nextState as unknown as BannerState );

		expect( nextState.enter ).toHaveBeenCalledOnce();
		expect( nextState.enter ).toHaveBeenCalledWith( BannerStates.Pending );
		expect( currentState.value ).toEqual( nextState );
	} );

	it( 'does nothing if state cannot move to next state', async () => {
		const startState = {
			stateName: BannerStates.Pending,
			canMoveToStates: [ BannerStates.Closed ],
			enter: vitest.fn().mockReturnValue( Promise.resolve( true ) ),
			exit: vitest.fn()
		};
		const nextState = { stateName: BannerStates.Showing, enter: vitest.fn() };

		const currentState = ref<BannerState>( startState as unknown as BannerState );
		const stateMachine = newBannerStateMachine( currentState );

		await stateMachine.changeState( nextState as unknown as BannerState );

		expect( startState.exit ).not.toHaveBeenCalled();
		expect( nextState.enter ).not.toHaveBeenCalled();
		expect( currentState.value ).toEqual( startState );
	} );
} );

import { shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { useDisplaySwitch } from '@src/components/composables/useDisplaySwitch';

describe( 'useDisplaySwitch', () => {
	const TestComponent = defineComponent( {
		props: {
			minWidth: Number
		},
		setup( props ) {
			return {
				onLargeScreen: useDisplaySwitch( props.minWidth )
			};
		},
		render() {
			return '';
		}
	} );

	it( 'starts with the component adapted to large screen size', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 100 } );

		const wrapper = shallowMount( TestComponent, { props: { minWidth: 99 } } );

		expect( wrapper.vm.onLargeScreen ).toBe( true );

	} );

	it( 'starts with the component adapted to small screen size', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 100 } );

		const wrapper = shallowMount( TestComponent, { props: { minWidth: 100 } } );

		expect( wrapper.vm.onLargeScreen ).toBe( false );

	} );

	it( 'triggers event handler on window resize', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 100 } );

		const wrapper = shallowMount( TestComponent, { props: { minWidth: 100 } } );

		Object.defineProperty( window, 'innerWidth', { value: 101 } );
		window.dispatchEvent( new Event( 'resize' ) );

		expect( wrapper.vm.onLargeScreen ).toBe( true );
	} );

	it( 'adds event handler on mount', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 100 } );
		Object.defineProperty( window, 'addEventListener', { writable: true, configurable: true, value: vi.fn() } );

		shallowMount( TestComponent, { props: { minWidth: 100 } } );

		expect( window.addEventListener ).toHaveBeenCalled();
	} );

	it( 'removes event handler on unmount', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 100 } );
		Object.defineProperty( window, 'removeEventListener', { writable: true, configurable: true, value: vi.fn() } );

		const wrapper = shallowMount( TestComponent, { props: { minWidth: 100 } } );
		wrapper.unmount();

		expect( window.removeEventListener ).toHaveBeenCalled();
	} );
} );

import { onMounted, onUnmounted, ref, Ref } from 'vue';

export function useDisplaySwitch( minWidthForLargeScreen: number ): Ref<boolean> {

	const showComponentForLargeScreen = ref<boolean>( window.innerWidth > minWidthForLargeScreen );

	const onDisplaySwitchResize = (): void => {
		showComponentForLargeScreen.value = window.innerWidth > minWidthForLargeScreen;
	};

	onMounted( () => {
		window.addEventListener( 'resize', onDisplaySwitchResize );

	} );

	onUnmounted( () => {
		window.removeEventListener( 'resize', onDisplaySwitchResize );
	} );

	return showComponentForLargeScreen;
}

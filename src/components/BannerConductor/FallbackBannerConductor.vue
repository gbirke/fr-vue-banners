<template>
	<div ref="bannerRef" class="wmde-banner" :class="[
		{ 't-banner-visible': bannerState.stateName === BannerStates.Visible },
		bannerState.stateName
	]">
		<component
			:is="banner"
			v-bind="bannerProps"
			:bannerState="bannerState.stateName"
			:bannerHeight="bannerRef?.offsetHeight"
			@banner-closed="closeHandler"
			@banner-content-changed="onContentChanged"
			@modal-opened="page.setModalOpened"
			@modal-closed="page.setModalClosed"
		/>
	</div>
</template>

<script setup lang="ts">

import { Page } from '@src/page/Page';
import { inject, nextTick, onMounted, ref, shallowRef } from 'vue';
import { BannerConfig } from '@src/domain/BannerConfig';
import { ResizeHandler } from '@src/utils/ResizeHandler';
import { newStateFactory } from '@src/components/BannerConductor/StateMachine/states/StateFactory';
import { newBannerStateMachine } from '@src/components/BannerConductor/StateMachine/BannerStateMachine';
import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';
import { Vector2 } from '@src/utils/Vector2';
import { ImpressionCount } from '@src/utils/ImpressionCount';
import { Tracker } from '@src/tracking/Tracker';
import { TrackingEvent, TrackingFeatureName } from '@src/tracking/TrackingEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';
import { Timer } from '@src/utils/Timer';
import { BannerCategory } from '@src/components/BannerConductor/BannerCategory';

interface Props {
	page: Page,
	bannerConfig: BannerConfig,
	resizeHandler: ResizeHandler,
	banner: Object,
	fallbackBanner: object,
	minWidthForMainBanner: number,
	bannerProps?: object,
	impressionCount: ImpressionCount,
	bannerCategory: BannerCategory
}

const props = withDefaults( defineProps<Props>(), {
	bannerProps: (): any => ( {} )
} );
const tracker = inject<Tracker>( 'tracker' );
const timer = inject<Timer>( 'timer' );

const banner = shallowRef<Object>( props.banner );
const bannerRef = ref( null );
const stateFactory = newStateFactory( props.bannerConfig, props.page, tracker, props.resizeHandler, props.impressionCount, timer, props.bannerCategory );
const bannerState = ref<BannerState>( stateFactory.newInitialState() );
const stateMachine = newBannerStateMachine( bannerState );

onMounted( async () => {
	await stateMachine.changeState( stateFactory.newPendingState( bannerRef.value.offsetHeight ) );
	let bannerNotShownReason = props.page.getReasonToNotShowBanner( new Vector2( bannerRef.value.offsetWidth, bannerRef.value.offsetHeight ) );
	let shownEventFeature: TrackingFeatureName = 'Page';

	if ( bannerRef.value.offsetWidth < props.minWidthForMainBanner || bannerNotShownReason === BannerNotShownReasons.SizeIssue ) {
		banner.value = props.fallbackBanner;
		await nextTick();
		stateMachine.currentState.value.onResize( bannerRef.value.offsetHeight );
		bannerNotShownReason = props.page.getReasonToNotShowBanner( new Vector2( bannerRef.value.offsetWidth, bannerRef.value.offsetHeight ) );
		shownEventFeature = 'FallbackBanner';
	}

	if ( bannerNotShownReason ) {
		await stateMachine.changeState( stateFactory.newNotShownState( bannerNotShownReason, bannerRef.value.offsetHeight ) );
	} else {
		await stateMachine.changeState( stateFactory.newShowingState() );
		await stateMachine.changeState( stateFactory.newVisibleState( shownEventFeature ) );
	}
} );

props.resizeHandler.onResize( () => stateMachine.currentState.value.onResize( bannerRef.value.offsetHeight ) );
props.page.onPageEventThatShouldHideBanner( () => stateMachine.changeState( stateFactory.newClosedState( new CloseEvent( 'Page', 'page-interaction' ) ) ) );

function onContentChanged(): void {
	// Wait a tick in order to let the content re-render before updating the size
	nextTick( () => {
		stateMachine.currentState.value.onContentChanged( bannerRef.value.offsetHeight );
	} );
}

async function closeHandler( closeEvent: TrackingEvent<void> ): Promise<any> {
	await stateMachine.changeState( stateFactory.newClosedState( closeEvent ) );
}

</script>

<style lang="scss">
/* stylelint-disable selector-id-pattern */
#wmde-banner-app,
#WMDE-Banner-Container {
	position: fixed;
	width: 100%;
	z-index: 1000;
}
.wmde-banner--not-shown,
.wmde-banner--closed {
	display: none;
}
</style>

<template>
	<div
		class="wmde-banner-slider-container"
		@mousedown="stopAutoplay"
		@touchstart="stopAutoplay"
	>
		<div class="wmde-banner-navigation-wrapper">

			<div ref="container" class="keen-slider wmde-banner-slider" :class="sliderPlayingState">
				<slot name="slides" :currentSlide="currentSlide"/>
			</div>

			<a v-if="withNavigation" href="#" class="wmde-banner-slider-navigation-previous" @click.prevent="goToPreviousSlide">
				<slot name="left-icon" class="wmde-banner-slider-icon-left">
					<ChevronLeftIcon :fill="navigationColor"/>
				</slot>
			</a>

			<a v-if="withNavigation" href="#" class="wmde-banner-slider-navigation-next" @click.prevent="goToNextSlide">
				<slot name="right-icon" class="wmde-banner-slider-icon-left">
					<ChevronRightIcon :fill="navigationColor"/>
				</slot>
			</a>
		</div>

		<KeenSliderNavigation
			v-if="withPagination"
			:current-slide="currentSlide"
			:slide-count="slider?.slides.length"
			@goToSlide="goToSlide"
		/>
	</div>

</template>

<script setup lang="ts">
import { KeenSliderOptions, useKeenSlider } from 'keen-slider/vue';
import { inject, onMounted, ref, watch } from 'vue';
import ChevronLeftIcon from '@src/components/Icons/ChevronLeftIcon.vue';
import ChevronRightIcon from '@src/components/Icons/ChevronRightIcon.vue';
import KeenSliderNavigation from '@src/components/Slider/KeenSliderNavigation.vue';
import { Timer } from '@src/utils/Timer';

enum SliderPlayingStates {
	PENDING = 'wmde-banner-slider--pending',
	PLAYING = 'wmde-banner-slider--playing',
	STOPPED = 'wmde-banner-slider--stopped'
}

interface Props {
	interval?: number;
	startDelay?: number;
	withNavigation?: boolean;
	withPagination?: boolean;
	sliderOptions?: KeenSliderOptions;
	play?: boolean;
	navigationColor?: string;
}

const props = withDefaults( defineProps<Props>(), {
	sliderOptions: () => ( {} ),
	interval: 5000,
	startDelay: 0,
	withPagination: true,
	withNavigation: true,
	play: false,
	navigationColor: '#202122'
} );

const emit = defineEmits( [ 'slide-changed' ] );
const sliderPlayingState = ref<SliderPlayingStates>( SliderPlayingStates.PENDING );
const startAnimationTimeout = ref<number>( 0 );
const timer = inject<Timer>( 'timer' );
const timerId = ref<number>( 0 );

const currentSlide = ref<number>( 0 );

const [ container, slider ] = useKeenSlider( {
	...props.sliderOptions,
	initial: 0,
	loop: false,
	slideChanged: ( s ) => {
		currentSlide.value = s.track.details.rel;
		emit( 'slide-changed', currentSlide.value, s.slides.length );
	}
} );

const startAutoplay = (): void => {
	if ( sliderPlayingState.value === SliderPlayingStates.PLAYING ) {
		return;
	}
	startAnimationTimeout.value = timer.setTimeout( () => {
		timerId.value = timer.setInterval( slider.value.next, props.interval );
		sliderPlayingState.value = SliderPlayingStates.PLAYING;
	}, props.startDelay );
};

const stopAutoplay = (): void => {
	timer.clearInterval( timerId.value );
	timer.clearTimeout( startAnimationTimeout.value );
	sliderPlayingState.value = SliderPlayingStates.STOPPED;
};

watch( () => props.play, ( newValue: boolean, oldValue: boolean ) => {
	if ( oldValue === false && newValue === true ) {
		startAutoplay();
	} else if ( oldValue === true && newValue === false ) {
		stopAutoplay();
	}
} );

const goToPreviousSlide = (): void => {
	stopAutoplay();
	slider.value.prev();
};

const goToNextSlide = (): void => {
	stopAutoplay();
	slider.value.next();
};

const goToSlide = ( idx: number ): void => {
	stopAutoplay();
	slider.value.moveToIdx( idx );
};

onMounted( () => {
	emit( 'slide-changed', currentSlide.value, slider.value.slides.length );
} );

</script>

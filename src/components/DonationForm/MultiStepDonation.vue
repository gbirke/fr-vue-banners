<template>
	<div class="wmde-banner-form wmde-banner-form-multi-step keen-slider" ref="container" @click="onClick">
		<div
			v-for="( slotName, idx ) in usedSlotNames"
			:key="idx"
			class="keen-slider__slide wmde-banner-form-page"
			:class="{ 'wmde-banner-form-page--current': currentStepIndex === idx }"
		>
			<slot
				:name="slotName"
				:isCurrent="idx === currentStepIndex"
				:submit="onSubmit"
				:previous="onPrevious"
			/>
		</div>
	</div>
	<form ref="submitFormRef" :action="formAction" class="wmde-banner-submit-form" method="post">
		<SubmitValues />
	</form>
</template>

<script setup lang="ts">

import { computed, inject, nextTick, onMounted, ref, useSlots } from 'vue';
import { useKeenSlider } from 'keen-slider/vue';
import SubmitValues from '@src/components/DonationForm/SubComponents/SubmitValues.vue';
import { StepController } from '@src/components/DonationForm/StepController';
import { PageScroller } from '@src/utils/PageScroller/PageScroller';
import { Tracker } from '@src/tracking/Tracker';
import { TrackingEvent } from '@src/tracking/TrackingEvent';
import { useFormAction } from '@src/components/composables/useFormAction';
import { FormActions } from '@src/domain/FormActions';
import { Timer } from '@src/utils/Timer';

interface Props {
	stepControllers: StepController[];
	pageScroller?: PageScroller;
	formActionOverride?: string;
	// This is to allow the banner to trigger side effects when the form is submitted
	submitCallback?: () => void;
}

const props = withDefaults( defineProps<Props>(), {
	showErrorScrollLink: false,
	formActionOverride: '',
	submitCallback: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
} );
const emit = defineEmits( [ 'formInteraction' ] );

const slots = useSlots();
const usedSlotNames = Object.keys( slots );
const slotNameIndices: Record<string, number> = {};
usedSlotNames.forEach( ( slotName: string, index: number ): void => {
	slotNameIndices[ slotName ] = index;
} );
const tracker = inject<Tracker>( 'tracker' );
const timer = inject<Timer>( 'timer' );
const currentStepIndex = ref<number>( 0 );
const defaultFormAction = useFormAction( inject<FormActions>( 'formActions' ) );
const formAction = computed( (): string => {
	return props.formActionOverride ? props.formActionOverride : defaultFormAction.formAction.value;
} );
const submitFormRef = ref<HTMLFormElement>( null );

const [ container, slider ] = useKeenSlider( {
	initial: 0,
	drag: false,
	loop: false,
	slides: {
		spacing: 15
	}
} );

function onClick(): void {
	// This is so the banner height is adjusted correctly if form errors change it when they appear
	// We wait using setTimeout as nextTick() doesn't work here for some reason
	timer.nextTick( () => {
		emit( 'formInteraction' );
	} );
}

const multistepCallbacks = {
	async goToStep( pageName: string ): Promise<void> {
		const pageIndex = slotNameIndices[ pageName ];
		currentStepIndex.value = pageIndex;
		slider.value.moveToIdx( pageIndex );
	},
	async submit( eventData: TrackingEvent<void> ): Promise<void> {
		tracker.trackEvent( eventData );
		props.submitCallback();
		await nextTick();
		submitFormRef.value.submit();
	}
};

const onSubmit = async ( extraData: Record<string, string> ): Promise<void> => {
	props.pageScroller?.scrollIntoView( '.wmde-banner-form' );
	await props.stepControllers[ currentStepIndex.value ].submit( multistepCallbacks, extraData );
};

const onPrevious = async (): Promise<void> => {
	await props.stepControllers[ currentStepIndex.value ].previous( multistepCallbacks );
};

onMounted( () => {
	// This fixes Keen Slider rendering a little early and not having the correct width
	timer.nextTick( () => slider.value.update() );
} );

</script>

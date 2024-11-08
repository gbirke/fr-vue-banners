<template>

	<KeenSliderSlide :is-current="currentSlide === 0">
		<p><strong>Hi,</strong></p>
		<p>
			vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg! Am
			heutigen {{ currentDayName }}, den {{ liveDateAndTime.currentDate }}, um {{ liveDateAndTime.currentTime }} bitten wir Sie,
			die Unabhängigkeit von Wikipedia zu unterstützen.
		</p>
	</KeenSliderSlide>

	<KeenSliderSlide :is-current="currentSlide === 1">
		<p>
			<AnimatedText :content="'Millionen Menschen nutzen Wikipedia, aber 99&nbsp;% spenden nicht – sie übergehen diesen Aufruf.'"/>
			Die meisten Menschen spenden, weil sie Wikipedia nützlich finden.
		</p>
	</KeenSliderSlide>

	<KeenSliderSlide :is-current="currentSlide === 2">
		<p>
			Die durchschnittliche Spende beträgt 22,49&nbsp;€, doch bereits 5&nbsp;€ helfen uns weiter. Hat Wikipedia
			Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt?
		</p>
	</KeenSliderSlide>

	<KeenSliderSlide :is-current="currentSlide === 3">
		<p>
			Dann entscheiden Sie sich, eine der seltenen Ausnahmen zu sein, und geben Sie etwas zurück.
			<strong> Vielen Dank!</strong>
		</p>
	</KeenSliderSlide>

</template>

<script setup lang="ts">
import { inject, onMounted, watch } from 'vue';
import AnimatedText from '@src/components/AnimatedText/AnimatedText.vue';
import { useLiveDateAndTime } from '@src/components/composables/useLiveDateAndTime';
import KeenSliderSlide from '@src/components/Slider/KeenSliderSlide.vue';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

interface Props {
	playLiveText: boolean;
	currentSlide: number
}

const props = defineProps<Props>();

const {
	currentDayName,
	getCurrentDateAndTime
}: DynamicContent = inject( 'dynamicCampaignText' );

const { liveDateAndTime, startTimer, stopTimer } = useLiveDateAndTime( getCurrentDateAndTime );

watch( () => props.playLiveText, ( shouldPlay: boolean ) => {
	if ( !shouldPlay ) {
		stopTimer();
	}
} );
onMounted( startTimer );

</script>

<template>
	<KeenSliderSlide :is-current="currentSlide === 0">
		<p>
			<InfoIcon/>
			{{ liveDateAndTime.currentDate }}, {{ liveDateAndTime.currentTime }} - An alle, die Wikipedia in
			Deutschland nutzen: Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht
			weg! Am heutigen {{ currentDayName }}, den {{ currentDate }}, bitten wir Sie, die Unabhängigkeit von
			Wikipedia zu unterstützen.
		</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 1">
		<p>
			{{ campaignDaySentence }}
			Insgesamt spenden 99&nbsp;% nichts – sie übergehen diesen Aufruf. Wikipedia wird
			durch Spenden von durchschnittlich 22,49&nbsp;€ finanziert.
		</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 2">
		<p>
			Doch schon mit einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich
			entwickeln. <AnimatedText :content="visitorsVsDonorsSentence"/>
		</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 3">
		<p>Die meisten Menschen spenden, weil sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem
			Jahr Wissen im Wert einer Tasse Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine Minute
			Zeit und geben Sie etwas zurück. Vielen Dank!</p>
	</KeenSliderSlide>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
import AnimatedText from '@src/components/AnimatedText/AnimatedText.vue';
import { useLiveDateAndTime } from '@src/components/composables/useLiveDateAndTime';
import InfoIcon from '@src/components/Icons/InfoIcon.vue';
import KeenSliderSlide from '@src/components/Slider/KeenSliderSlide.vue';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

interface Props {
	currentSlide: number
}

defineProps<Props>();

const {
	getCurrentDateAndTime,
	currentDayName,
	currentDate,
	campaignDaySentence,
	visitorsVsDonorsSentence
}: DynamicContent = inject( 'dynamicCampaignText' );

const { liveDateAndTime, startTimer, stopTimer } = useLiveDateAndTime( getCurrentDateAndTime );
onMounted( startTimer );
onUnmounted( stopTimer );
</script>

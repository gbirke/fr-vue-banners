<template>
	<KeenSliderSlide :is-current="currentSlide === 0">
		<div class="wmde-banner-message-title">
			<InfoIcon fill="#990000" width="21.5" height="21.5" type="italic"/>
			<strong>&nbsp;Wikipedia ist unverkäuflich</strong>
		</div>
		<div class="wmde-banner-message-date">
			<strong>
				{{ liveDateAndTime.currentDate }}, {{ liveDateAndTime.currentTime }} - An alle, die Wikipedia in
				Deutschland nutzen
			</strong>
		</div>
		<p><AnimatedText content="Der US-Wahlkampf ist zunehmend verstörend."/> Superreiche versuchen mit
			Millionensummen, die Wahlentscheidung zu beeinflussen. Fake-News und Manipulationen sind allgegenwärtig,
			auch durch Diktaturen befeuert.
		</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 1">
		<p>
			Das geht uns alle an. Umso sichtbarer wird die Bedeutung von Wikipedia. Wikipedia ist glaubwürdig, weil sie
			neutral und zuverlässig ist. Und finanziell unabhängig.
		</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 2">
		<p>
			Sie ist weder käuflich, noch lässt sie sich zensieren. Daher brauchen wir am heutigen {{ currentDayName }},
			den {{ currentDate }}, Ihre Spende – ganz gleich, ob 5&nbsp;€ oder 50&nbsp;€.
		</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 3">
		<p>
			Jeder Beitrag ist ein wertvolles Zeichen für die Kraft der Vielen – und gegen das viele Geld Einzelner. Vielen
			Dank!
		</p>
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
	currentDayName,
	getCurrentDateAndTime,
	currentDate
} = inject<DynamicContent>( 'dynamicCampaignText' );

const { liveDateAndTime, startTimer, stopTimer } = useLiveDateAndTime( getCurrentDateAndTime );
onMounted( startTimer );
onUnmounted( stopTimer );

</script>

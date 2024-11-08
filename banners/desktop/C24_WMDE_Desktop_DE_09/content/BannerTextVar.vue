<template>
	<div class="wmde-banner-message">
		<div>
			<div class="wmde-banner-message-title">
				<InfoIcon fill="#990000" width="21.5" height="21.5" type="italic"/>
				<strong>&nbsp;Wikipedia ist unverkäuflich</strong>
			</div>
			<div class="wmde-banner-message-date">
				<strong>
					{{ liveDateAndTime.currentDate }}, {{ liveDateAndTime.currentTime }} - An alle, die Wikipedia in Deutschland nutzen
				</strong>
			</div>
			<p><AnimatedText content="Der US-Wahlkampf ist zunehmend verstörend."/> Superreiche versuchen mit
				Millionensummen, die Wahlentscheidung zu beeinflussen. Fake-News und Manipulationen sind allgegenwärtig,
				auch durch Diktaturen befeuert. Das geht uns alle an. Umso sichtbarer wird die Bedeutung von Wikipedia.
				Wikipedia ist glaubwürdig, weil sie neutral und zuverlässig ist. Und finanziell unabhängig. Sie ist weder
				käuflich, noch lässt sie sich zensieren. Daher brauchen wir am heutigen {{ currentDayName }}, den
				{{ currentDate }}, Ihre Spende – ganz gleich, ob 5&nbsp;€ oder 50&nbsp;€. Jeder Beitrag ist ein
				wertvolles Zeichen für die Kraft der Vielen – und gegen das viele Geld Einzelner. Vielen Dank!
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
import AnimatedText from '@src/components/AnimatedText/AnimatedText.vue';
import { useLiveDateAndTime } from '@src/components/composables/useLiveDateAndTime';
import InfoIcon from '@src/components/Icons/InfoIcon.vue';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

const {
	currentDayName,
	getCurrentDateAndTime,
	currentDate
} = inject<DynamicContent>( 'dynamicCampaignText' );

const { liveDateAndTime, startTimer, stopTimer } = useLiveDateAndTime( getCurrentDateAndTime );
onMounted( startTimer );
onUnmounted( stopTimer );

</script>

<template>
	<div class="wmde-banner-message">
		<div>
			<p class="banner-text-title">
				<strong>Hi,</strong>
			</p>
			<p>
				Wikipedia umfasst rund 60 Millionen Artikel in mehr als 330 Sprachen.
				Damit ist sie die größte freie Wissenssammlung in der Geschichte der Menschheit.
				Auch wenn alle Artikel von Freiwilligen geschrieben werden, kostet die technische Infrastruktur viel Geld.
				Genau wie unsere Projekte zur Verbesserung und Weiterentwicklung von Wikipedia & Co.
				Als gemeinnütziger Verein arbeiten wir daran, Wikipedia nicht nur für uns,
				sondern auch für kommende Generationen zu erhalten.
				<AnimatedText :content="'Jedes Jahr spenden weniger als 1&nbsp;% der Nutzenden für Wikipedia.'"/>
				Deshalb bitten wir Sie am heutigen {{ currentDayName }},
				den {{ liveDateAndTime.currentDate }},
				um {{ liveDateAndTime.currentTime }}:
				Unterstützen Sie dieses einzigartige Projekt mit einer Spende.
				<strong>Vielen Dank!</strong>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject, watch } from 'vue';
import AnimatedText from '@src/components/AnimatedText/AnimatedText.vue';
import { useLiveDateAndTime } from '@src/components/composables/useLiveDateAndTime';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

interface Props {
	playLiveText: boolean;
}

const props = defineProps<Props>();

const {
	currentDayName,
	getCurrentDateAndTime
}: DynamicContent = inject( 'dynamicCampaignText' );

const { liveDateAndTime, startTimer, stopTimer } = useLiveDateAndTime( getCurrentDateAndTime );

watch( () => props.playLiveText, ( shouldPlay: boolean ) => {
	if ( shouldPlay ) {
		startTimer();
	} else {
		stopTimer();
	}
} );

</script>
<script setup lang="ts">
</script>

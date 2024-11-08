<template>
	<KeenSliderSlide :is-current="currentSlide === 0" class="wmde-banner-slide-content-with-progress-bar">
		<p>Unser Spendenziel: {{ goalDonationSum }} Millionen Euro</p>
		<ProgressBar amount-to-show-on-right="TARGET"/>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 1">
		<p>
			An alle, die Wikipedia in Deutschland nutzen: Vielleicht kommen wir gerade ungelegen, aber dennoch:
			Klicken Sie jetzt bitte nicht weg! Am heutigen {{ currentDayName }}, den {{ currentDate }}, bitten
			wir Sie bescheiden, die Unabhängigkeit von Wikipedia zu sichern.
		</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 2">
		<p>
			Heute bitten wir Sie um Ihre Unterstützung. Insgesamt spenden 99% nichts – sie übergehen diesen
			Aufruf. Wikipedia wird durch Spenden von durchschnittlich 22,25&nbsp;€ finanziert.
		</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 3">
		<p>
			Doch schon mit einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln.
			<span v-if="visitorsVsDonorsSentence !== ''" class="wmde-banner-text-animated-highlight">{{ visitorsVsDonorsSentence }}</span>
		</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 4">
		<p>
			Die meisten Menschen spenden, weil sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen
			im Wert einer Tasse Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas
			zurück. Vielen Dank!
		</p>
	</KeenSliderSlide>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import ProgressBar from '@src/components/ProgressBar/ProgressBar.vue';
import KeenSliderSlide from '@src/components/Slider/KeenSliderSlide.vue';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

interface Props {
	currentSlide: number
}

defineProps<Props>();

const {
	currentDayName,
	currentDate,
	visitorsVsDonorsSentence,
	goalDonationSum
}: DynamicContent = inject( 'dynamicCampaignText' );
</script>

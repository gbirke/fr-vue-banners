<template>
	<KeenSliderSlide :is-current="currentSlide === 0">
		<p><strong>Lesen Sie unsere Dankesbotschaft</strong></p>
		<slot name="progress"/>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 1">
		<p><strong>Rund {{ numberOfDonors }} Menschen</strong> haben in den letzten Wochen gespendet und Wikipedia ihre Wertschätzung erwiesen.</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 2">
		<HeartIcon/>
		<p>Ihnen allen danken wir von ganzem Herzen!</p>
	</KeenSliderSlide>
</template>

<script setup lang="ts">
import HeartIcon from '@banners/thank_you/components/icons/HeartIcon.vue';
import KeenSliderSlide from '@src/components/Slider/KeenSliderSlide.vue';

interface Props {
	currentSlide: number;
	numberOfDonors: string;
}

defineProps<Props>();

</script>

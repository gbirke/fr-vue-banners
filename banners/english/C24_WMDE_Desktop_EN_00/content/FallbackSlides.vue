<template>
	<KeenSliderSlide :is-current="currentSlide === 0">
		<p>
			Our donation target: €9.7 million
		</p>
		<ProgressBar amount-to-show-on-right="TARGET"/>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 1">
		<p>
			If Wikipedia has given you €5 worth of knowledge this year, please give back.
		</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 2">
		<p>
			If you can, please join the 1% of readers who give. <em>Thank you.</em>
		</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 3">
		<FallbackBank/>
	</KeenSliderSlide>
</template>

<script setup lang="ts">
import FallbackBank from '@src/components/FallbackBanner/FallbackBank.vue';
import ProgressBar from '@src/components/ProgressBar/ProgressBar.vue';
import KeenSliderSlide from '@src/components/Slider/KeenSliderSlide.vue';

interface Props {
	currentSlide: number
}

defineProps<Props>();

</script>

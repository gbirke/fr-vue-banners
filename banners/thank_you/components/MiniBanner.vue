<template>
	<div class="wmde-banner-mini">
		<ButtonClose @close="$emit( 'close' )"/>
		<div class="wmde-banner-mini-inner">
			<button class="wmde-banner-info-button" @click.prevent="$emit( 'showModal' )"><InfoIcon/></button>

			<div class="wmde-banner-mini-text" v-if="showComponentForLargeScreen">

				<slot name="text"/>

				<div class="wmde-banner-mini-text-columns">
					<div class="wmde-banner-mini-text-progress">
						<slot name="progress"/>
					</div>
					<div class="wmde-banner-mini-text-button">
						<button class="wmde-banner-button" @click.prevent="$emit( 'showModal' )">
							{{ $translate( 'open-modal' ) }}
						</button>
					</div>
				</div>

			</div>

			<div class="wmde-banner-mini-slider" v-else>
				<slot name="slides" :play="slideshowShouldPlay"/>
				<button class="wmde-banner-button" @click.prevent="$emit( 'showModal' )">
					{{ $translate( 'open-modal' ) }}
				</button>
			</div>

			<template v-if="showFireworks">
				<div class="wmde-banner-firework wmde-banner-firework-lefter"></div>
				<div class="wmde-banner-firework wmde-banner-firework-left"></div>
				<div class="wmde-banner-firework wmde-banner-firework-center"></div>
				<div class="wmde-banner-firework wmde-banner-firework-right"></div>
				<div class="wmde-banner-firework wmde-banner-firework-righter"></div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">

import { computed, ref } from 'vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import ButtonClose from '@src/components/ButtonClose/ButtonClose.vue';
import { useDisplaySwitch } from '@src/components/composables/useDisplaySwitch';
import InfoIcon from '@src/components/Icons/InfoIcon.vue';

interface Props {
	showFireworks: boolean;
	bannerState: BannerStates;
}

const props = defineProps<Props>();
defineEmits( [ 'close', 'showModal' ] );

const slideShowStopped = ref<boolean>( false );
const slideshowShouldPlay = computed( () => props.bannerState === BannerStates.Visible && !slideShowStopped.value );

const showComponentForLargeScreen = useDisplaySwitch( 750 );

</script>

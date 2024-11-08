<template>
	<div class="wmde-banner-minimised">

		<div class="wmde-banner-minimised-button-group">
			<button class="wmde-banner-minimised-maximise" @click.prevent="$emit( 'maximise' )">Banner vergrößern <ChevronDownIcon fill="#2a4b8d"/></button>
			<ButtonClose @close="$emit( 'close' )"/>
		</div>

		<div class="wmde-banner-minimised-content">
			<div class="wmde-banner-minimised-content-message">
				<MinimisedText/>
			</div>
			<div class="wmde-banner-minimised-content-button">
				<button class="wmde-banner-minimised-submit-button" @click.prevent="$emit( 'maximise-cta' )">
					Jetzt spenden
				</button>
			</div>
		</div>

		<slot name="footer"/>
	</div>
</template>

<script setup lang="ts">
import ButtonClose from '@src/components/ButtonClose/ButtonClose.vue';
import ChevronDownIcon from '@src/components/Icons/ChevronDownIcon.vue';
import MinimisedText from '../content/MinimisedText.vue';
defineEmits( [ 'close', 'maximise', 'maximise-cta' ] );
</script>

<template>
	<div class="wmde-banner-footer">
		<div class="wmde-banner-footer-bank">
			<label class="wmde-banner-footer-bank-item account">{{ $translate( 'donation-account' ) }}:
				<SelectionInput :value="'Wikimedia e. V.'"/>
			</label>
			<label class="wmde-banner-footer-bank-item bic">BIC:
				<SelectionInput :value="'BFSWDE33XXX'"/>
			</label>
			<label class="wmde-banner-footer-bank-item iban">IBAN:
				<SelectionInput
					:value="'DE09 3702 0500 0003 2873 00'"
					:focusedValue="'DE09370205000003287300'"
				/>
			</label>
		</div>

		<div v-if="showFundsLink" class="wmde-banner-footer-usage">
			<div class="wmde-banner-footer-item">
				<a
					id="application-of-funds-link"
					class="wmde-banner-footer-usage-link t-use-of-funds-link"
					@click.prevent="$emit( 'showFundsModal' )"
					:title="$translate( 'use-of-funds-link-description' )"
				>
					{{ $translate( 'use-of-funds-link' ) }}
				</a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import SelectionInput from '@src/components/Footer/SelectionInput.vue';

interface Props {
	showFundsLink?: boolean
}

withDefaults( defineProps<Props>(), {
	showFundsLink: true
} );

defineEmits( [ 'showFundsModal' ] );

</script>

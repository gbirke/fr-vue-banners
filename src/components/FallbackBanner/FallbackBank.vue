<template>
	<label class="wmde-banner-fallback-bank-item account">
		<span class="wmde-banner-fallback-bank-item-label">{{ $translate( 'donation-account' ) }}:</span><SelectionInput :value="'Wikimedia e. V.'"/>
	</label>
	<label class="wmde-banner-fallback-bank-item bic">
		<span class="wmde-banner-fallback-bank-item-label">BIC:</span><SelectionInput :value="'BFSWDE33XXX'"/>
	</label>
	<label class="wmde-banner-fallback-bank-item iban">
		<span class="wmde-banner-fallback-bank-item-label">IBAN:</span>
		<SelectionInput
			:value="'DE09 3702 0500 0003 2873 00'"
			:focusedValue="'DE09370205000003287300'"
		/>
	</label>
</template>

<script setup lang="ts">
import SelectionInput from '@src/components/Footer/SelectionInput.vue';
</script>

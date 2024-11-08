<template>
	<div class="wmde-banner-submit-values">
		<input type="hidden" name="addressType" :value="addressType" />
		<input type="hidden" name="amount" :value="formattedAmountForServer" />
		<input type="hidden" name="interval" :value="interval" />
		<input type="hidden" name="paymentType" :value="paymentMethod" />
	</div>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { useFormModel } from '@src/components/composables/useFormModel';

const { addressType, totalNumericAmount, interval, paymentMethod } = useFormModel();

const formattedAmountForServer = computed( (): number => {
	return parseFloat( totalNumericAmount.value.toFixed( 2 ) ) * 100;
} );

</script>

<template>
	<button
		type="button"
		class="wmde-banner-button secondary wmde-banner-button-membership"
		@click.prevent="$emit( 'submit', url )"
	>
		{{ label }}
	</button>
</template>

<script setup lang="ts">

import { inject } from 'vue';
import { MembershipFormActions } from '../MembershipFormActions';

interface Props {
	label: string;
	extraUrlParameters?: Record<string, string>;
}

const props = withDefaults( defineProps<Props>(), {
	extraUrlParameters: (): any => ( {} )
} );

const formActions = inject<MembershipFormActions>( 'formActions' );
defineEmits( [ 'submit' ] );

const url = formActions.create( props.extraUrlParameters );

</script>

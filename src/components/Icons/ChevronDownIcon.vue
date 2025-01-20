<template>
	<svg viewBox="0 0 20 12" version="1.1" xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
		style="fill-rule: evenodd;clip-rule: evenodd;stroke-linejoin: round;stroke-miterlimit: 2;">
		<g transform="matrix(1,0,0,1,-3,-6)">
			<g transform="matrix(1,0,0,1,7,2)">
				<g id="Chevron-Down" transform="matrix(6.12323e-17,-1,1,6.12323e-17,-4,16)">
					<path d="M0.5,10L10.019,20L11.5,18.333L3.673,10L11.5,1.667L10.019,-0L0.5,10Z"
						style="fill-rule: nonzero;" :style="{ fill }"/>
				</g>
			</g>
		</g>
	</svg>
</template>

<script setup lang="ts">
interface Props {
	fill?: string;
}

withDefaults( defineProps<Props>(), {
	fill: 'rgba( 32, 33, 34, 1 )'
} );

</script>

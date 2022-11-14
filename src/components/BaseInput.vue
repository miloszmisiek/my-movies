<template>
    <div class="mb-3">
        <label v-if="label" class="form-label">{{ label }}</label>
        <input type="text" class="form-control" :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)" v-bind="$attrs" />
    </div>
</template>

<script setup>
defineProps({
    label: {
        type: [String, Boolean],
        default: false,
    },
    modelValue: {
        type: String,
        default: ""
    }
})
</script>
<template>
    <div class="w-full">
        <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
            {{ label }}
        </label>

        <input
            :id="id"
            :type="type"
            :placeholder="placeholder"
            v-model="internalValue"
            :disabled="disabled"
            :class="[
                'w-full p-3 border rounded-lg bg-gray-50 transition outline-none text-gray-900',
                'focus:ring-2 focus:ring-green-600 focus:border-green-600',
                error ? 'border-red-500' : 'border-gray-300',
                disabled ? 'bg-gray-200 cursor-not-allowed' : ''
              ]"
        />

        <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
    </div>
</template>

<script>
export default {
    name: "BaseInput",
    props: {
        modelValue: [String, Number],
        type: { type: String, default: "text" },
        label: { type: String, default: "" },
        placeholder: { type: String, default: "" },
        error: { type: String, default: "" },
        disabled: { type: Boolean, default: false },
        id: { type: String, default: null },
    },
    computed: {
        internalValue: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
};
</script>

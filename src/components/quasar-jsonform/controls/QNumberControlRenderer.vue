<template lang="pug">
div
    q-input(
        ref="input"
        :step="step"
        :id="control.id + '-input'"
        :disable="!control.enabled"
        :placeholder="appliedOptions.placeholder"
        :label="computedLabel"
        :hint="control.description"
        :error="control.errors !== ''"
        :error-message="control.errors"
        :model-value="control.data"
        :clearable="true"
        @update:model-value="onInputChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
        type="number"
        filled
    )
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { isIntegerControl, isNumberControl, rankWith } from '@jsonforms/core';
import type { ControlElement, JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { useQuasarControl } from '../util';

const NUMBER_REGEX_TEST = /^[+-]?\d+$/;

const QNumberControlRenderer = defineComponent({
    name: 'q-integer-control-renderer',
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props) {
        return useQuasarControl(
            useJsonFormsControl(props),
            (value) => value || undefined
        );
    },
    computed: {
        step(): number {
            return this.control.schema?.step || 1;
        },
    },
    methods: {
        onInputChange(value: string) {
            if (NUMBER_REGEX_TEST.test(value)) {
                this.onChange(parseInt(value, 10));
            } else {
                this.onChange(value);
            }
        },
    },
});

export default QNumberControlRenderer;

export const QNumberControlRendererEntry: JsonFormsRendererRegistryEntry = {
    renderer: QNumberControlRenderer,
    tester: rankWith(1, isNumberControl),
};
</script>

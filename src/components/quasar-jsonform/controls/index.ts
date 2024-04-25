import QStringControlRenderer from "./QStringControlRenderer.vue";
import QDateControlRenderer from "./QDateControlRenderer.vue";
import QNumberControlRenderer from "./QNumberControlRenderer.vue";
import { isControl, isDateControl, isNumberControl, rankWith, type JsonFormsRendererRegistryEntry } from "@jsonforms/core";

const QDateControlRendererEntry: JsonFormsRendererRegistryEntry = {
    renderer: QDateControlRenderer,
    tester: rankWith(2, isDateControl),
};

const QNumberControlRendererEntry: JsonFormsRendererRegistryEntry = {
    renderer: QNumberControlRenderer,
    tester: rankWith(1, isNumberControl),
};


export const QStringControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: QStringControlRenderer,
  tester: rankWith(1, isControl),
};

export const ControlsRenderer = [
    QDateControlRendererEntry,
    QNumberControlRendererEntry,
    QStringControlRendererEntry,
];

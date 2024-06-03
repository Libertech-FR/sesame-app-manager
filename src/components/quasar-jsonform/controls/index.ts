import QStringControlRenderer from "./QStringControlRenderer.vue";
import QArrayControlRenderer from "./QArrayControlRenderer.vue";
import QDateControlRenderer from "./QDateControlRenderer.vue";
import QNumberControlRenderer from "./QNumberControlRenderer.vue";
import QPasswordControlRenderer from "./QPasswordControlRenderer.vue";
import { isControl, isDateControl, isNumberControl, isPrimitiveArrayControl, rankWith, type JsonFormsRendererRegistryEntry } from "@jsonforms/core";

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

export const QArrayControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: QArrayControlRenderer,
  tester: rankWith(2, isPrimitiveArrayControl),
};

export const QPasswordControlRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: QPasswordControlRenderer,
  tester: rankWith(2, isControl),
};

export const ControlsRenderer = [
  QDateControlRendererEntry,
  QNumberControlRendererEntry,
  QStringControlRendererEntry,
  QArrayControlRendererEntry,
];

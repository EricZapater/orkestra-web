import type { Directive } from "vue";
import Sortable from "sortablejs";
import type { SortableEvent } from "sortablejs";

interface SortableElement extends HTMLElement {
  _sortable?: Sortable;
}

export const vSortable: Directive = {
  mounted(el: SortableElement, binding) {
    const options = binding.value || {};

    const sortableOptions = {
      animation: 150,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      ...options,
    };

    const sortable = Sortable.create(el, sortableOptions);

    // Store the instance on the element for cleanup
    el._sortable = sortable;
  },

  beforeUnmount(el: SortableElement) {
    // Clean up the sortable instance
    if (el._sortable) {
      el._sortable.destroy();
    }
  },

  updated(el: SortableElement, binding) {
    // Update options if binding value changes
    if (el._sortable && binding.value) {
      const sortable = el._sortable;
      Object.assign(sortable.options, binding.value);
    }
  },
};

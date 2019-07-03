<template lang="pug">
  .datepicker__input(
    @click="toggleDatepicker"
    @keyup.enter.stop.prevent="toggleDatepicker"
    data-qa='datepickerInput'
    :class="inputClass"
    v-text="inputDate ? inputDate : i18n[inputDateType]"
    :tabindex="tabIndex"
  )
</template>

<script>

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    inputDate: {
      type: String,
      default: null,
    },
    inputDateType: {
      type: String,
      default: 'check-in'
    },
    singleDaySelection: {
      type: Boolean,
      default: false,
    },
    toggleDatepicker: {
      type: Function,
      required: true,
    },
    i18n: {
      type: Object,
      required: true,
    },
    showTimePicker: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    inputClass() {
      return {
        'datetimepicker__is-not-expanded': !this.showTimePicker,
        'datepicker__input--is-active': this.isOpen && this.inputDate == null,
        'datepicker__input--single-date': this.singleDaySelection,
      };
    },
    tabIndex() {
      return this.inputDateType === 'check-in' ? 0 : -1;
    }
  },
};
</script>

<style lang="scss">
  .datetimepicker {
    &__is-not-expanded {
      margin-bottom: 0;
    }

    @media screen and (max-width: 479px) {
      &__is-not-expanded {
        border: 1px solid #d7d9e2;
        width: 50%;
      }

      &__is-not-expanded.datepicker__dummy-input--is-active {
        left: 0 !important;
        width: 100% !important;
      }
    }
  }
</style>

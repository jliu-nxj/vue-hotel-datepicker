<template lang="pug">
.dropdown(
    :class="isOpen ? 'is-active' : ''"
    @click="toggleTimeSelectPicker"
)
  .dropdown-trigger
    button.button.dropdown__button(
      aria-haspopup="true"
      aria-controls="dropdown-menu3"
    )
      span(
        v-text="currentTime"
      )
  .dropdown-menu.timeselect__dropdown-menu(
    id="dropdown-menu3"
    role="menu"
    :style="dropDownMenuStyle"
  )
    .dropdown-content
      span.dropdown-item(
        disabled
        value=""
        v-text="defaultText"
        style="display: none;"
      )
      span.dropdown-item(
        v-for="times in timePairs"
        :value="times.value"
        v-text="times.text"
        @click="onTimeChange(times.value)"
      )

</template>

<script>

export default {
  name: 'TimeSelectPicker',

  props: {
    i18n: {
      type: Boolean,
      required: true,
    },
    defaultText: {
      type: String,
      required: true,
    },
    selectedTime: {
      type: String,
      default: null,
    },
    timeIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
      militaryTimes: [
        '00:00',
        '00:30',
        '01:00',
        '01:30',
        '02:00',
        '02:30',
        '03:00',
        '03:30',
        '04:00',
        '04:30',
        '05:00',
        '05:30',
        '06:00',
        '06:30',
        '07:00',
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30',
        '22:00',
        '22:30',
        '23:00',
        '23:30',
      ],
      twelveHourTimes: [
        '12:00 AM',
        '12:30 AM',
        '01:00 AM',
        '01:30 AM',
        '02:00 AM',
        '02:30 AM',
        '03:00 AM',
        '03:30 AM',
        '04:00 AM',
        '04:30 AM',
        '05:00 AM',
        '05:30 AM',
        '06:00 AM',
        '06:30 AM',
        '07:00 AM',
        '07:30 AM',
        '08:00 AM',
        '08:30 AM',
        '09:00 AM',
        '09:30 AM',
        '10:00 AM',
        '10:30 AM',
        '11:00 AM',
        '11:30 AM',
        '12:00 PM',
        '12:30 PM',
        '01:00 PM',
        '01:30 PM',
        '02:00 PM',
        '02:30 PM',
        '03:00 PM',
        '03:30 PM',
        '04:00 PM',
        '04:30 PM',
        '05:00 PM',
        '05:30 PM',
        '06:00 PM',
        '06:30 PM',
        '07:00 PM',
        '07:30 PM',
        '08:00 PM',
        '08:30 PM',
        '09:00 PM',
        '09:30 PM',
        '10:00 PM',
        '10:30 PM',
        '11:00 PM',
        '11:30 PM',
      ],
    };
  },
  methods: {
    onTimeChange(value) {
      this.$emit('time-change', value);
    },
    toggleTimeSelectPicker(){
      this.isOpen = !this.isOpen;
    },
  },
  computed: {
    timePairs() {
      if (this.i18n) {
        return this.militaryTimes.map((time) => (
          {
            value: time,
            text: time
          }
        ));
      } else {
        return this.militaryTimes.map((time, index) => (
          {
            value: time,
            text: this.twelveHourTimes[index]
          }
        ));
      }
    },
    dropDownMenuStyle() {
      let zIndex = 100 - this.timeIndex;
      return `z-index: ${zIndex}`;
    },
    currentTime() {
      if (this.selectedTime !== null) {
        let index;
        for (let i = 0; i < this.timePairs.length; ++i) {
          if (this.timePairs[i].value === this.selectedTime) {
            index = i;
            break;
          }
        }
        return this.timePairs[index].text;
      } else {
        return this.defaultText;
      }
    },
  },
};
</script>

<style scoped lang="scss">
  @import './../../node_modules/bulma/sass/utilities/_all.sass';
  @import './../../node_modules/bulma/sass/components/dropdown.sass';
  @import './../../node_modules/bulma/sass/elements/button.sass';

  .dropdown {
    display: table;
    height: inherit;
    margin: 0 auto;
    width: 70%;

    &-trigger {
      height: 100%;
    }

    &__button {
      font-size: 14px;
      height: 100%;
      width: 100%;
    }

    &-content {
      max-height: 13em;
      overflow: auto;
    }
  }

  .timeselect {
    &__dropdown-menu {
      min-width: 0;
      padding: 0;
      width: 100%;
    }
  }
</style>
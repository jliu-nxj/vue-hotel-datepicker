<template lang='pug'>
  .datepicker__wrapper(
    v-if='show' v-on-click-outside='clickOutside' @blur="clickOutside"
    :class="`${isOpen ? 'datepicker__wrapper--is-active' : ''}` "
  )
    .datepicker__close-button.-hide-on-desktop(v-if='isOpen' @click='hideDatepicker') &plus;
    .datepicker__dummy-wrapper(  :class="`${isOpen ? 'datepicker__dummy-wrapper--is-active' : ''}` ")
      date-input(
        :i18n="formattedi18n"
        :input-date="formatDate(checkIn, checkInTime)"
        :is-open="isOpen"
        :hide-datepicker="hideDatepicker"
        :toggle-datepicker="toggleDatepickerIn"
        :single-day-selection="singleDaySelection"
        :showTimePicker="showTimePicker"
      )
      date-input(
        v-if="!singleDaySelection"
        :i18n="formattedi18n"
        :input-date="formatDate(checkOut, checkOutTime)"
        :is-open="isOpen"
        :hide-datepicker="hideDatepicker"
        :toggle-datepicker="toggleDatepickerOut"
        :single-day-selection="singleDaySelection"
        :showTimePicker="showTimePicker"
      )
    .timeselect__wrapper.hide-desktop-and-tablet(
      v-if="showTimePicker"
      :class="timeselectClass"
    )
      time-select(
        defaultText="Pick up"
        :timeIndex="1"
        :i18n="i18n"
        :selectedTime="checkInTime"
        :timepickerState="timepickerState"
        @time-change="handleTimeIn($event)"
      )
    .timeselect__wrapper.hide-desktop-and-tablet(
      v-if="showTimePicker"
      :class="timeselectClass"
    )
      time-select(
        defaultText="Drop off"
        :timeIndex="2"
        :i18n="i18n"
        :selectedTime="checkOutTime"
        :timepickerState="timepickerState"
        @time-change="handleTimeOut($event)"
      )

    .datepicker( :class='`${ isOpen ? "datepicker--open" : "datepicker--closed" }`')
      .-hide-on-desktop
        .datepicker__dummy-wrapper.datepicker__dummy-wrapper--no-border(
          :class="`${isOpen ? 'datepicker__dummy-wrapper--is-active' : ''}`"
          v-if='isOpen'
        )
          .datepicker__input(
            tabindex="0"
            :class="datepickerDummyWrapperClass"
            @click="toggleDatepickerIn"
            v-text="`${checkIn ? formatDate(checkIn) : formattedi18n['check-in']}`"
            type="button"
          )
          .datepicker__input(
            tabindex="0"
            :class="datepickerDummyWrapperClass"
            @click="toggleDatepickerOut"
            v-text="`${checkOut ? formatDate(checkOut) : formattedi18n['check-out']}`"
            type="button"
          )
      .datepicker__inner
        .datepicker__header
          span.datepicker__month-button.datepicker__month-button--prev.-hide-up-to-tablet(
            @click='renderPreviousMonth'
            @keyup.enter.stop.prevent='renderPreviousMonth'
            :tabindex='isOpen ? 0 : -1'
          )
          span.datepicker__month-button.datepicker__month-button--next.-hide-up-to-tablet(
            @click='renderNextMonth'
            @keyup.enter.stop.prevent='renderNextMonth'
            :tabindex='isOpen ? 0 : -1'
          )
        .datepicker__months(v-if='screenSize == "desktop"')
          div.datepicker__month(v-for='n in [0,1]'  v-bind:key='n')
            p.datepicker__month-name(v-text='getMonth(months[activeMonthIndex+n].days[15].date)')
            .datepicker__week-row.-hide-up-to-tablet
              .datepicker__week-name(v-if='dayNames' v-for='dayName in dayNames' v-text='dayName')
            .square(v-for='day in months[activeMonthIndex+n].days'
              @mouseover='hoveringDate = day.date'
              )
              Day(
                :is-open="isOpen"
                :options="options"
                @day-clicked='handleDayClick($event)'
                :date='day.date'
                :sortedDisabledDates='sortedDisabledDates'
                :nextDisabledDate='nextDisabledDate'
                :activeMonthIndex='activeMonthIndex'
                :hoveringDate='hoveringDate'
                :dayNumber='getDay(day.date)'
                :belongsToThisMonth='day.belongsToThisMonth'
                :checkIn='checkIn'
                :checkOut='checkOut'
              )
        .timeselect__wrapper(
          :class="timeselectClass"
        )
          time-select(
            v-if="showTimePicker"
            defaultText="Pick up"
            :timeIndex="1"
            :i18n="i18n"
            :selectedTime="checkInTime"
            @time-change="handleTimeIn($event)"
          )
        .timeselect__wrapper(
          :class="timeselectClass"
        )
          time-select(
            v-if="showTimePicker"
            defaultText="Drop off"
            :timeIndex="2"
            :i18n="i18n"
            :selectedTime="checkOutTime"
            @time-change="handleTimeOut($event)"
          )
        div(v-if='screenSize !== "desktop" && isOpen')
          .datepicker__week-row
            .datepicker__week-name(
              v-for='dayName in dayNames'
              v-text='dayName'
            )
          .datepicker__months#swiperWrapper
            div.datepicker__month(
              v-for='(a, n) in months'
              v-bind:key='n'
            )
              p.datepicker__month-name(v-text='getMonth(months[n].days[15].date)')
              .datepicker__week-row.-hide-up-to-tablet
                .datepicker__week-name(
                  v-for='dayName in dayNames'
                  v-text='dayName'
                )
              .square(v-for='(day, index) in months[n].days'
                @mouseover='hoveringDate = day.date'
                @focus='hoveringDate = day.date'
                v-bind:key='index'
              )
                Day(
                  :is-open="isOpen"
                  :options="options"
                  @day-clicked='handleDayClick($event)'
                  :date='day.date'
                  :sortedDisabledDates='sortedDisabledDates'
                  :nextDisabledDate='nextDisabledDate'
                  :activeMonthIndex='activeMonthIndex'
                  :hoveringDate='hoveringDate'
                  :dayNumber='getDay(day.date)'
                  :belongsToThisMonth='day.belongsToThisMonth'
                  :checkIn='checkIn'
                  :checkOut='checkOut'
                )
</template>

<script>
  import throttle from 'lodash.throttle';
  import {directive as onClickOutside} from 'vue-on-click-outside';
  import moment from 'moment';

  import Day from './Day.vue';
  import DateInput from './DateInput.vue';
  import TimeSelect from './TimeSelect.vue';
  import Helpers from './helpers.js';

  const defaulti18n = {
    night: 'Night',
    nights: 'Nights',
    locale: 'en',
    'day-names': moment.weekdaysShort(),
  };

  export default {
    name: 'HotelDatePicker',

    directives: {
      'on-click-outside': onClickOutside
    },

    components: {
      Day,
      DateInput,
      TimeSelect,
    },

    props: {
      value: {
        type: String
      },
      startingDateValue: {
        default: null,
        type: Date
      },
      endingDateValue: {
        default: null,
        type: Date
      },
      startTimeValue:{
        default: null,
        type: String
      },
      endTimeValue: {
        default: null,
        type: String,
      },
      format: {
        default: 'YYYY-MM-DD',
        type: String
      },
      startDate: {
        default: function () {
          return new Date();
        },
        type: [Date, String]
      },
      endDate: {
        default: Infinity,
        type: [Date, String, Number]
      },
      firstDayOfWeek: {
        default: 0,
        type: Number
      },
      disabledDates: {
        default: function () {
          return [];
        },
        type: Array
      },
      disabledDaysOfWeek: {
        default: function () {
          return [];
        },
        type: Array
      },
      allowedRanges: {
        default: function () {
          return [];
        },
        type: Array
      },
      hoveringTooltip: {
        default: true,
        type: [Boolean, Function]
      },
      tooltipMessage: {
        default: null,
        type: String
      },
      i18n: {
        default: false,
        type: Boolean
      },
      singleDaySelection: {
        default: false,
        type: Boolean
      },
      closeDatepickerOnClickOutside: {
        default: true,
        type: Boolean,
      },
      showTimePicker: {
        default: false,
        type: Boolean,
      },
      startString: {
        type: String,
        required: true,
      },
      endString: {
        type: String,
        required: true,
      }
    },

    data() {
      return {
        hoveringDate: null,
        checkInClicked: false,
        checkOutClicked: false,
        checkIn: this.startingDateValue,
        checkOut: this.endingDateValue,
        checkInTime: this.startTimeValue,
        checkOutTime: this.endTimeValue,
        months: [],
        preloadedMonthCount: 11,
        activeMonthIndex: 0,
        nextDisabledDate: null,
        show: true,
        isOpen: false,
        xDown: null,
        yDown: null,
        xUp: null,
        yUp: null,
        sortedDisabledDates: null,
        screenSize: this.handleWindowResize(),
        nextText: 'Load more months',
        timepickerState: false,
      };
    },

    computed: {
      dayNames() {
        return moment.weekdaysShort();
      },
      formattedi18n() {
        return {
          ...defaulti18n,
          'check-in': this.startString,
          'check-out': this.endString,
          'day-names': moment.weekdaysShort(),
        };
      },
      options() {
        return {
          ...this.$props,
          i18n: this.formattedi18n
        };
      },
      datepickerDummyWrapperClass() {
        if (this.isOpen) {
          if (!this.showTimePicker) {
            return 'datepicker__dummy-input--is-active datetimepicker__is-not-expanded';
          } else {
            return 'datepicker__dummy-input--is-active';
          }
        } else {
          return '';
        }
      },
      timeselectClass() {
        return {
          'timeselect__wrapper__date-set': this.checkIn || this.checkOut,
        };
      },
    },

    watch: {
      isOpen(value) {
        if (this.screenSize !== 'desktop') {
          const bodyClassList = document.querySelector('body').classList;

          if (value) {
            bodyClassList.add('-overflow-hidden');
            setTimeout(() => {
              let swiperWrapper = document.getElementById('swiperWrapper');
              let monthHeight = document.querySelector('.datepicker__month').offsetHeight;
              swiperWrapper.scrollTop = this.activeMonthIndex * monthHeight;
            },100);
          }
          else {
            bodyClassList.remove('-overflow-hidden');
          }
        }
      },
      checkIn(newDate) {
        this.$emit('check-in-changed', newDate);
      },
      checkOut(newDate) {
        if (this.checkOut !== null && this.checkOut !== null) {
          this.hoveringDate = null;
          this.nextDisabledDate = null;
          this.show = true;
          this.parseDisabledDates();
          this.reRender();
        }
        this.$emit('check-out-changed', newDate);
      },
    },

    methods: {
      ...Helpers,

      formatDate(date, time) {
        let dateTime = '';
        if (date) {
          dateTime = moment(date).format(this.format);
        }
        if (time && this.screenSize === 'desktop') {
          if (this.i18n) {
            dateTime = `${dateTime} ${time}`;
          } else {
            dateTime = `${dateTime} ${moment(time, 'HH:mm').format('hh:mm A')}`;
          }
        }
        return dateTime;
      },

      handleWindowResize() {
        if (window.innerWidth < 480) {
          this.screenSize = 'smartphone';
        }
        else if (window.innerWidth >= 480 && window.innerWidth < 768) {
          this.screenSize = 'tablet';
        }
        else if (window.innerWidth >= 768) {
          this.screenSize = 'desktop';
        }

        return this.screenSize;
      },

      reRender() {
        this.show = false;
        this.$nextTick(() => {
          this.show = true;
        });
      },

      hideDatepicker() {
        this.isOpen = false;
        this.checkInClicked = false;
        this.checkOutClicked = false;
      },

      toggleDatepickerIn() {
        this.checkInClicked = true;
        this.checkOutClicked = false;
        if (!this.isOpen) {
          this.isOpen = true;
          this.timepickerState = false;
        }
      },

      toggleDatepickerOut() {
        this.checkInClicked = false;
        this.checkOutClicked = true;
        if (!this.isOpen) {
          this.isOpen = true;
          this.timepickerState = false;
        }
      },

      clickOutside() {
        if (this.closeDatepickerOnClickOutside) {
          this.hideDatepicker();
        }
      },

      handleDayClick(event) {

        if (this.checkIn == null && this.singleDaySelection == false) {
          if (this.checkOut !== null && event.date < this.checkOut) {
            this.setCheckIn(event.date);
            this.checkInClicked = false;
          }
          else {
            this.setCheckIn(event.date);
            this.setCheckOut(null);
          }
        } else if (this.singleDaySelection == true) {
          this.setCheckIn(event.date);
          this.setCheckOut(event.date);
        }
        else if (this.checkIn !== null && this.checkOut !== null && this.checkInClicked) {
          this.setCheckIn(event.date);
          this.checkInClicked = false;
          if (event.date > this.checkOut) {
            this.setCheckOut(null);
          }
        }
        else if (this.checkIn !== null && this.checkOut !== null && this.checkOutClicked) {
          this.setCheckOut(event.date);
          this.checkOutClicked = false;
        }
        else {
          if (event.date < this.checkIn) {
            this.setCheckIn(event.date);
            this.setCheckOut(null);
          } else {
            this.setCheckOut(event.date);
          }
        }

        this.nextDisabledDate = event.nextDisabledDate;
      },

      handleTimeIn(time) {
        this.checkInTime = time;
        this.$emit('time-in-change', time);
      },

      handleTimeOut(time){
        this.checkOutTime = time;
        this.$emit('time-out-change', time);
      },

      renderPreviousMonth() {
        if (this.activeMonthIndex >= 1) {
          this.activeMonthIndex--;
        }
        else return;
      },

      renderNextMonth: throttle(function throttleRenderNextMonth() {
        if (this.activeMonthIndex < this.months.length - 2) {
          this.activeMonthIndex++;
          return;
        }

        let firstDayOfLastMonth;

        if (this.screenSize !== 'desktop') {
          firstDayOfLastMonth = this.months[this.months.length - 1].days
            .filter((day) => day.belongsToThisMonth === true);
        } else {
          firstDayOfLastMonth = this.months[this.activeMonthIndex + 1].days
            .filter((day) => day.belongsToThisMonth === true);
        }

        if (this.endDate !== Infinity) {
          if (moment(firstDayOfLastMonth[0].date).format('YYYYMM') ==
            moment(new Date(this.endDate)).format('YYYYMM')) {
            return;
          }
        }

        this.createMonth(
          this.getNextMonth(
            firstDayOfLastMonth[0].date
          )
        );

        this.activeMonthIndex++;
      }, 200),

      setCheckIn(date) {
        this.checkIn = date;
        this.activeMonthIndex = date.getMonth() - this.startDate.getMonth();
      },

      setCheckOut(date) {
        this.checkOut = date;
      },

      getDay(date) {
        return moment(date).format('D');
      },

      getMonth(date) {
        return moment(date).format('MMMM YYYY');
      },

      createMonth(date){
        const firstDay = this.getFirstDay(date, this.firstDayOfWeek);
        let month = {
          days: []
        };
        for (let i = 0; i < 42; i++) {
          month.days.push({
            date: this.addDays(firstDay, i),
            belongsToThisMonth: this.addDays(firstDay, i).getMonth() === date.getMonth(),
            isInRange: false,
          });
        }
        this.months.push(month);
      },

      parseDisabledDates() {
        const sortedDates = [];

        for (let i = 0; i < this.disabledDates.length; i++) {
          sortedDates[i] = new Date(this.disabledDates[i]);
        }

        sortedDates.sort((a, b) => a - b);

        this.sortedDisabledDates = sortedDates;
      }
    },
    beforeMount() {
      let currentMonth = new Date(this.startDate);
      this.createMonth(currentMonth);
      for(let i = 0; i < this.preloadedMonthCount; i++){
        let tempNextMonth = this.getNextMonth(currentMonth);
        this.createMonth(tempNextMonth);
        currentMonth = tempNextMonth;
      }
      this.activeMonthIndex = this.checkIn.getMonth() - this.startDate.getMonth();
      if (this.activeMonthIndex < 0) this.activeMonthIndex = 0;
      this.parseDisabledDates();
    },

    mounted() {
      document.addEventListener('touchstart', this.handleTouchStart, false);
      document.addEventListener('touchmove', this.handleTouchMove, false);
      window.addEventListener('resize', this.handleWindowResize);
    },

    destroyed() {
      window.removeEventListener('touchstart', this.handleTouchStart);
      window.removeEventListener('touchmove', this.handleTouchMove);
      window.removeEventListener('resize', this.handleWindowResize);
    },
  };
</script>

<style lang="scss">
    /* =============================================================
     * VARIABLES
     * ============================================================ */
    $white: #fff;
    $black: #000;
    $gray: #424b53;
    $primary-text-color: #35343d;
    $lightest-gray: #f3f5f8;
    $primary-color: #3182cd;
    $medium-gray: #999;
    $light-gray: #d7d9e2;
    $dark-gray: #2d3047;
    $sky-blue: #bee3f8;

    $font-small: 14px;

    $round-circle: 290486px;

    /* =============================================================
     * RESPONSIVE LAYOUT HELPERS
     * ============================================================ */
    $tablet: '(min-width: 480px) and (max-width: 767px)';
    $phone: '(max-width: 479px)';
    $desktop: '(min-width: 768px)';
    $desktop-and-tablet: '(min-width: 480px)';
    $up-to-tablet: '(max-width: 767px)';
    $extra-small-screen: '(max-width: 23em)';

    @mixin focusStyle() {
      &:focus {
        outline: none;
        outline-offset: -10px;
      }
    }

    @mixin device($device-widths) {
      @media screen and #{$device-widths} {
        @content;
      }
    }

    .square {
      width: calc(100% / 7);
      float: left;

      @include device($desktop) {
        cursor: pointer;
      }
    }

    .datepicker__wrapper {
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
    }

    /* =============================================================
     * BASE STYLES
     * ============================================================ */

    .datepicker {
      transition: all 0.2s ease-in-out;
      background-color: $white;
      color: $gray;
      font-size: 16px;
      line-height: 14px;
      left: 0;
      top: 48px;
      position: absolute;
      z-index: 999;
      font-family: 'MontserratLight', 'SourceSans', Arial, sans-serif;
      
      &--closed {
        box-shadow: 0 15px 30px 10px rgba($black, 0);
        max-height: 0;
        overflow: hidden;
      }
      &--open {
        box-shadow: 0 15px 30px 10px rgba($black, .08);
        max-height: 900px;
        @include device($up-to-tablet) {
          box-shadow: none;
          height: 100%;
          left: 0;
          right: 0;
          bottom: 0;
          -webkit-overflow-scrolling: touch !important;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 500;
        }
        @include device($desktop) {
          margin-left: -350px;
          left: 50%;
        }
      }
      &__wrapper {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
        z-index: 500;
        &--is-active {
          z-index: 10000000;
        }
      }
      .timeselect__dropdown-menu:first-of-type {
          z-index: 10000000;
        }
      &__dummy {
        &-input--is-active {
          z-index: 5000;
        }
        &-wrapper {
          background: $white;
          cursor: pointer;
          display: block;
          float: left;
          width: 100%;
          height: 100%;
          border: 1px solid #e5e5e5;
          @include device($phone) {
            border: none;
          }
          &--no-border.datepicker__dummy-wrapper {
            margin-top: 15px;
            border: 0;

            .datepicker__input {
              margin-bottom: 0px;
              width: 50%;
              @include device($tablet) {
                text-align: center;
              }
              @include device($phone) {
                width: 60%;
                position: relative;
                left: 15px;
                word-spacing: 5px;
                text-align: center;
                height: 46px;
                padding-top: 15px;
              }
            }
          }
        }
      }
      &__input {
        color: $primary-text-color;
        padding-left: 10px;
        font-size: inherit;
        float: left;
        line-height: inherit;
        text-align: left;
        text-indent: 5px;
        width: 50%;
        word-spacing: 0px;
        height: 100%;

        @include device($phone) {
          text-indent: 0;
          border: 1px solid $light-gray;
          width: calc(55% + 4px);
        }

        &:last-child {
          background: transparent url('arrow-right-datepicker.regular.svg') no-repeat left center / 8px;
          @include device($phone) {
            background: none;
          }
        }
        &--is-active {
          color: $primary-color;
        }
        &--is-active::placeholder {
          color: $primary-color;
        }
        &--is-active::-moz-placeholder {
          color: $primary-color;
        }
        &--is-active:-ms-input-placeholder {
          color: $primary-color;
        }
        &--is-active:-moz-placeholder {
          color: $primary-color;
        }
        &--single-date:first-child {
          width: 100%;
          background: none;
          text-align: center;
        }
      }
      &__month-day {
        visibility: visible;
        text-align: center;
        margin: 0;
        border: 0;
        height: 40px;
        padding-top: 14px;
        @include focusStyle();
        &--invalid-range {
          background-color: rgba($primary-color, .3);
          color: $lightest-gray;
          cursor: not-allowed;
          position: relative;
        }
        &--invalid {
          color: $lightest-gray;
          cursor: not-allowed;
        }
        &--valid:hover,
        &--allowed-checkout:hover {
          background-color: $white;
          color: $primary-color;
          z-index: 1;
          position: relative;
          box-shadow: 0 0 10px 3px rgba($gray, .4);
        }
        &--disabled {
          opacity: 0.25;
          cursor: not-allowed;
          pointer-events: none;
          position: relative;
        }
        &--selected {
          background-color: $sky-blue;
          color: $black;
          &:hover {
            background-color: $primary-color;
            color: $white;
            z-index: 1;
            position: relative;
            box-shadow: 0 0 10px 3px rgba($gray, .4);
          }
        }
        &--first-day-selected,
        &--last-day-selected {
          background: $primary-color;
          color: $white;
          border-radius: $round-circle;
        }
        &--first-day-selected-background {
          background: $sky-blue;
          color: $white;
          border-radius: 50px 0px 0px 50px;
        }
        &--last-day-selected-background {
          background: $sky-blue;
          color: $white;
          border-radius: 0px 50px 50px 0px;
        }
        &--allowed-checkout {
          color: $medium-gray;
        }
        &--out-of-range {
          color: $black;
          cursor: not-allowed;
          position: relative;
          pointer-events: none;
        }
        &--valid {
          cursor: pointer;
          color: $medium-gray;
        }
        &--hidden {
          opacity: 0.25;
          pointer-events: none;
          color: $white;
        }
      }
      &__month-button {
        background: transparent url('arrow-right.regular.svg') no-repeat center center / 8px;
        cursor: pointer;
        display: inline-block;
        height: 60px;
        width: 60px;
        @include focusStyle();
        &--prev {
          transform: rotateY(180deg);
        }
        &--next {
          float: right;
        }
        &--locked {
          opacity: .2;
          cursor: not-allowed;
          pointer-events: none;
        }
      }
      &__inner {
        padding: 20px;
        float: left;
        @include device($up-to-tablet) {
          padding: 0;
          width: 100%;
        }
      }
      &__months {
        @include device($desktop) {
          width: 650px;
        }
        @include device($up-to-tablet) {
          margin-top: 92px;
          height: calc(100% - 92px);
          position: absolute;
          left: 0;
          top: 30px;
          overflow: scroll;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          &:nth-last-child(1) {
            padding-bottom: 20px;
          }
        }
        &::before {
          background: $light-gray;
          bottom: 0;
          content: '';
          display: block;
          left: 50%;
          position: absolute;
          top: 0;
          width: 1px;
          @include device($up-to-tablet) {
            display: none;
          }
        }
      }

      &__month {
        font-size: 12px;
        float: left;
        width: 50%;
        padding-right: 10px;
        @include device($up-to-tablet) {
          width: 100%;
          padding-right: 0;
          padding-bottom: 60px;
          &:first-child {
            padding-top: 60px;
          }
          &:nth-last-child(1) {
            padding-bottom: 100px;
          }
        }
        @include device($desktop) {
          &:last-of-type {
            padding-right: 0;
            padding-left: 10px;
          }
        }
      }
      &__month-name {
        font-size: 16px;
        font-weight: 500;
        margin: -40px 0 0 0 !important;
        padding-bottom: 17px;
        pointer-events: none;
        text-align: center;
        @include device($up-to-tablet) {
          margin: -25px 0 0 0 !important;
          position: absolute;
          width: 100%;
        }
      }
      &__week-days {
        height: 2em;
        vertical-align: middle;
      }
      &__week-row {
        border-bottom: 5px solid $white;
        height: 38px;
        @include device($up-to-tablet) {
          box-shadow: 0 13px 18px -8px rgba($black, .07);
          height: 25px;
          left: 0;
          top: 120px;
          position: absolute;
          width: 100%;
          background-color: $white;
          z-index: 2;
        }
      }
      &__week-name {
        width: calc(100% / 7);
        float: left;
        font-size: 12px;
        font-weight: 400;
        color: $medium-gray;
        text-align: center;
      }
      &__close-button {
        width: 25px;
        height: 25px;
        background: $primary-color;
        border-radius: 50%;
        color: $white;
        cursor: pointer;
        font-size: 21px;
        font-weight: bold;
        z-index: 10000;
        position: fixed;
        left: 7px;
        top: 5px;
        transform: rotate(45deg);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &__tooltip {
        background-color: $dark-gray;
        border-radius: 2px;
        color: $white;
        font-size: 11px;
        margin-left: 5px;
        margin-top: -22px;
        padding: 5px 10px;
        position: absolute;
        z-index: 50;
        &:after {
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid $dark-gray;
          bottom: -4px;
          content: '';
          left: 50%;
          margin-left: -4px;
          position: absolute;
        }
      }
    }

    .timeselect {
      &__dummy-wrapper {
        position: absolute;
        width: 40%;
        left: 30%;
        @include device($phone) {
          left: 45%;
        }
        @include device($tablet) {
          top: 60px;
          left: 0;
          width: 100%;
        }
      }

      &__wrapper {
        float: left;
        width: 50%;
        margin-top: 10px;

        @include device($phone) {
          display: inline-block;
          position: absolute;
          left: 57%;
          margin: 0;
          height: 46px;
          &:nth-child(even) {
            top: 15px;
          }
          &:nth-child(odd) {
            top: 61px;
          }
        }
        &.hide-desktop-and-tablet {
          &:nth-child(even) {
            top: 0px;
          }
          &:nth-child(odd) {
            top: 50%;
          }
        }

        .timeselect__text {
          display: table;
          margin: 3px auto;
          font-size: 14px;
        }

      }
    }

    // Modifiers

    .-overflow-hidden {
      overflow: hidden;
    }

    .-is-hidden {
      display: none;
    }

    .-hide-up-to-smartphone {
        @include device($phone) {
          display: none;
        }
    }

    .-hide-up-to-tablet {
        @include device($up-to-tablet) {
          display: none;
        }
    }

    .hide-desktop-and-tablet {
      @include device($desktop-and-tablet) {
        display: none;
      }
    }

    .-hide-on-desktop {
      @include device($desktop) {
        display: none;
      }
    }
</style>

<template lang='pug'>
  .datepicker__wrapper(
    v-if='show'
    v-on-click-outside='clickOutside'
    tabindex="0"
    ref="datepick"
    @keyup.esc="hideDatepicker"
    @focus="openDatePicker"
    :class="`${isOpen ? 'datepicker__wrapper--is-active' : ''}` "
  )
    .datepicker__close-button.-hide-on-desktop(v-if='isOpen' @click='hideDatepicker') &plus;
    .datepicker__dummy-wrapper(  :class="`${isOpen ? 'datepicker__dummy-wrapper--is-active' : ''}` ")
      date-input(
        :i18n="formattedi18n"
        :input-date="formatDate(checkIn, checkInTime)"
        :is-open="isOpen"
        :toggle-datepicker="toggleDatepickerIn"
        :single-day-selection="singleDaySelection"
        :showTimePicker="showTimePicker"
      )
      date-input(
        v-if="!singleDaySelection"
        :i18n="formattedi18n"
        :input-date="formatDate(checkOut, checkOutTime)"
        input-date-type="check-out"
        :is-open="isOpen"
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
            :single-day-selection="singleDaySelection"
            type="button"
          )
          .datepicker__input(
            v-if="!singleDaySelection"
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
          )
          span.datepicker__month-button.datepicker__month-button--next.-hide-up-to-tablet(
            @click='renderNextMonth'
            @keyup.enter.stop.prevent='renderNextMonth'
          )
        .datepicker__months(v-if='screenSize == "desktop"')
          div.datepicker__month(v-for='n in [0,1]'  v-bind:key='n')
            p.datepicker__month-name(v-text='getMonth(months[activeMonthIndex+n].days[15].date)')
            .datepicker__week-row.-hide-up-to-tablet
              .datepicker__week-name(v-if='dayNames' v-for='dayName in dayNames' v-text='dayName')
            .square(
              :class="day.belongsToThisMonth ? '' : 'datepicker__no-select'"
              v-for='day in months[activeMonthIndex+n].days'
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
                :checkOut='!singleDaySelection ? checkOut : null'
                :singleDaySelection='singleDaySelection'
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
                  :checkOut='!singleDaySelection ? checkOut : null'
                  :singleDaySelection='singleDaySelection'
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
    name: 'DateTimePicker',

    directives: {
      'on-click-outside': onClickOutside
    },

    components: {
      Day,
      DateInput,
      TimeSelect,
    },

    props: {
      format: {
        default: 'YYYY-MM-DD',
        type: String
      },
      firstSelectableDate: {
        default: function () {
          return new Date();
        },
        type: Date
      },
      startingDateValue: {
        default: null,
        type: Date
      },
      startTimeValue:{
        default: null,
        type: String
      },
      lastSelectableDate: {
        default: Infinity,
        type: [Date, String, Number]
      },
      endingDateValue: {
        default: null,
        type: Date
      },
      endTimeValue: {
        default: null,
        type: String,
      },
      firstDayOfWeek: {
        default: 0,
        type: Number
      },
      minNights: {
        default: 0,
        type: Number
      },
      maxNights: {
        default: null,
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
      singleDaySelection: {
        default: false,
        type: Boolean
      },
      closeDatepickerOnClickOutside: {
        default: true,
        type: Boolean,
      },
      i18n: {
        default: false,
        type: Boolean
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
      },
      autoCloseDatepicker: {
        type: Boolean,
        required: true,
      }
    },

    data() {
      const checkOutDate = this.singleDaySelection ? this.startingDateValue : this.endingDateValue;
      return {
        hoveringDate: null,
        checkInClicked: false,
        checkOutClicked: false,
        checkIn: this.startingDateValue,
        checkOut: checkOutDate,
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
          if (!this.showTimePicker || this.singleDaySelection) {
            return 'datepicker__input--single-date datepicker__dummy-input--is-active datetimepicker__is-not-expanded';
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
          if (!this.showTimePicker) {
            this.reRender();
            this.isOpen = false;
          } else {
            this.isOpen = true;
          }
        }
        this.$emit('check-out-changed', newDate);
      },
      startingDateValue() {
        this.checkIn = this.startingDateValue;
        if (this.singleDaySelection) {
          this.checkOut = this.startingDateValue;
        }
      }
    },

    methods: {
      ...Helpers,

      formatDate(date, time) {
        let dateTime = '';
        if (date) {
          dateTime = moment(date).format(this.format);
        }
        if (time && this.screenSize !== 'smartphone') {
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

      openDatePicker() {
        this.isOpen = true;
      },

      hideDatepicker() {
        this.reRender();
        this.isOpen = false;
        this.checkInClicked = false;
        this.checkOutClicked = false;
      },

      toggleDatepickerIn() {
        this.checkInClicked = true;
        this.checkOutClicked = false;
        this.isOpen = true;
      },

      toggleDatepickerOut() {
        this.checkInClicked = false;
        this.checkOutClicked = true;
        this.isOpen = true;
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
        this.$emit('time-in-changed', time);
      },

      handleTimeOut(time){
        this.checkOutTime = time;
        this.$emit('time-out-changed', time);
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

        if (this.lastSelectableDate !== Infinity) {
          if (moment(firstDayOfLastMonth[0].date).format('YYYYMM') ==
            moment(moment(this.lastSelectableDate).toDate()).format('YYYYMM')) {
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
        this.activeMonthIndex = date.getMonth() - this.firstSelectableDate.getMonth();
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
          sortedDates[i] = moment(this.disabledDates[i]).toDate();
        }

        sortedDates.sort((a, b) => a - b);

        this.sortedDisabledDates = sortedDates;
      }
    },
    beforeMount() {
      let currentMonth = this.firstSelectableDate;
      this.createMonth(currentMonth);
      for(let i = 0; i < this.preloadedMonthCount; i++){
        let tempNextMonth = this.getNextMonth(currentMonth);
        this.createMonth(tempNextMonth);
        currentMonth = tempNextMonth;
      }
      if (this.checkIn) {
        this.activeMonthIndex = this.checkIn.getMonth() - this.firstSelectableDate.getMonth();
      }
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
    $between-tablet-and-desktop: '(min-width: 768px) and (max-width: 1024px)';
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
      float: left;
      width: calc(100% / 7);

      @include device($desktop) {
        cursor: pointer;
      }
    }

    /* =============================================================
     * BASE STYLES
     * ============================================================ */

    .datepicker {
      background-color: $white;
      color: $gray;
      font-family: 'MontserratLight', 'SourceSans', Arial, sans-serif;
      font-size: 16px;
      left: 0;
      line-height: 14px;
      position: absolute;
      top: 48px;
      transition: all 0.2s ease-in-out;
      z-index: 999;

      &--closed {
        box-shadow: 0 15px 30px 10px rgba($black, 0);
        max-height: 0;
        overflow: hidden;
      }

      &--open {
        box-shadow: 0 15px 30px 10px rgba($black, 0.08);
        max-height: 900px;

        @include device($up-to-tablet) {
          bottom: 0;
          box-shadow: none;
          height: 100%;
          left: 0;
          -webkit-overflow-scrolling: touch !important;
          position: fixed;
          right: 0;
          top: 0;
          width: 100%;
          z-index: 500;
        }

        @include device($desktop) {
          left: 50%;
          margin-left: -350px;
        }

        @include device($between-tablet-and-desktop) {
          left: 0;
          margin-left: 0;
        }
      }

      &__no-select {
        pointer-events: none;
      }

      &__wrapper {
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        display: inline-block;
        height: 100%;
        position: relative;
        width: 100%;
        z-index: 500;

        &--is-active {
          z-index: 10000000;
        }
      }

      .timeselect__dropdown-menu:first-of-type {
        z-index: 10000000;
      }

      &__input {
        color: $primary-text-color;
        float: left;
        font-size: inherit;
        font-family: inherit;
        height: 100%;
        line-height: inherit;
        padding-left: 8px;
        text-align: left;
        text-indent: 5px;
        width: 50%;
        word-spacing: 0;

        @media screen and (min-width: 992px) and (max-width: 1200px) {
          padding-left: 2px
        }

        @include device($tablet) {
          border: 1px solid $light-gray;
          padding-left: 2px;
          text-indent: 0;
          width: calc(55% + 4px);
        }

        @include device($phone) {
          border: 1px solid $light-gray;
          padding-left: 10px;
          text-indent: 0;
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
          background: none;
          text-align: left;
          width: 100% !important;
        }
      }

      &__dummy {
        &-input--is-active {
          z-index: 5000;
        }

        &-wrapper {
          cursor: pointer;
          display: block;
          float: left;
          height: 100%;
          width: 100%;

          @include device($phone) {
            border: 0;
          }

          &--no-border.datepicker__dummy-wrapper {
            border: 0;
            margin-top: 15px;

            .datepicker__input {
              margin-bottom: 0;
              width: 50%;

              @include device($phone) {
                height: 46px;
                left: 15px;
                padding-top: 15px;
                position: relative;
                text-align: center;
                width: 60%;
                word-spacing: 5px;
              }

              @include device($tablet) {
                text-align: center;
              }
            }
          }
        }
      }

      &__month-day {
        border: 0;
        height: 40px;
        margin: 0;
        padding-top: 14px;
        text-align: center;
        visibility: visible;

        @include focusStyle();

        &--invalid-range {
          background-color: rgba($primary-color, 0.3);
          color: $lightest-gray;
          cursor: not-allowed;
          position: relative;
        }

        &--invalid {
          color: $lightest-gray;
          cursor: not-allowed;
        }

        &--valid {
          color: $medium-gray;
          cursor: pointer;
        }

        &--allowed-checkout {
          color: $black;
          font-weight: bolder;
          font-size: larger;
        }

        &--valid:hover,
        &--allowed-checkout:hover {
          background-color: $white;
          box-shadow: 0 0 10px 3px rgba($gray, 0.4);
          color: $primary-color;
          position: relative;
          z-index: 1;
        }

        &--disabled {
          cursor: not-allowed;
          opacity: 0.25;
          pointer-events: none;
          position: relative;
        }

        &--selected {
          background-color: $sky-blue;
          color: $black;
        }

        &--first-day-selected,
        &--last-day-selected {
          background: $primary-color;
          border-radius: $round-circle;
          color: $white;
        }

        &--first-day-selected-background {
          background: $sky-blue;
          border-radius: 50px 0 0 50px;
          color: $white;
        }

        &--last-day-selected-background {
          background: $sky-blue;
          border-radius: 0 50px 50px 0;
          color: $white;
        }

        &--out-of-range {
          color: $black;
          cursor: not-allowed;
          pointer-events: none;
          position: relative;
        }

        &--hidden {
          color: $white;
          opacity: 0.25;
          pointer-events: none;
        }

        &:hover {
          background-color: $primary-color;
          box-shadow: 0 0 10px 3px rgba($gray, 0.4);
          color: $white;
          position: relative;
          z-index: 1;
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
          cursor: not-allowed;
          opacity: 0.2;
          pointer-events: none;
        }
      }

      &__inner {
        float: left;
        padding: 20px;

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
          bottom: 0;
          display: flex;
          flex-direction: column;
          height: calc(100% - 92px);
          justify-content: flex-start;
          left: 0;
          margin-top: 92px;
          overflow: scroll;
          position: absolute;
          right: 0;
          top: 30px;

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
        float: left;
        font-size: 12px;
        padding-right: 10px;
        width: 50%;

        @include device($up-to-tablet) {
          padding-bottom: 60px;
          padding-right: 0;
          width: 100%;

          &:first-child {
            padding-top: 60px;
          }

          &:nth-last-child(1) {
            padding-bottom: 100px;
          }
        }

        @include device($desktop) {
          &:last-of-type {
            padding-left: 10px;
            padding-right: 0;
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
          background-color: $white;
          box-shadow: 0 13px 18px -8px rgba($black, 0.07);
          height: 25px;
          left: 0;
          position: absolute;
          top: 120px;
          width: 100%;
          z-index: 2;
        }
      }

      &__week-name {
        color: $medium-gray;
        float: left;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        width: calc(100% / 7);
      }

      &__close-button {
        align-items: center;
        background: $primary-color;
        border-radius: 50%;
        color: $white;
        cursor: pointer;
        display: flex;
        font-size: 21px;
        font-weight: bold;
        height: 25px;
        justify-content: center;
        left: 7px;
        position: fixed;
        top: 5px;
        transform: rotate(45deg);
        width: 25px;
        z-index: 10000;
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

        &::after {
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
        left: 30%;
        position: absolute;
        width: 40%;

        @include device($phone) {
          left: 45%;
        }

        @include device($tablet) {
          left: 0;
          top: 60px;
          width: 100%;
        }
      }

      &__wrapper {
        float: left;
        margin-top: 10px;
        width: 50%;

        @include device($phone) {
          display: inline-block;
          height: 46px;
          left: 57%;
          margin: 0;
          position: absolute;

          &:nth-child(even) {
            top: 15px;
          }

          &:nth-child(odd) {
            top: 61px;
          }
        }

        &.hide-desktop-and-tablet {
          &:nth-child(even) {
            top: 0;
          }

          &:nth-child(odd) {
            top: 50%;
          }
        }

        .timeselect__text {
          display: table;
          font-size: 14px;
          margin: 3px auto;
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

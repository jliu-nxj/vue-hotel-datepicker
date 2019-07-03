<template>
  <div id="app" style="text-align: left; padding: 10vw">
    <div>

      <div class="box">
        <h3>US Hotel Picker</h3>
        <DatePicker
          :minNights="0"
          format="ddd MMMM Do"
          :showTimePicker="true"
          startTimeValue="00:00"
          endTimeValue="00:00"
          start-string="Check-in"
          end-string="Check-out"
          :disabledDates="['2019-07-04', '2019-07-06']"
          :disabledDaysOfWeek="['Monday']"
          @check-in-changed="onCheckInUpdate($event)"
          @check-out-changed="onCheckOutUpdate($event)"
          @time-in-change="onTimeInUpdate($event)"
          @time-out-change="onTimeOutUpdate($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from 'components/DatePicker.vue';

  export default {
    components: {
      DatePicker
    },

    data() {
      return {
        checkIn: null,
        checkOut: null,
        timeIn: null,
        timeOut: null,
      };
    },
    methods: {
      onCheckInUpdate: function(newDate) {
        this.checkIn = newDate;
      },
      onCheckOutUpdate: function(newDate) {
        this.checkOut = newDate;
      },
      onTimeInUpdate: function(newTime) {
        this.timeIn = newTime;
      },
      onTimeOutUpdate: function(newTime) {
        this.timeOut = newTime;
      }
    }
  };

</script>

<style>
  body,
  html {
    font-family: 'MontserratLight', 'SourceSans', Arial, sans-serif;
  }

  .box {
    width: 100%;
  }
</style>

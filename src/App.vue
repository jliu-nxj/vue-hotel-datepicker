<template>
  <div id="app" style="text-align: left; padding: 10vw">
    <div>

      <div class="box">
        <h3>US Hotel Picker</h3>
        <DatePicker
          :minNights="0"
          format="ddd MMMM Do, YYYY"
          v-on:check-in-changed="onCheckInUpdate($event)"
          v-on:check-out-changed="onCheckOutUpdate($event)"
        />
      </div>
      <div class="box">
        <h3>UK Hotel Picker</h3>
        <DatePicker
          :minNights="0"
          format="ddd Do MMMM, YYYY"
          v-on:check-in-changed="onCheckInUpdate($event)"
          v-on:check-out-changed="onCheckOutUpdate($event)"
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
        ptPT: {
          night: 'Noite',
          nights: 'Noites',
          'day-names': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
          'check-in': 'Chegada',
          'check-out': 'Partida',
          'month-names': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        },
        checkIn: null,
        checkOut: null,
      };
    },
    methods: {
      onCheckInUpdate: function(newDate) {
        this.checkIn = newDate;
      },
      onCheckOutUpdate: function(newDate) {
        this.checkOut = newDate;
      }
    }
  };

</script>

<style>
  body,
  html {
    font-family: 'Source Sans Pro', sans-serif;
  }

  .box {
    width: 100%;
  }
</style>

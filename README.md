# date-time-picker
A responsive date range picker for Vue.js that displays the number of nights selected and allow several useful options like custom check-in/check-out rules, localisation support and more.

## Props/Options

### format

- Type: `String`
- Default: `YYYY-MM-DD`

The date format string to display.

### firstSelectableDate

- Type: `Date`
- Default: `new Date()`

The start view date. All the dates before this date will be disabled.

### startingDateValue

- Type: `Date`
- Default: `null`

The initial value of the start date.

### startingTimeValue

- Type: `String`
- Default: `null`

The initial value of the start time.

### lastSelectableDate

- Type: `Date` or `String` or `Number`
- Default: `Infinity`

The end view date. All the dates after this date will be disabled.

### endingDateValue

- Type: `Date`
- Default: `null`

The initial value of the end date.

### endingTimeValue

- Type: `String`
- Default: `null`

The initial value of the end time.

### firstDayOfWeek

- Type: `Number`
- Default: `0`

The first day of the week. Where Sun = 0, Mon = 1, ... Sat = 6.

### minNights

- Type: `Number`
- Default: `0`

Minimum nights required to select a range of dates.

### maxNights

- Type: `Number`
- Default: `null`

Maximum nights required to select a range of dates.

### disabledDates

- Type: `Array`
- Default: `[]`

An array of strings in this format: `YYYY-MM-DD`. All the dates passed to the list will be disabled.

### disabledDaysOfWeek

- Type: `Array`
- Default: `[]`

An array of strings in this format: `['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']`. All the days passed to the list will be disabled.

### allowedRanges
- Type: `Array`
- Default: `[]`

An array of numbers. Example: `[7,10,14]`.
After selecting the start date the calendar will be updated only allowing the checkout 7, 10 or 14 days after.

### hoveringTooltip

- Type: `Boolean` or `Function`
- Default: `true`

Shows a tooltip with the number of nights when hovering a date.

### tooltipMessage

- Type: `String`
- Default `null`

If provided, it will override the default tooltip "X nights" with the text provided. You can use HTML in the string.

## singleDaySelection

- Type `boolean`
- Default `false`

## closeDatepickerOnClickOutside
- Type: `boolean`
- Default: `true`

### i18n

- Type: `Boolean`
- Default: `false`

If true, will return 24 Hour Time rather than 12 Hour Time with AM/PM.

## showTimePicker
- Type: `Boolean`
- Default: `false`

Shows the time select picker when true.

## startString
- Type: `String`
- Required: `true`

Will show this string in the checkIn box by default when `startingDateValue` is empty/null.

## endString
- Type: `String`
- Required: `true`

Will show this string in the checkOut box by default when `endingDateValue` is empty/null.

# autoCloseDatepicker
- Type: `Boolean`
- Required: `true`

Boolean that is used to either close datepicker on endDate selection or leave it open (to allow for time select)


## API
⚠️ In order to open/close the datepicker from an external element, such as a button make sure to set `closeDatepickerOnClickOutside` to false

### hideDatepicker()

Hide datepicker

### showDatepicker()

Show datepicker

### toggleDatepicker()

Toggle datepicker

## Events

### check-in-changed
Emitted every time a new check in date is selected with the new date as payload

### check-out-changed
Emitted every time a new check out date is selected with the new date as payload

### time-in-changed
Emitted every time a new time in value is selected with the new time string as payload

### time-out-changed
Emitted every time a new time out value is selected with the new time string as payload

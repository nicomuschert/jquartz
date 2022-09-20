# jquartz
A JQuery module to create expressions for Quartz Scheduler


## Usage
```html
<input value="20 10 8 ? 5 THU#2 *" />
<input value="Hi!" data-jquartz-periods="daily,weekly,monthly" />
<input value="Hi!" data-jquartz-ui="my-ui" />
<div id="my-ui"></div>
```

```js
var input = $('input[type="text"]') // find inputs (0..*)
	.jQuartz(/* {ui: 'my-ui', periods: ['daily', 'hourly']} */)
	.on('change', function () {
      console.log('Quartz string: ' + $(this).val())
    });
```

Options can be passed at initialization or via data-attribute.
* `ui` The UI will be rendered to this Element.
* `periods` Displayed form types. Respects the sort order.
	* Default: `['yearly', 'monthly', 'weekly', 'daily', 'hourly', 'minutes', 'seconds']`
* `data-jquartz-ui` Same as `ui` but expects the ID string.
* `data-jquartz-periods` Same as `period` but a comma separated string.


## Limitations
It is only possible to restore values which are in formats supported by the given period-forms.

Please test the range of functions you need. Don't rely on the fact that I did everything right.

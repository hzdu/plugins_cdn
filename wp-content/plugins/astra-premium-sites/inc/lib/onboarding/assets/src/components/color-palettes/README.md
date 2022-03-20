## How to use?

```js
<ColorPalettes
    selected={3}
    options={[
        {
            'primary-color': '#3a3a3a',
            'secondary-color': '#0274be',
            'heading-color': '#5c95ff',
            'text-color': '#0274be',
            'extra-1': '#3a3a3a',
        },
        {
            'primary-color': 'red',
            'secondary-color': 'green',
            'heading-color': 'blue',
            'text-color': 'orange',
            'extra-1': 'yello',
        }
    ]}
    onChange={(palette, paletteIndex) => {
        // Code goes here..
    }}
/>
```
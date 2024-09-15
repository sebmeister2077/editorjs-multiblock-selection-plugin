example

```ts
class ExtendedUnderline extends Underline {
    constructor(props) {
        super(props)

        window.addEventListener(MultiBlockSelectionPlugin.SELECTION_EVENT_NAME, (ev) => {
            queueMicrotask(() => {
                this.selectedBlocks = ev.detail.selectedBlocks.slice()
            })
        })
    }

    surround(el) {
        if (this.selectedBlocks.length) {
            // apply style to all other selected blocks and gracefully save the data
            // on each block if the TOOL used permits this..
        }
    }
}
```

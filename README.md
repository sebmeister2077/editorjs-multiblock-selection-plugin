example

```ts
// pass this class to the tools config for the editor
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
            //otherwise you'll have to find other ways of saving this data :D
        }
    }
}
```

And also add the global listener for block selections

```ts
const blockSelection = new MultiBlockSelectionPlugin({ editor })
editor.isReady.then(() => {
    blockSelection.listen()
})
```

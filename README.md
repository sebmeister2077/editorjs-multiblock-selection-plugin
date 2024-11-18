To get started you'll have to add the MultiBlockSelectionPlugin and the listen to any changes after the editor is initialized. Internal implementation might not work on some editor versions.

```ts
import EditorJS from '@editorjs/editorjs'
import MultiBlockSelectionPlugin from 'editorjs-multiblock-selection-plugin'

// ... create your editor with config ...

const blockSelection = new MultiBlockSelectionPlugin({ editor, version: EditorJS.version })
editor.isReady.then(() => {
    blockSelection.listen()
})
```

You can find tool examples in the /examples folder

## Working versions of EditorJS

-   v2.20 to v2.30.7 have been verified to work

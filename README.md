To get started you'll have to add the MultiBlockSelectionPlugin and the listen to any changes after the editor is initialized. Internal implementation might not work on some editor versions.

```ts
import EditorJS from '@editorjs/editorjs';
import getMultiBlockSelectionPluginForVersion from 'editorjs-multiblock-selection-plugin'

const MultiBlockSelectionPlugin = getMultiBlockSelectionPluginForVersion(EditorJS.version)
const blockSelection = new MultiBlockSelectionPlugin({ editor })
editor.isReady.then(() => {
    blockSelection.listen()
})
```

You can find tool examples in the /examples folder


## Working versions of EditorJS
- v2.20 to v2.30.7 have been verified to work


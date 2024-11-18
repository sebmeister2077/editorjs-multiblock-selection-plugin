const MultiBlockSelectionPlugin = getMultiBlockSelectionPluginForVersion(EditorJS.version)

// Editor v2.21-v2.30

// declare selected blocks outside of class + event listener
let selectedBlocks = []
window.addEventListener(MultiBlockSelectionPlugin.SELECTION_EVENT_NAME, (ev) => {
    selectedBlocks = ev.detail.selectedBlocks.slice()
})
//@editorjs/underline
class ExtendedUnderline extends Underline {
    elementTagName = 'u'

    surround(range) {
        if (!selectedBlocks.length) {
            super.surround(range)
            return
        }
        let isAppliedOnAllSelectedBlocks = true
        selectedBlocks.forEach(({ blockId, index }) => {
            const el = document.querySelector(`.codex-editor__redactor .ce-block:nth-child(${index + 1})`)
            if (!(el instanceof HTMLElement)) return

            const textEl = el.querySelector('[contenteditable=true]')
            if (!(textEl instanceof HTMLElement)) return
            const allText = el.textContent

            const firstBoldEl = textEl.querySelector(this.elementTagName)
            const isAppliedOnCurrentBlock = firstBoldEl && firstBoldEl.textContent == allText

            if (isAppliedOnCurrentBlock) return
            isAppliedOnAllSelectedBlocks = false
        })

        selectedBlocks.forEach(({ blockId, index }) => {
            const block = this.api.blocks.getById(blockId)
            if (!block) return

            const el = block.holder
            if (!(el instanceof HTMLElement)) return

            const textEl = el.querySelector('[contenteditable=true]')
            if (!(textEl instanceof HTMLElement)) return
            const allText = el.textContent

            const firstUnderlineEl = textEl.querySelector(this.elementTagName)
            const isAppliedOnCurrentBlock = firstUnderlineEl && firstUnderlineEl.textContent == allText
            const shouldRemove = isAppliedOnAllSelectedBlocks
            const shouldAdd = !isAppliedOnAllSelectedBlocks && !isAppliedOnCurrentBlock

            if (shouldRemove) {
                textEl.querySelectorAll(this.elementTagName).forEach((b) => b.replaceWith(...b.childNodes))
                block.dispatchChange()
                return
            }

            if (!shouldAdd) return

            textEl.querySelectorAll(this.elementTagName).forEach((b) => b.replaceWith(...b.childNodes))

            const newUnderline = document.createElement(this.elementTagName)
            newUnderline.append(...textEl.childNodes)

            textEl.replaceChildren(newUnderline)
            block.dispatchChange()
        })
    }
}

// Editor v2.20

class ExtendedUnderline extends Underline {
    elementTagName = 'u'

    surround(range) {
        if (!selectedBlocks.length) {
            super.surround(range)
            return
        }
        let isAppliedOnAllSelectedBlocks = true
        selectedBlocks.forEach(({ index }) => {
            const el = document.querySelector(`.codex-editor__redactor .ce-block:nth-child(${index + 1})`)
            if (!(el instanceof HTMLElement)) return

            const textEl = el.querySelector('[contenteditable=true]')
            if (!(textEl instanceof HTMLElement)) return
            const allText = el.textContent

            const firstBoldEl = textEl.querySelector('u')
            const isAppliedOnCurrentBlock = firstBoldEl && firstBoldEl.textContent == allText

            if (isAppliedOnCurrentBlock) return
            isAppliedOnAllSelectedBlocks = false
        })

        selectedBlocks.forEach(({ index }) => {
            const block = this.api.blocks.getBlockByIndex(index)
            if (!block) return

            const el = block.holder
            if (!(el instanceof HTMLElement)) return

            const textEl = el.querySelector('[contenteditable=true]')
            if (!(textEl instanceof HTMLElement)) return
            const allText = el.textContent

            const firstUnderlineEl = textEl.querySelector('u')
            const isAppliedOnCurrentBlock = firstUnderlineEl && firstUnderlineEl.textContent == allText
            const shouldRemove = isAppliedOnAllSelectedBlocks
            const shouldAdd = !isAppliedOnAllSelectedBlocks && !isAppliedOnCurrentBlock

            if (shouldRemove) {
                textEl.querySelectorAll('u').forEach((b) => b.replaceWith(...b.childNodes))
                block.dispatchChange()
                return
            }

            if (!shouldAdd) return

            textEl.querySelectorAll('u').forEach((b) => b.replaceWith(...b.childNodes))

            const newUnderline = document.createElement('u')
            newUnderline.append(...textEl.childNodes)

            textEl.replaceChildren(newUnderline)
            block.dispatchChange()
        })
    }
}

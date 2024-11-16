class ExtendedUnderline extends Underline {
    elementTagName = 'u'
    constructor(props) {
        super(props)

        this.selectedBlocks = []
        window.addEventListener(MultiBlockSelectionPlugin.SELECTION_EVENT_NAME, (ev) => {
            queueMicrotask(() => {
                this.selectedBlocks = ev.detail.selectedBlocks.slice()
            })
        })
    }

    surround(range) {
        if (!(range instanceof Range)) return
        if (!this.selectedBlocks.length) {
            super.surround(range)
            return
        }
        let isAppliedOnAllSelectedBlocks = true
        this.selectedBlocks.forEach(({ blockId, index }) => {
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

        this.selectedBlocks.forEach(({ blockId, index }) => {
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

                return
            }

            if (!shouldAdd) return

            textEl.querySelectorAll(this.elementTagName).forEach((b) => b.replaceWith(...b.childNodes))

            const newUnderline = document.createElement(this.elementTagName)
            newUnderline.append(...textEl.childNodes)

            textEl.replaceChildren(newUnderline)
        })
    }
}

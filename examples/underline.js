class ExtendedUnderline extends Underline {
    constructor(props) {
        super(props)

        this.selectedBlocks = []
        window.addEventListener(MultiBlockSelectionPlugin.SELECTION_EVENT_NAME, (ev) => {
            queueMicrotask(() => {
                this.selectedBlocks = ev.detail.selectedBlocks.slice()
            })
        })
    }

    surround(el) {
        if (!(el instanceof Range)) return
        if (!this.selectedBlocks.length) {
            super.surround(el)
            return
        }

        this.selectedBlocks.forEach(({ blockId, index }) => {
            const block = this.api.blocks.getById(blockId)
            if (!block) return

            const el = block.holder
            if (!(el instanceof HTMLElement)) return

            const textEl = el.querySelector('[contenteditable=true]')
            if (!(textEl instanceof HTMLElement)) return
            const allText = el.textContent

            const firstUnderlineEl = textEl.querySelector('u.cdx-underline')
            if (firstUnderlineEl && firstUnderlineEl.textContent == allText) {
                const textNode = document.createTextNode(allText)
                firstUnderlineEl.replaceWith(textNode)
                return
            }

            firstUnderlineEl?.remove()

            const newUnderline = document.createElement('u')
            newUnderline.classList.add('cdx-underline')
            newUnderline.textContent = allText

            textEl.replaceChildren(newUnderline)
        })
    }
}

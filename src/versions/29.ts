import EditorJs from "@editorjs/editorjs";
import "../index.css";

export type SelectedBlock = { blockId: string; index: number, isFirstSelected?: boolean };
export type ConstructorProps = {
    editor: EditorJs,
    /**
     * In case you want to hide some items from the toolbar
     * @param toolbar 
     */
    onBeforeToolbarOpen?(toolbar: HTMLElement): void;

    /**
     * This is used internally for hiding the toolbar for versions 2.29 because toolbars dont have initially all its features rendered inside of it
     * Increase value if toolbar glitching occurs when callins listen()
     * @default 200
     */
    toolbarHiddenTimeoutMs?: number;
}

export class MultiBlockSelectionPlugin_V2_29 {
    public static SELECTION_EVENT_NAME =
        "block-selection-changed"

    private onBeforeToolbarOpen: ConstructorProps['onBeforeToolbarOpen'];
    private editor: ConstructorProps['editor'];
    private toolbarHiddenTimeoutMs: ConstructorProps['toolbarHiddenTimeoutMs']
    private observer: MutationObserver;
    private selectedBlocks: SelectedBlock[] = [];
    private isInlineOpen = false;
    private redactorElement: HTMLElement | null = null;
    constructor({ editor, onBeforeToolbarOpen, toolbarHiddenTimeoutMs = 200 }: ConstructorProps) {
        this.editor = editor;
        this.onBeforeToolbarOpen = onBeforeToolbarOpen
        this.toolbarHiddenTimeoutMs = toolbarHiddenTimeoutMs;

        //needed for block level selections
        this.observer = new MutationObserver((mutations) => {
            let shouldDispatchEvent = false;
            mutations.forEach((mutation) => {
                if (mutation.type !== "attributes" || !(mutation.target instanceof HTMLElement)) return;

                const { target } = mutation;
                const blockId = this.getBlockIdForElement(target);
                if (!blockId) return

                const block = this.editor.blocks.getById(blockId);
                if (!block) return;

                const isSelected = block.selected || target.classList.contains(this.EditorCSS.selected);
                const isAlreadySelected = this.selectedBlocks.some(({ blockId }) => blockId === block.id);
                if (isSelected == isAlreadySelected) return;

                shouldDispatchEvent = true;
                const index = Array.from(target.parentElement?.children ?? []).indexOf(target);
                if (isSelected) {
                    const selectionData: SelectedBlock = { blockId: block.id, index };
                    if (this.selectedBlocks.length === 0)
                        selectionData.isFirstSelected = true;
                    this.selectedBlocks.push(selectionData);
                } else {
                    this.selectedBlocks = this.selectedBlocks.filter(({ blockId }) => blockId !== block.id);
                }
            });

            if (!shouldDispatchEvent || this.isInlineOpen) return;

            window.dispatchEvent(
                new CustomEvent(MultiBlockSelectionPlugin_V2_29.SELECTION_EVENT_NAME, {
                    detail: { selectedBlocks: this.selectedBlocks },
                })
            );
        });
    }

    public listen() {
        this.initEditorListeners();
        this.verifyToolbarIsMountedWithItems();
    }

    public unlisten() {
        this.observer?.disconnect();
        this.redactorElement?.removeEventListener("mouseup", this.onRedactorMouseUp);
        this.redactorElement = null;
    }

    private get EditorCSS() {
        return {
            selected: "ce-block--selected",
            redactor: "codex-editor__redactor",
            block: "ce-block",
            blockContent: "ce-block__content",
            inlineToolbar: "ce-inline-toolbar",
            inlineToolbarButtons: "ce-inline-toolbar__buttons",
            inlineToolbarShowed: "ce-inline-toolbar--showed",
        };
    }

    private get CSS() {
        return {
            blockSelected: "ce-custom-block-selection",
            temporaryToolbarSelected: "temporary-toolbar-selected",
            temporaryBlockSelected: "temporary-block-selected"
        };
    }

    private initEditorListeners() {
        const { holder } = (this.editor as any).configuration;
        if (!holder) return;
        this.redactorElement = document.querySelector(`[id='${holder}'] .${this.EditorCSS.redactor}`);
        if (!this.redactorElement) return;

        this.observer.observe(this.redactorElement, {
            attributeFilter: ["class"],
            attributes: true,
            childList: true,
            subtree: true,
        });
        this.redactorElement.addEventListener("mouseup", this.onRedactorMouseUp);
    }

    private onRedactorMouseUp = (e: MouseEvent) => {
        if (!this.selectedBlocks.length) {
            this.closeInlineToolbar();
            return;
        }

        function sortByIndex(a: SelectedBlock, b: SelectedBlock) {
            return a.index > b.index ? 1 : -1;
        }

        const lastSelectedElement = [...this.selectedBlocks].sort(sortByIndex).reverse()[0];
        if (!lastSelectedElement) return;

        const { blockId, index } = lastSelectedElement;
        const el = this.getDOMBlockByIdOrIdx(blockId, index);
        if (!el) return;

        this.openInlineToolbar();
    };

    private closeInlineToolbar() {
        if (!this.isInlineOpen) return;
        const toolbar = this.getInlineToolbar();
        toolbar?.classList.remove(
            this.EditorCSS.inlineToolbarShowed,
        );
        document
            .querySelectorAll(`.${this.CSS.blockSelected}`)
            .forEach((el) => el.classList.remove(this.CSS.blockSelected));
        window.removeEventListener("click", this.globalClickListenerForToolbarClose.bind(this), { capture: true });

        this.isInlineOpen = false;
    }

    private openInlineToolbar() {
        const toolbar = this.getInlineToolbar();
        if (!toolbar) return;

        // EditorJS automatically removes their selected styling after a block is saved
        document
            .querySelectorAll(`.${this.EditorCSS.selected}`)
            .forEach((el) => el.classList.add(this.CSS.blockSelected));

        this.onBeforeToolbarOpen?.(toolbar)

        this.isInlineOpen = true;

        const shouldAddPositionToToolbar = !toolbar.style.left || toolbar.style.left === "unset" || toolbar.style.left == "0px";
        if (shouldAddPositionToToolbar) {
            const positionData = this.getToolbarPositionFor2_28_1Version()
            const { left, top } = positionData ?? {}
            toolbar.style.left = `${left}px`;
            if (top !== undefined)
                toolbar.style.top = `${top}px`;
        }

        // toolbar.style.left = `max(120px,${toolbar.style.left ?? "0px"})`
        toolbar.classList.add(
            this.EditorCSS.inlineToolbarShowed,
        );
        window.addEventListener("click", this.globalClickListenerForToolbarClose.bind(this), { capture: true });

    }

    private globalClickListenerForToolbarClose(e: MouseEvent) {
        if (!this.isInlineOpen) return;
        if (!(e.target instanceof HTMLElement)) return;
        const isInsideOfRedactor = this.redactorElement === e.target || this.redactorElement?.contains(e.target)
        if (isInsideOfRedactor) return;

        this.closeInlineToolbar();
    }

    private verifyToolbarIsMountedWithItems() {
        const toolbar = this.getInlineToolbar();
        if (!toolbar) return;
        const buttonsContainer = toolbar.querySelector(`.${this.EditorCSS.inlineToolbarButtons}`)
        if (!(buttonsContainer instanceof HTMLElement)) return;

        const isEmpty = buttonsContainer.childElementCount === 0;
        if (!isEmpty) return;

        const blockEl = this.getDOMBlockByIdOrIdx("idk", 0);
        const editableElement = blockEl?.querySelector("[contenteditable]")
        if (!(editableElement instanceof HTMLElement)) return;

        const range = document.createRange();

        range.selectNodeContents(editableElement)

        const selection = document.getSelection();
        if (!selection) return;

        toolbar.classList.add(this.CSS.temporaryToolbarSelected)
        editableElement.classList.add(this.CSS.temporaryBlockSelected)

        selection.removeAllRanges();
        selection.addRange(range);

        const toolbarButtonsObserver = new MutationObserver(() => {
            selection.removeAllRanges();
            toolbarButtonsObserver.disconnect();

            setTimeout(() => {
                toolbar.classList.remove(this.CSS.temporaryToolbarSelected)
            }, this.toolbarHiddenTimeoutMs)
            editableElement.classList.remove(this.CSS.temporaryBlockSelected)
        })

        toolbarButtonsObserver.observe(buttonsContainer, {
            childList: true,
            subtree: true
        })
    }

    // handle multiple editorjs versions..
    private getBlockIdForElement(target: HTMLElement) {
        let blockId = target.getAttribute("data-id");
        if (blockId) return blockId;

        blockId = this.editor.blocks
            //@ts-ignore
            .getBlockByElement?.(target)?.id ?? null;
        if (blockId) return blockId;

        const blockIndex = Array.from(target.parentElement?.children ?? []).indexOf(target);
        if (blockIndex == null)
            return null;

        blockId = this.editor.blocks.getBlockByIndex(blockIndex)?.id ?? null;
        return blockId;
    }

    private getDOMBlockByIdOrIdx(blockId: string, index: number) {
        let block = this.editor.blocks.getById(blockId)?.holder ?? null;
        if ((block instanceof HTMLElement)) return block;

        block = this.redactorElement?.querySelector(`.${this.EditorCSS.block}[data-id='${blockId}']`) ?? null;
        if ((block instanceof HTMLElement)) return block;

        block = this.redactorElement?.querySelector(`.${this.EditorCSS.block}:nth-child(${index + 1})`) ?? null;
        if ((block instanceof HTMLElement)) return block;
        return null;
    }

    private getInlineToolbar() {
        const toolbar = document.querySelector(`.${this.EditorCSS.inlineToolbar}`);
        if (!(toolbar instanceof HTMLElement)) return null;
        return toolbar;
    }

    private getLeftDistanceForToolbar() {
        const anyBlockEl = this.redactorElement?.querySelector(`.${this.EditorCSS.block}`);
        const contentEl = anyBlockEl?.querySelector(`.${this.EditorCSS.blockContent}`);

        if (!(anyBlockEl instanceof HTMLElement) || !(contentEl instanceof HTMLElement)) return null;

        return contentEl.getBoundingClientRect().left - anyBlockEl.getBoundingClientRect().left
    }

    private getToolbarPositionFor2_28_1Version() {
        const firstSelectedBlockData = this.selectedBlocks.find(d => d.isFirstSelected);
        if (!firstSelectedBlockData) return null;
        const toolbarRect = this.getInlineToolbar()?.getBoundingClientRect();

        let left = this.getLeftDistanceForToolbar();
        if (left === null) return null;
        left += (toolbarRect?.width || 0) / 2;
        left = Math.round(left);
        left += 16;// margin

        const blockEl = this.getDOMBlockByIdOrIdx(firstSelectedBlockData.blockId, firstSelectedBlockData.index)
        const redactorTop = this.redactorElement?.getBoundingClientRect().top
        if (!blockEl || redactorTop === undefined) return { left };


        let top = blockEl.getBoundingClientRect().top - redactorTop
        top += toolbarRect?.height || 0;
        top = Math.ceil(top)

        return { left, top }
    }
}

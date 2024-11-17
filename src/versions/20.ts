import EditorJs from "@editorjs/editorjs";
import "../index.css";

export type SelectedBlock = { index: number, isFirstSelected?: boolean };
export type ConstructorProps = {
    editor: EditorJs,
    /**
     * In case you want to hide some items from the toolbar
     * @param toolbar 
     */
    onBeforeToolbarOpen?(toolbar: HTMLElement): void;
}

export class MultiBlockSelectionPlugin_V2_20 {
    public static SELECTION_EVENT_NAME =
        "block-selection-changed"

    private onBeforeToolbarOpen: ConstructorProps['onBeforeToolbarOpen'];
    private editor: EditorJs;
    private observer: MutationObserver;
    private selectedBlocks: SelectedBlock[] = [];
    private isInlineOpen = false;
    private redactorElement: HTMLElement | null = null;
    constructor({ editor, onBeforeToolbarOpen }: ConstructorProps) {
        this.editor = editor;
        this.onBeforeToolbarOpen = onBeforeToolbarOpen

        //needed for block level selections
        this.observer = new MutationObserver((mutations) => {
            let shouldDispatchEvent = false;
            mutations.forEach((mutation) => {
                if (mutation.type !== "attributes" || !(mutation.target instanceof HTMLElement)) return;

                const { target } = mutation;
                const blockIndex = this.getBlockIndexForElement(target);
                if (!blockIndex) return

                const block = this.editor.blocks.getBlockByIndex(blockIndex)
                if (!block) return;

                const isSelected = block.selected || target.classList.contains(this.EditorCSS.selected);
                const isAlreadySelected = this.selectedBlocks.some(({ index }) => index === blockIndex);
                if (isSelected == isAlreadySelected) return;



                shouldDispatchEvent = true;
                const index = Array.from(target.parentElement?.children ?? []).indexOf(target);
                if (isSelected) {
                    const selectionData: SelectedBlock = { index };
                    if (this.selectedBlocks.length === 0)
                        selectionData.isFirstSelected = true;
                    this.selectedBlocks.push(selectionData);
                } else {
                    this.selectedBlocks = this.selectedBlocks.filter(({ index }) => index !== blockIndex);
                }
            });

            if (!shouldDispatchEvent || this.isInlineOpen) return;

            window.dispatchEvent(
                new CustomEvent(MultiBlockSelectionPlugin_V2_20.SELECTION_EVENT_NAME, {
                    detail: { selectedBlocks: this.selectedBlocks },
                })
            );
        });
    }

    public listen() {
        this.initEditorListeners();
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
            inlineToolbarShowed: "ce-inline-toolbar--showed",
        };
    }

    private get CSS() {
        return {
            blockSelected: "ce-custom-block-selection",
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

        console.log("🚀 ~ MultiBlockSelectionPlugin_V2_20 ~ selectedBlocks:", this.selectedBlocks.length)
        if (!this.selectedBlocks.length) {
            this.closeInlineToolbar();
            return;
        }

        function sortByIndex(a: SelectedBlock, b: SelectedBlock) {
            return a.index > b.index ? 1 : -1;
        }

        const lastSelectedElement = [...this.selectedBlocks].sort(sortByIndex).reverse()[0];
        if (!lastSelectedElement) return;

        const { index } = lastSelectedElement;
        const el = this.getDOMBlockByIdx(index);
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
    }

    // handle multiple editorjs versions..
    private getBlockIndexForElement(target: HTMLElement): number | null {
        const blockIndex = Array.from(target.parentElement?.children ?? []).indexOf(target);
        return blockIndex === -1 ? null : blockIndex;
    }

    private getDOMBlockByIdx(index: number) {
        let block = this.redactorElement?.querySelector(`.${this.EditorCSS.block}:nth-child(${index})`) ?? null;
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

        const blockEl = this.getDOMBlockByIdx(firstSelectedBlockData.index)
        const redactorTop = this.redactorElement?.getBoundingClientRect().top
        if (!blockEl || redactorTop === undefined) return { left };


        let top = blockEl.getBoundingClientRect().top - redactorTop
        top += toolbarRect?.height || 0;
        top = Math.ceil(top)

        return { left, top }
    }
}

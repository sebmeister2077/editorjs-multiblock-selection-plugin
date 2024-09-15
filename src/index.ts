import EditorJs from "@editorjs/editorjs";
import "./index.css";

export type SelectedBlock = { blockId: string; index: number };
export default class MultiBlockSelectionPlugin {
    public static SELECTION_EVENT_NAME =
        "block-selection-changed"

    private editor: EditorJs;
    private observer: MutationObserver;
    private selectedBlocks: SelectedBlock[] = [];
    private isInlineOpen = false;
    private redactorElement: HTMLElement | null = null;
    constructor({ editor }: { editor: EditorJs }) {
        this.editor = editor;

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

                const isSelected = block.selected;
                const isAlreadySelected = this.selectedBlocks.some(({ blockId }) => blockId === block.id);
                if (isSelected == isAlreadySelected) return;

                shouldDispatchEvent = true;
                const index = Array.from(target.parentElement?.children ?? []).indexOf(target);
                if (isSelected) {
                    this.selectedBlocks.push({ blockId: block.id, index });
                } else {
                    this.selectedBlocks = this.selectedBlocks.filter(({ blockId }) => blockId !== block.id);
                }
            });

            if (!shouldDispatchEvent || this.isInlineOpen) return;

            window.dispatchEvent(
                new CustomEvent(MultiBlockSelectionPlugin.SELECTION_EVENT_NAME, {
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
        if (!this.selectedBlocks.length) {
            this.closeInlineToolbar();
            return;
        }

        function sortByIndex(a: SelectedBlock, b: SelectedBlock) {
            return a.index > b.index ? 1 : -1;
        }

        const lastSelectedElement = [...this.selectedBlocks].sort(sortByIndex).reverse()[0];
        if (!lastSelectedElement) return;

        console.log("🚀 ~ MultiBlockSelectionPlugin ~ lastSelectedElement:", lastSelectedElement)
        const { blockId, index } = lastSelectedElement;
        const el = this.getDOMBlockByIdOrIdx(blockId, index);
        console.log("🚀 ~ MultiBlockSelectionPlugin ~ el:", el)
        if (!el) return;

        this.openInlineToolbar();
    };

    private closeInlineToolbar() {
        if (this.isInlineOpen) {
            this.getInlineToolbar()?.classList.remove(
                this.EditorCSS.inlineToolbarShowed,
            );
            document
                .querySelectorAll(`.${this.CSS.blockSelected}`)
                .forEach((el) => el.classList.remove(this.CSS.blockSelected));
            this.isInlineOpen = false;
        }
    }

    private openInlineToolbar() {
        const toolbar = this.getInlineToolbar();
        if (!toolbar) return;

        // EditorJS automatically removes their selected styling after a block is saved
        document
            .querySelectorAll(`.${this.EditorCSS.selected}`)
            .forEach((el) => el.classList.add(this.CSS.blockSelected));

        toolbar.style.left = `max(120px,${toolbar.style.left ?? "0px"})`;
        this.isInlineOpen = true;
        toolbar.classList.add(
            this.EditorCSS.inlineToolbarShowed,
        );
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
        let block = document.querySelector(`.${this.EditorCSS.block}[data-id='${blockId}']`);
        if ((block instanceof HTMLElement)) return block;

        block = document.querySelector(`.${this.EditorCSS.redactor} .${this.EditorCSS.block}:nth-child(${index})`)
        if ((block instanceof HTMLElement)) return block;
        return null;
    }

    private getInlineToolbar() {
        const toolbar = document.querySelector(`.${this.EditorCSS.inlineToolbar}`);
        if (!(toolbar instanceof HTMLElement)) return null;
        return toolbar;
    }
}

import EditorJs from "@editorjs/editorjs";
import "./index.css";
export type SelectedBlock = {
    blockId: string;
    index: number;
};
export default class MultiBlockSelectionPlugin {
    static SELECTION_EVENT_NAME: string;
    private editor;
    private observer;
    private selectedBlocks;
    private isInlineOpen;
    private redactorElement;
    constructor({ editor }: {
        editor: EditorJs;
    });
    listen(): void;
    unlisten(): void;
    private get EditorCSS();
    private get CSS();
    private initEditorListeners;
    private onRedactorMouseUp;
    private closeInlineToolbar;
    private openInlineToolbar;
    private getBlockIdForElement;
    private getDOMBlockByIdOrIdx;
    private getInlineToolbar;
}

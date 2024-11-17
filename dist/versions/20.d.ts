import EditorJs from "@editorjs/editorjs";
import "../index.css";
export type SelectedBlock = {
    blockId: string;
    index: number;
    isFirstSelected?: boolean;
};
export type ConstructorProps = {
    editor: EditorJs;
    /**
     * In case you want to hide some items from the toolbar
     * @param toolbar
     */
    onBeforeToolbarOpen?(toolbar: HTMLElement): void;
};
export declare class MultiBlockSelectionPlugin_V2_20 {
    static SELECTION_EVENT_NAME: string;
    private onBeforeToolbarOpen;
    private editor;
    private observer;
    private selectedBlocks;
    private isInlineOpen;
    private redactorElement;
    constructor({ editor, onBeforeToolbarOpen }: ConstructorProps);
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
    private getLeftDistanceForToolbar;
    private getToolbarPositionFor2_28_1Version;
}

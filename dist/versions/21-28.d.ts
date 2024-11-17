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
    /**
    * This is used internally for hiding the toolbar, because toolbars dont have initially all its features rendered inside of it
    * Increase value if toolbar glitching occurs when callins listen()
    * @default 200
    */
    toolbarHiddenTimeoutMs?: number;
};
export declare class MultiBlockSelectionPlugin_V2_20to28 {
    static SELECTION_EVENT_NAME: string;
    private onBeforeToolbarOpen;
    private editor;
    private toolbarHiddenTimeoutMs;
    private observer;
    private selectedBlocks;
    private isInlineOpen;
    private redactorElement;
    constructor({ editor, onBeforeToolbarOpen, toolbarHiddenTimeoutMs }: ConstructorProps);
    listen(): void;
    unlisten(): void;
    private get EditorCSS();
    private get CSS();
    private initEditorListeners;
    private onRedactorMouseUp;
    private closeInlineToolbar;
    private openInlineToolbar;
    private globalClickListenerForToolbarClose;
    private verifyToolbarIsMountedWithItems;
    private getBlockIdForElement;
    private getDOMBlockByIdOrIdx;
    private getInlineToolbar;
    private getLeftDistanceForToolbar;
    private getToolbarPositionFor2_28_1Version;
}

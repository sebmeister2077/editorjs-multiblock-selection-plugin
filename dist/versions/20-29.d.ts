import EditorJs from "@editorjs/editorjs";
import "../index.css";
export type SelectedBlock = {
    /**
     * Guaranteed to exist only from version 2.21.x and above
     */
    blockId?: string;
    index: number;
    isFirstSelected?: boolean;
};
export type ConstructorProps = {
    /**
     * Pass EditorJS.version value
     */
    editorVersion: string;
    editor: EditorJs;
    /**
     * In case you want to hide some items from the toolbar
     * @param toolbar
     */
    onBeforeToolbarOpen?(toolbar: HTMLElement): void;
    /**
    * This is used internally for hiding the toolbar, because toolbars dont have initially all its features rendered inside of it (version 2.29.x and up)
    * Increase value if toolbar glitching occurs after calling listen()
    * @default 200
    */
    toolbarHiddenTimeoutMs?: number;
};
export declare class MultiBlockSelectionPlugin {
    static SELECTION_EVENT_NAME: string;
    private onBeforeToolbarOpen;
    private editor;
    private editorVersion;
    private toolbarHiddenTimeoutMs;
    private observer;
    private selectedBlocks;
    private isInlineOpen;
    private redactorElement;
    constructor({ editor, onBeforeToolbarOpen, editorVersion, toolbarHiddenTimeoutMs }: ConstructorProps);
    listen(): void;
    unlisten(): void;
    private get doBlocksHaveIds();
    private get isVersion30();
    private get EditorCSS();
    private get CSS();
    private syncSelectedBlocks;
    private initEditorListeners;
    private onRedactorMouseUp;
    private closeInlineToolbar;
    private openInlineToolbar;
    private globalClickListenerForToolbarClose;
    private verifyToolbarIsMountedWithItems;
    private getBlockIdAndIndexForElement;
    private getDOMBlockByIdOrIdx;
    private getInlineToolbar;
    private getLeftDistanceForToolbar;
    private getToolbarPositionFor2_28_1Version;
}

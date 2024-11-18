import EditorJs from "@editorjs/editorjs";
import "./index.css";
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
    version: string;
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
export type EditorVersions = {
    V30: `2.30${"" | ".0" | ".1" | ".2" | ".3" | ".4" | ".5" | ".6" | ".7"}`;
    V29: `2.29${"" | ".0" | ".1" | ".2"}`;
    V28: `2.28${"" | ".0" | ".1" | ".2"}`;
    V27: `2.27${"" | ".0" | ".1" | ".2"}`;
    V26: `2.26${"" | ".0" | ".1" | ".2" | ".3" | ".4" | ".5"}`;
    V25: `2.25${"" | ".0"}`;
    V24: `2.24${"" | ".0" | ".1" | ".2" | ".3"}`;
    V23: `2.23${"" | ".0" | ".1" | ".2"}`;
    V22: `2.22${"" | ".0" | ".1" | ".2" | ".3"}`;
    V21: `2.21${"" | ".0"}`;
    V20: `2.20${"" | ".0" | ".1" | ".2"}`;
};
export default class MultiBlockSelectionPlugin {
    static SELECTION_CHANGE_EVENT_NAME: string;
    private onBeforeToolbarOpen;
    private editor;
    private editorVersion;
    private toolbarHiddenTimeoutMs;
    private observer;
    private selectedBlocks;
    private isInlineOpen;
    private redactorElement;
    constructor({ editor, onBeforeToolbarOpen, version: editorVersion, toolbarHiddenTimeoutMs }: ConstructorProps);
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

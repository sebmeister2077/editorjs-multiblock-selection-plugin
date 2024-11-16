import { MultiBlockSelectionPlugin_V2_28 } from "./versions/2_28";

export default function getMultiBlockSelectionPluginForVersion(version: string) {
    switch (version) {
        case "2.28":
        case "2.28.1":
        case "2.28.0":
            return MultiBlockSelectionPlugin_V2_28;
        default:
            console.error("Given EditorJS version is not compatible with multiblock plugin")
    }
}

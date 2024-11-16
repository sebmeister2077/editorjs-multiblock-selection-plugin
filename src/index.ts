import { MultiBlockSelectionPlugin_V2_28 } from "./versions/2_28";

export default function getMultiBlockSelectionPluginForVersion(version: string) {
    switch (version) {
        case "2.26":
        case "2.26.0":
        case "2.26.1":
        case "2.26.2":
        case "2.26.3":
        case "2.26.4":
        case "2.26.5":
        case "2.27":
        case "2.27.0":
        case "2.27.1":
        case "2.27.2":
        case "2.28":
        case "2.28.0":
        case "2.28.1":
        case "2.28.2":
            return MultiBlockSelectionPlugin_V2_28;
        default:
            console.error("Given EditorJS version is not compatible with multiblock plugin")
    }
}

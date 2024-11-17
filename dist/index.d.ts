import { MultiBlockSelectionPlugin_V2_28 } from "./versions/2_28";
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
    V20: `2.20${"" | ".0"}`;
};
export default function getMultiBlockSelectionPluginForVersion(version: EditorVersions[keyof EditorVersions]): typeof MultiBlockSelectionPlugin_V2_28;

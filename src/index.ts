//@ts-nocheck
import { connectToFile, focusCallback, connectToFile } from "./ui";

// Adding god object
window.roamfs = {}
roamfs.syncs = [];

// Adding block context menu entry
roamAlphaAPI.ui.blockContextMenu.addCommand(
    {
        label: "Roam FS: Connect to a local file",
        'display-conditional':
            (e) => e['block-string'].includes("```") && !roamfs.syncs.some((s) => s.uid == e['block-uid']),
        callback: (e) => {
            connectToFile(e, roamfs.syncs)
        }
    }
)

roamAlphaAPI.ui.blockContextMenu.addCommand(
    {
        label: "Roam FS: Disconnect",
        'display-conditional':
            (e) => e['block-string'].includes("```") && roamfs.syncs.some(s => s.uid == e['block-uid']),
        callback: (e) => {
            roamfs.syncs = roamfs.syncs.filter(s => s.uid != e['block-uid'])
        }
    }
)

// Adding focus listentrk
window.addEventListener("focus", () => {
    focusCallback(roamfs.syncs)
})
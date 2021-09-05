//@ts-nocheck
import { connectToFile, focusCallback, connectToFile } from "./ui";

// Adding god object
window.roamfs = {}
window.roamfs.syncs = [];

// Adding block context menu entry
roamAlphaAPI.ui.blockContextMenu.addCommand(
    {
        label: "Roam FS: Connect to a local file",
        'display-conditional':
            (e) => e['block-string'].includes("```"),
        callback: (e) => {
            connectToFile(e, window.roamfs.syncs)
        }
    }
)

// Adding focus listentrk
window.addEventListener("focus", () => {
    focusCallback(window.roamfs.syncs)
})
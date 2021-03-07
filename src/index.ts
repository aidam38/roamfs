//@ts-nocheck
import { focusCallback, rightClickCallback } from "./ui";

// Adding god object
window.roamfs = {}
window.roamfs.syncs = [];

// Adding right click listenter
document.addEventListener("contextmenu", (e) => {
    rightClickCallback(e, window.roamfs.syncs)
})

// Adding focus listentrk
window.addEventListener("focus", () => {
    focusCallback(window.roamfs.syncs)
})
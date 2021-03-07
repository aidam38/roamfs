import { openFileFromSystem, readFile } from "./filesystem";

// Helpers
const updateBlock = async (uid, string) => {
    //@ts-ignore
    await window.roamAlphaAPI.updateBlock({
        block: {
            uid: uid,
            string: string,
        },
    });
};

const readBlock = async (uid) => {
    //@ts-ignore
    const results = await window.roamAlphaAPI.q(`[:find
    (pull ?block [:block/string])
    :where [?block :block/uid "${uid}"]]`)
    if (results && results.length !== 0) {
        return results[0][0].string;
    } else return ""
}

const getUid = (target) => {
    return target.closest(".roam-block").id.slice(-9);
};

const replaceCodeblockContent = (orig, content) => {
    return orig.replace(/(?<=```)(\w+).*(?=```)/gms, "$1\n" + content)
}

export const rightClickCallback = async (e, syncs) => {
    e.preventDefault();
    if (e.target.classList.contains("CodeMirror-gutter-elt")) {
        const uid = getUid(e.target);
        const orig = await readBlock(uid);
        const file = await openFileFromSystem();
        //@ts-ignore
        syncs.push({
            uid: uid,
            orig: orig,
            file: file,
        })
    }
}

export const focusCallback = async (syncs) => {
    console.log("focus")
    syncs = await Promise.all(syncs.map(async (sync) => {
        const content = await readFile(sync.file);
        return {
            uid: sync.uid,
            content: replaceCodeblockContent(sync.orig, content)
        }
    }))
    syncs.forEach(sync => {
        console.log("Updating block: " + sync.uid + " with " + sync.content);

        updateBlock(sync.uid, sync.content)
    });
}
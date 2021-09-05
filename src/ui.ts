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

const replaceCodeblockContent = (orig, content) => {
    return orig.replace(/(?<=```)(\w+).*(?=```)/gms, "$1\n" + content)
}

export const connectToFile = async (e, syncs) => {
    const uid = e['block-uid']
    const orig = await readBlock(uid);
    const file = await openFileFromSystem();
    //@ts-ignore
    syncs.push({
        uid: uid,
        orig: orig,
        file: file,
    })
}
export const focusCallback = async (syncs) => {
    var updates = await Promise.all(syncs.map(async (sync) => {
        const content = await readFile(sync.file);
        return {
            uid: sync.uid,
            content: replaceCodeblockContent(sync.orig, content)
        }
    }))
    updates.forEach(sync => {
        //@ts-ignore
        updateBlock(sync.uid, sync.content)
    });
}
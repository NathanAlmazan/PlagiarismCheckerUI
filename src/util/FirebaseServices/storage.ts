import app from "./instance";
import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage(app);

//gs://plagiarismchecker-d2959.appspot.com/originalFiles/1a816047-46cd-454a-9b74-6c0ff4c0cf89

export default async function deleteFile(uid: string) {
    const originalRef = ref(storage, `gs://plagiarismchecker-d2959.appspot.com/originalFiles/${uid}`);
    const renderedRef = ref(storage, `gs://plagiarismchecker-d2959.appspot.com/renderedFiles/${uid}.txt`);

    try {
        await deleteObject(originalRef);
        await deleteObject(renderedRef);
    } catch (err) {
        console.log((err as Error).message);
    }
}
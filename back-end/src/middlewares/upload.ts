import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (_: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) => {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        cb(null, fileName);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
});

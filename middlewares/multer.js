import multer from "multer";

const storage = multer.memoryStorage()

export const singlUpload = multer({storage}).single("file")
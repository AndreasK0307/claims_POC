import { dirname, fromFileUrl } from "jsr:@std/path";

// Get the file path from the URL of the current module
const __filename = fromFileUrl(import.meta.url);

// Calculate the directory path
const __dirname = dirname(__filename)

export const config = {
    dirname: __dirname
};
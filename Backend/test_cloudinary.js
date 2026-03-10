import { uploadImage } from './src/utils/cloudinary.js';
import fs from 'fs';

// A small transparent pixel as base64 for testing
const testBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

async function test() {
    try {
        console.log('Testing Cloudinary upload...');
        const res = await uploadImage(testBase64, 'test');
        console.log('Upload success:', res);
    } catch (err) {
        console.error('Upload failed:', err);
    }
}

test();

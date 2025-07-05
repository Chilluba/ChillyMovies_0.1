"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store = require('electron-store');
// Define the schema for your settings
const schema = {
    settings: {
        type: 'object',
        properties: {
            downloadPath: { type: 'string' },
            language: { type: 'string', enum: ['en', 'es', 'fr', 'de'] },
            maxConcurrentDownloads: { type: 'number', minimum: 1, maximum: 10 },
            autoStartDownloads: { type: 'boolean' },
            defaultQuality: { type: 'string', enum: ['480p', '720p', '1080p', '4k'] },
            theme: { type: 'string', enum: ['dark', 'light', 'system'] },
        },
        required: ['downloadPath', 'language', 'maxConcurrentDownloads', 'autoStartDownloads', 'defaultQuality', 'theme'],
    },
};
// Define the default values for your settings
const defaults = {
    settings: {
        downloadPath: '', // Default to an empty string, let the app handle it
        language: 'en',
        maxConcurrentDownloads: 3,
        autoStartDownloads: false,
        defaultQuality: '720p',
        theme: 'system',
    },
};
// Initialize and export the typed store
const store = new Store({
    schema,
    defaults,
    watch: true, // Watch for changes in the config file
});
module.exports = store;

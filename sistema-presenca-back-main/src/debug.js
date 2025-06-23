"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
console.log('Starting debug script...');
var result = dotenv_1.default.config();
if (result.error) {
    console.error('Error loading .env file:', result.error);
}
else {
    console.log('Successfully loaded .env file.');
    console.log('Parsed environment variables:', result.parsed);
}
console.log('MONGO_URI from process.env:', process.env.MONGO_URI);
console.log('FIREBASE_PATH from process.env:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
console.log('Debug script finished.');

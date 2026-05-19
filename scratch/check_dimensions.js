
const fs = require('fs');
const path = require('path');
const THREE = require('three');
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');
const { JSDOM } = require('jsdom');

// Mock browser environment for Three.js loaders
const dom = new JSDOM();
global.self = global;
global.window = dom.window;
global.document = dom.window.document;
global.Blob = dom.window.Blob;
global.FileReader = dom.window.FileReader;
global.URL = dom.window.URL;

// Override Loader to work with local files if needed, but we'll use a simpler way
// Actually, GLTFLoader uses fetch/XMLHttpRequest which won't work easily here.
// Let's just try to parse the JSON part of the GLB.

function checkGlbSize() {
    const filePath = 'D:/Grad/GraduationProject/frontend/GP/src/assets/models/businessman.glb';
    const buffer = fs.readFileSync(filePath);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    
    // Simple check for the 'JSON' chunk to find scale if any, 
    // but better to just look at the size in bytes again and maybe use a different approach.
}

console.log("Checking model dimensions...");
// Since running a full Three.js loader in Node is complex with dependencies, 
// let's try a simpler approach if possible.
// Actually, I can just try to modify the camera in the code to be further back and see if it helps.

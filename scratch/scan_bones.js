
const fs = require('fs');
const path = require('path');

// We know the file is at D:/Grad/GraduationProject/frontend/GP/public/models/businessman.glb
// We'll use a simple regex to find bone names in the JSON part of the GLB
function findBones() {
    const filePath = 'D:/Grad/GraduationProject/frontend/GP/public/models/businessman.glb';
    const buffer = fs.readFileSync(filePath);
    const content = buffer.toString('utf8', 0, 100000); // Read first 100KB which usually contains the JSON
    
    // Look for "name":"..." patterns that might be bones
    // Usually bones are in the "nodes" array
    const matches = content.match(/"name":"[^"]+"/g);
    if (matches) {
        console.log("Found Names in GLB (Nodes/Bones):");
        const uniqueNames = [...new Set(matches)];
        uniqueNames.forEach(n => console.log(n));
    } else {
        console.log("No names found in the first 100KB");
    }
}

findBones();

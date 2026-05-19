
const fs = require('fs');
const path = require('path');

async function checkModel() {
    const filePath = 'D:/Grad/GraduationProject/avatr/businessman figure 3d model.glb';
    const stats = fs.statSync(filePath);
    console.log(`File size: ${stats.size} bytes`);
}

checkModel().catch(console.error);

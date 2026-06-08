import fs from 'fs';
import path from 'path';

let file = path.join('public', 'classgrid_assistant.html');
let content = fs.readFileSync(file, 'utf8');

// Replace .logo-container
content = content.replace(
    /\.logo-container\s*{[^}]*}/,
    `.logo-container {
            width: 45px;
            height: 45px;
            flex-shrink: 0;
            cursor: pointer;
            transition: transform 0.3s;
        }`
);

// Replace rotation animation block
content = content.replace(
    /@media \(min-width: 769px\) {\s*\.logo-container {\s*animation: rotateLogo 20s linear infinite;\s*}\s*\.logo-container:hover {\s*transform: scale\(1\.05\);\s*}\s*}/,
    `@media (min-width: 769px) {
            .logo-container:hover {
                transform: scale(1.05);
            }
        }`
);

// Replace .welcome-logo
content = content.replace(
    /\.welcome-logo\s*{[^}]*}/,
    `.welcome-logo {
            width: auto;
            max-width: 120px;
            height: 80px;
            margin: 0 auto 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }`
);

// Replace pulse animation block
content = content.replace(
    /@keyframes pulse {\s*0%,\s*100% {\s*transform: scale\(1\);\s*box-shadow: 0 0 60px rgba\(0, 212, 255, 0\.5\);\s*}\s*50% {\s*transform: scale\(1\.05\);\s*box-shadow: 0 0 80px rgba\(178, 75, 243, 0\.6\);\s*}\s*}/,
    `@keyframes pulse {
            0%,
            100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.05);
            }
        }`
);

// Also remove the box shadow pulse in @media (min-width: 769px) .welcome-logo if there's any other.
// Above regex takes care of the keyframes.

// Fix object-fit for logo img
content = content.replace(
    /\.logo-container img {\s*width: 100%;\s*height: 100%;\s*object-fit: cover;\s*}/,
    `.logo-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }`
);

content = content.replace(
    /\.welcome-logo img {\s*width: 100%;\s*height: 100%;\s*object-fit: cover;\s*}/,
    `.welcome-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }`
);


fs.writeFileSync(file, content, 'utf8');
console.log('Fixed classgrid_assistant.html logos');

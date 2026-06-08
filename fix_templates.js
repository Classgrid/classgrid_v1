import fs from 'fs';
import path from 'path';

// Fix email-templates.service.js
let emailFile = path.join('src', 'services', 'email-templates.service.js');
let emailContent = fs.readFileSync(emailFile, 'utf8');

emailContent = emailContent.replace(/Classgrid Research Platform/g, 'Classgrid Educational Platform');
emailContent = emailContent.replace(/Your Research Journey Starts Here/g, 'Your Learning Journey Starts Here');
emailContent = emailContent.replace(/join our research community/g, 'join our academic community');
emailContent = emailContent.replace(/Access comprehensive laboratory research database/g, 'Access comprehensive learning materials');
emailContent = emailContent.replace(/Collaborate with researchers worldwide/g, 'Collaborate with peers and faculty worldwide');
emailContent = emailContent.replace(/Store and manage your research data securely/g, 'Store and manage your academic data securely');
emailContent = emailContent.replace(/AI-powered chemistry assistant/g, 'AI-powered intelligent learning assistant');
emailContent = emailContent.replace(/support your research journey/g, 'support your learning journey');

fs.writeFileSync(emailFile, emailContent, 'utf8');
console.log('Fixed email template');

// Fix notes-ai.service.js
let aiFile = path.join('src', 'services', 'notes-ai.service.js');
let aiContent = fs.readFileSync(aiFile, 'utf8');

aiContent = aiContent.replace(/a chemistry learning platform/g, 'an intelligent classroom ecosystem');

fs.writeFileSync(aiFile, aiContent, 'utf8');
console.log('Fixed AI service');

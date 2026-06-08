const fs = require('fs');
const content = fs.readFileSync('public/login.html', 'utf8');
const ids = ['loginToggle', 'signupToggle', 'toggleSlider', 'authToggle', 'loginForm', 'signupForm', 'loginBtn', 'loginBtnText', 'signupBtn', 'signupBtnText', 'loginPasswordToggle', 'loginPassword', 'messageContainer', 'termsCheckbox', 'termsCheckboxContainer', 'resetPasswordBtn', 'resetPasswordBtnText', 'loginEmail', 'signupEmail', 'signupName', 'loginTitle', 'loginSubtitle', 'brandPanel', 'loginOAuth', 'pageFooter', 'supportButton', 'supportModal', 'closeModal', 'supportForm'];
const missing = [];
ids.forEach(id => {
  if (!content.includes('id=\"' + id + '\"') && !content.includes('id=\'' + id + '\'')) missing.push(id);
});
console.log('Missing IDs:', missing);

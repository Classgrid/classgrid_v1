<script>
    const loginToggle = document.getElementById('loginToggle');
    const signupToggle = document.getElementById('signupToggle');
    const toggleSlider = document.getElementById('toggleSlider');
    const authToggle = document.getElementById('authToggle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const signupBtn = document.getElementById('signupBtn');
    const signupBtnText = document.getElementById('signupBtnText');
    const loginPasswordToggle = document.getElementById('loginPasswordToggle');
    const loginPassword = document.getElementById('loginPassword');
    const messageContainer = document.getElementById('messageContainer');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const termsCheckboxContainer = document.getElementById('termsCheckboxContainer');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const resetPasswordBtnText = document.getElementById('resetPasswordBtnText');
    const loginEmailInput = document.getElementById('loginEmail');
    const signupEmailInput = document.getElementById('signupEmail');
    const signupNameInput = document.getElementById('signupName');
    const loginTitle = document.getElementById('loginTitle');
    const loginSubtitle = document.getElementById('loginSubtitle');
    const brandPanel = document.getElementById('brandPanel');
    const loginOAuth = document.getElementById('loginOAuth');
    const pageFooter = document.getElementById('pageFooter');
    const supportButton = document.getElementById('supportButton');
    const supportModal = document.getElementById('supportModal');
    const closeModal = document.getElementById('closeModal');
    const supportFormEl = document.getElementById('supportForm');

    const emailState = { currentEmail: '' };
    let selectedRole = 'student';
    let lastSignupName = '', lastSignupEmail = '';

    function getApiBase() {
      const o = window.location.origin;
      if (o === 'http://localhost:3000') return 'http://localhost:3000/api';
      if (o === 'https://www.classgrid.site' || o === 'https://classgrid.vercel.app') return 'https://classgrid.vercel.app/api';
      return o + '/api';
    }
    const API = getApiBase();
    const EP = {
      login: `${API}/auth/login`,
      signupInit: `${API}/auth/signup-init`,
      forgotPassword: `${API}/auth/forgot-password`,
      google: `${API}/auth/google`,
      linkedin: `${API}/auth/linkedin`,
      github: `${API}/auth/github`,
      verify: `${API}/auth/me`
    };
    const HOME = '/classroom';

    // Messages
    function showMessage(text, type = 'info') {
      const m = document.createElement('div');
      m.className = `message ${type}`;
      const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
      m.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}"></i><span>${text}</span>`;
      messageContainer.appendChild(m);
      const t = (text.includes('verification') || text.includes('check your email')) ? 5000 : 18000;
      const tid = setTimeout(() => { m.style.animation = 'fadeOut 0.5s ease-out forwards'; setTimeout(() => m.remove(), 500); }, t);
      m.dataset.tid = tid;
    }
    function clearMessages() {
      messageContainer.querySelectorAll('.message').forEach(m => { if (m.dataset.tid) clearTimeout(+m.dataset.tid); });
      messageContainer.innerHTML = '';
    }

    // ── ROLE SWITCH ──
    function switchRole(role) {
      selectedRole = role;
      document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
      document.querySelector(`[data-role="${role}"]`).classList.add('active');
      document.getElementById('roleSlider').classList.toggle('faculty', role === 'teacher');

      if (role === 'teacher') {
        // Title
        loginTitle.textContent = 'Faculty Login';
        loginSubtitle.textContent = 'Sign in to your faculty account';
        // Hide left panel, OAuth, footer
        brandPanel.style.display = 'none';
        loginOAuth.style.display = 'none';
        pageFooter.style.display = 'none';
        // Lock to Sign In tab only
        authToggle.classList.add('faculty-mode');
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
        loginToggle.classList.add('active');
        signupToggle.classList.remove('active');
        toggleSlider.classList.remove('signup');
      } else {
        // Restore
        loginTitle.textContent = 'Welcome Back';
        loginSubtitle.textContent = 'Sign in to your Classgrid account';
        brandPanel.style.display = '';
        loginOAuth.style.display = '';
        pageFooter.style.display = '';
        authToggle.classList.remove('faculty-mode');
      }
      clearMessages();
    }

    // Form toggle
    loginToggle.addEventListener('click', () => {
      if (selectedRole === 'teacher') return;
      loginToggle.classList.add('active'); signupToggle.classList.remove('active');
      toggleSlider.classList.remove('signup');
      signupForm.classList.remove('active');
      setTimeout(() => loginForm.classList.add('active'), 50);
      termsCheckboxContainer.classList.remove('show');
      clearMessages();
    });
    signupToggle.addEventListener('click', () => {
      if (selectedRole === 'teacher') return;
      signupToggle.classList.add('active'); loginToggle.classList.remove('active');
      toggleSlider.classList.add('signup');
      loginForm.classList.remove('active');
      setTimeout(() => { signupForm.classList.add('active'); termsCheckboxContainer.classList.add('show'); }, 50);
      clearMessages();
    });

    // Password toggle
    loginPasswordToggle.addEventListener('click', () => {
      const show = loginPassword.type === 'password';
      loginPassword.type = show ? 'text' : 'password';
      loginPasswordToggle.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });

    // Login
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = loginEmailInput.value.trim(), password = loginPassword.value;
      clearMessages();
      if (!email || !password) { showMessage('Please fill in all required fields', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMessage('Please enter a valid email address', 'error'); return; }
      loginBtn.disabled = true; loginBtnText.innerHTML = '<div class="loading"></div> Signing in...';
      try {
        const r = await fetch(EP.login, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, role: selectedRole }) });
        const d = await r.json();
        if (r.ok && d.token) {
          localStorage.setItem('jwt_token', d.token);
          localStorage.setItem('user', JSON.stringify(d.user));
          window.location.href = '/classroom';
        }
        else showMessage(d.message || 'Login failed. Please try again.', 'error');
      } catch { showMessage('Unable to connect to server. Please try again later.', 'error'); }
      finally { loginBtn.disabled = false; loginBtnText.textContent = 'Sign In'; }
    });

    // Signup
    signupForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = signupNameInput.value.trim(), email = signupEmailInput.value.trim();
      clearMessages();
      if (!name || !email) { showMessage('Name and email are required', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMessage('Please enter a valid email address', 'error'); return; }
      if (!termsCheckbox.checked) { showMessage('You must agree to the Terms of Service and Privacy Policy', 'error'); return; }
      lastSignupName = name; lastSignupEmail = email;
      signupBtn.disabled = true; signupBtnText.innerHTML = '<div class="loading"></div> Sending...';
      try {
        const r = await fetch(EP.signupInit, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, role: selectedRole }) });
        const d = await r.json();
        if (r.ok) {
          showMessage('Verification email sent! Check your inbox.', 'success');
          signupBtnText.innerHTML = '<i class="fas fa-check"></i> Email Sent';
          signupNameInput.disabled = signupEmailInput.disabled = termsCheckbox.disabled = true;
          // Resend / Change Email buttons
          const existing = document.getElementById('signupActions'); if (existing) existing.remove();
          const div = document.createElement('div'); div.id = 'signupActions'; div.style.cssText = 'display:flex;gap:10px;margin-top:15px;';
          const rb = document.createElement('button'); rb.type = 'button'; rb.className = 'submit-btn'; rb.style.cssText = 'flex:1;background:rgba(0,102,255,0.15);border:1px solid rgba(0,102,255,0.3);font-size:13px;padding:10px;'; rb.innerHTML = '<i class="fas fa-redo"></i> Resend Email';
          const cb = document.createElement('button'); cb.type = 'button'; cb.className = 'submit-btn'; cb.style.cssText = 'flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);font-size:13px;padding:10px;'; cb.innerHTML = '<i class="fas fa-edit"></i> Change Email';
          rb.addEventListener('click', async () => {
            clearMessages(); rb.disabled = true; rb.innerHTML = '<div class="loading"></div> Sending...';
            try { const r2 = await fetch(EP.signupInit, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: lastSignupName, email: lastSignupEmail }) }); const d2 = await r2.json(); showMessage(r2.ok ? 'Resent! Check your inbox.' : (d2.message || 'Could not resend.'), r2.ok ? 'success' : 'error'); } catch { showMessage('Unable to connect.', 'error'); }
            finally { rb.disabled = false; rb.innerHTML = '<i class="fas fa-redo"></i> Resend Email'; }
          });
          cb.addEventListener('click', () => { clearMessages(); div.remove(); signupNameInput.disabled = signupEmailInput.disabled = termsCheckbox.disabled = false; signupBtn.disabled = false; signupBtnText.textContent = 'Create Account'; signupEmailInput.focus(); signupEmailInput.select(); });
          div.appendChild(rb); div.appendChild(cb); signupBtn.parentNode.insertBefore(div, signupBtn.nextSibling);
        } else { showMessage(d.message || 'Signup failed.', 'error'); signupBtn.disabled = false; signupBtnText.textContent = 'Create Account'; }
      } catch { showMessage('Unable to connect to server.', 'error'); signupBtn.disabled = false; signupBtnText.textContent = 'Create Account'; }
    });

    // Reset password
    resetPasswordBtn.addEventListener('click', async () => {
      const email = loginEmailInput.value.trim(); clearMessages();
      if (!email) { showMessage('Enter your email address first', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMessage('Please enter a valid email address', 'error'); return; }
      resetPasswordBtn.disabled = true; resetPasswordBtnText.innerHTML = '<div class="loading"></div> Sending...';
      try {
        const r = await fetch(EP.forgotPassword, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
        const d = await r.json();
        showMessage(r.ok ? (d.message || 'Reset email sent. Check your inbox.') : (d.message || 'Reset failed.'), r.ok ? 'success' : 'error');
        if (r.ok) loginPassword.value = '';
      } catch { showMessage('Unable to connect to server.', 'error'); }
      finally { resetPasswordBtn.disabled = false; resetPasswordBtnText.textContent = 'Reset Password'; }
    });

    // OAuth
    document.getElementById('googleLoginBtn').addEventListener('click', () => { clearMessages(); window.location.href = EP.google; });
    document.getElementById('googleSignupBtn').addEventListener('click', () => { clearMessages(); window.location.href = EP.google; });
    document.getElementById('linkedinLoginBtn').addEventListener('click', () => { clearMessages(); window.location.href = EP.linkedin; });
    document.getElementById('linkedinSignupBtn').addEventListener('click', () => { clearMessages(); window.location.href = EP.linkedin; });
    document.getElementById('githubLoginBtn').addEventListener('click', () => { clearMessages(); window.location.href = EP.github; });
    document.getElementById('githubSignupBtn').addEventListener('click', () => { clearMessages(); window.location.href = EP.github; });

    // Support modal
    supportButton.addEventListener('click', () => { supportModal.classList.add('active'); document.body.style.overflow = 'hidden'; });
    closeModal.addEventListener('click', () => { supportModal.classList.remove('active'); document.body.style.overflow = ''; });
    supportModal.addEventListener('click', e => { if (e.target === supportModal) { supportModal.classList.remove('active'); document.body.style.overflow = ''; } });
    supportFormEl.addEventListener('submit', async e => {
      e.preventDefault(); const btn = supportFormEl.querySelector('.support-submit-btn'); const orig = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<div class="loading"></div> Sending...';
      try { const r = await fetch(supportFormEl.action, { method: 'POST', body: new FormData(supportFormEl), headers: { 'Accept': 'application/json' } }); if (r.ok) { showMessage('Support ticket submitted!', 'success'); supportFormEl.reset(); supportModal.classList.remove('active'); document.body.style.overflow = ''; } else showMessage('Failed to submit. Please try again.', 'error'); }
      catch { showMessage('Unable to submit.', 'error'); }
      finally { btn.disabled = false; btn.innerHTML = orig; }
    });

    // Email sync
    signupEmailInput.addEventListener('input', e => { const v = e.target.value.trim(); if (v) loginEmailInput.value = v; });
    loginEmailInput.addEventListener('input', e => { const v = e.target.value.trim(); if (v) signupEmailInput.value = v; });

    // Init
    (function init() {
      const p = new URLSearchParams(window.location.search);
      const token = p.get('token'), verified = p.get('verified'), error = p.get('error'), msg = p.get('message');
      if (token || verified || error) window.history.replaceState({}, document.title, window.location.pathname);

      if (token) {
        localStorage.setItem('jwt_token', token);
        showMessage('Login successful! Redirecting...', 'success');
        fetch(EP.verify, { headers: { 'Authorization': `Bearer ${token}` } })
          .then(r => r.json())
          .then(u => {
            setTimeout(() => window.location.href = '/classroom', 1500);
          })
          .catch(() => window.location.href = '/login');
        return;
      }
      if (verified) {
        try {
          const em = decodeURIComponent(verified);
          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
            loginEmailInput.value = signupEmailInput.value = em;
            showMessage('Email verified! Enter your password to login.', 'success');
            setTimeout(() => loginPassword.focus(), 300);
          }
        } catch { }
      }
      if (error) showMessage(msg || 'Authentication failed.', 'error');

      termsCheckboxContainer.classList.remove('show');

      const tok = localStorage.getItem('jwt_token');
      if (tok && !window.location.search.includes('logout')) {
        fetch(EP.verify, { headers: { 'Authorization': `Bearer ${tok}` } })
          .then(async r => {
            if (r.ok) {
              const u = await r.json();
              window.location.href = '/classroom';
            } else localStorage.removeItem('jwt_token');
          })
          .catch(() => { });
      }
      if (p.get('logout') === 'true') { localStorage.removeItem('jwt_token'); showMessage('Logged out successfully', 'success'); }
    })();

    // Disable devtools
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) e.preventDefault();
    });
  
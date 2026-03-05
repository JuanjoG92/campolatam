const isLogin = window.location.pathname.includes('login');

function selectRole(role, btn) {
  document.getElementById('selectedRole').value = role;
  document.querySelectorAll('.role-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

if (isLogin) {
  document.getElementById('loginForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const err = document.getElementById('errorMsg');
    btn.disabled = true;
    try {
      const data = await api('POST', '/auth/login', {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      }, false);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location = '/dashboard';
    } catch (ex) {
      err.textContent = ex.message; err.style.display = 'block';
      btn.disabled = false;
    }
  });
} else {
  // Register
  const urlRole = new URLSearchParams(window.location.search).get('role');
  if (urlRole) {
    const tab = document.querySelector('[data-role="' + urlRole + '"]');
    if (tab) selectRole(urlRole, tab);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const cSel = document.getElementById('country');
    if (cSel && Object.keys(countriesData).length) {
      Object.keys(countriesData).forEach(c => {
        const o = document.createElement('option');
        o.value = c; o.textContent = c; cSel.appendChild(o);
      });
    }
  });

  document.getElementById('registerForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const err = document.getElementById('errorMsg');
    btn.disabled = true;
    try {
      const data = await api('POST', '/auth/register', {
        email: document.getElementById('email').value,
        name: document.getElementById('name').value,
        password: document.getElementById('password').value,
        role: document.getElementById('selectedRole').value,
        country: document.getElementById('country').value,
        phone: document.getElementById('phone').value,
      }, false);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location = '/dashboard';
    } catch (ex) {
      err.textContent = ex.message; err.style.display = 'block';
      btn.disabled = false;
    }
  });
}

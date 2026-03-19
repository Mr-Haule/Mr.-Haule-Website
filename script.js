window.onload = function() {
  // Popup ya Omba Huduma
  const requestButtons = document.querySelectorAll('.service-card button, .hero-buttons button:first-child');
  const requestPopup = document.createElement('div');
  requestPopup.innerHTML = `
  <div id="requestForm" class="popup-form hidden">
    <div class="form-container">
      <h3>Omba Huduma</h3>
      <label>Jina:</label>
      <input type="text" id="name" placeholder="Jina lako" />
      <label>Email / Simu:</label>
      <input type="text" id="contact" placeholder="Email au Simu" />
      <label>Huduma Unayotaka:</label>
      <input type="text" id="service" placeholder="HESLB, RITA, NIDA..." />
      <button id="submitRequest">Tuma Request</button>
      <button id="closeForm">Funga</button>
    </div>
  </div>
  `;
  document.body.appendChild(requestPopup);

  // Elements ya Omba Huduma
  const popup = document.getElementById('requestForm');
  const closeBtn = document.getElementById('closeForm');
  const submitBtn = document.getElementById('submitRequest');

  requestButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      popup.classList.remove('hidden');
    });
  });

  closeBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
  });

  submitBtn.addEventListener('click', () => {
    alert('Request yako imetumwa! Tutawasiliana nawe hivi karibuni.');
    popup.classList.add('hidden');
  });

  // Popup ya Login/Register
  const loginBtn = document.querySelector('.auth-buttons button:first-child'); // Login
  const authPopup = document.getElementById('authForm');
  const authClose = document.getElementById('authClose');
  const authSwitch = document.getElementById('authSwitch');
  const formTitle = document.getElementById('formTitle');
  const authSubmit = document.getElementById('authSubmit');

  let isLogin = true;

  loginBtn.addEventListener('click', () => {
    authPopup.classList.remove('hidden');
  });

  authClose.addEventListener('click', () => {
    authPopup.classList.add('hidden');
  });

  authSwitch.addEventListener('click', () => {
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? 'Login' : 'Register';
    authSubmit.textContent = isLogin ? 'Ingiza' : 'Register';
    authSwitch.textContent = isLogin ? 'Register Badala ya Login' : 'Login Badala ya Register';
  });

  authSubmit.addEventListener('click', () => {
    const contact = document.getElementById('authContact').value;
    const password = document.getElementById('authPassword').value;

    if(contact && password){
      alert(isLogin ? `Umeingia kama ${contact}` : `Registered kama ${contact}`);
      authPopup.classList.add('hidden');
    } else {
      alert('Tafadhali jaza Email/Simu na Password');
    }
  });
};
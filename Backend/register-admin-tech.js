async function registerAdmin() {
  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/register-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Tech Admin',
        email: 'techm3022@gmail.com',
        password: 'Assurance@6'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin registered successfully');
      console.log('Email:', data.data.user.email);
      console.log('Role:', data.data.user.role);
    } else {
      console.log('❌ Registration failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

registerAdmin();

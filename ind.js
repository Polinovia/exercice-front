fetch('https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/jwt-auth/v1/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
	"username":"admin",
	"password":"Polina_2025!"
})
})
.then(response => response.json())
.then(data => {
  if (data.token) {
    // Stocker le token dans localStorage
    localStorage.setItem('authToken', data.token);
    console.log('Token enregistré dans localStorage');
  } else {
    console.error('Aucun token reçu');
  }
})
.catch(error => {
  console.error('Erreur lors de la connexion :', error);
});
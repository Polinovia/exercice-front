const $formPersonell = document.querySelector("#identification");
const $linkConnection = document.querySelector("#connection_link");
const $formConnection = document.querySelector("#connection");
const $navigation = document.querySelector("#navigation");
const $enterLink = document.querySelector("#enter-link");
const $exitLink = document.querySelector("#exit-link");
const $enterPage = document.querySelector("#enter");
const $exitPage = document.querySelector("#exit");
const $exitButton = document.querySelector("#exit_button");
const $connectionButton = document.querySelector("#connection_button");
const $againButton = document.querySelector("#visit_again");
const $identButton = document.querySelector("#idetification_valid");
const $token = localStorage.getItem("authToken");
const $emailExit = document.querySelector("#exit-email");
const $emailConnection = document.querySelector("#email_connection");
let visiteId = null;
  let html5QrcodeScanner = null;
let $id_user = null;

function SwitchPage(page1, page2, link1, link2) {
  page1.classList.remove("hidden");
  page2.classList.add("hidden");
  link1.classList.remove("link-active");
  link2.classList.add("link-active");
}

function GetDateTime () {
 const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  let hours = today.getHours();
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  
  return {
    date: `${yyyy}-${mm}-${dd}`,
    hour: `${hours}:${minutes} ${ampm}`
  };
}

async function GetVisitePostIdFromEmail(email) {
  const res = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/custom/v1/person-par-email?email=${encodeURIComponent(email)}`);
  const dataUser = await res.json();
    const resp = await fetch(` https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/custom/v1/visites-par-user?user=${dataUser[0].id}`);
  const dataVisit = await resp.json();
 
  console.log("Réponse visiteur :", dataVisit);
  // Exemple de retour : choisissez la bonne propriété !
  // return data[0].wp_post_id;  ✅ si l'ID WordPress est ici
  // ou
  return dataVisit[0].id; // ⚠️ seulement si c'est bien l'ID WordPress du post 'visites'
}

// Fonction appelée quand le code QR est scanné avec succès
function startQrScanner(elementId, onSuccessCallback) {
  const scanner = new Html5QrcodeScanner(
    elementId,
    { fps: 10, qrbox: { width: 250, height: 250 } },
    false
  );
  scanner.render(onSuccessCallback, onScanFailure);
  return scanner;
}

function onScanFailure(error) {
  console.warn(`Erreur scan QR: ${error}`);
}

window.addEventListener("DOMContentLoaded", () => {
  const selectedMotif = document.querySelector('input[name="motif"]:checked');
  if (selectedMotif) {
    const cpt = selectedMotif.value === "formation" ? "formation" : "personne";
    chargerListeCPT(cpt);
  }
});

//submit formulaire
$formPersonell.addEventListener("submit", async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  const formData = new FormData($formPersonell);
  const formUser = {};
  formData.forEach((value, name) => {
    formUser[name] = value;
  });

  console.log("Données à envoyer :", formUser);
  if (formUser.motif == "formation") {
 const response1 = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/formation/${formUser.list}`);
    const dataFormation = await response1.json();
      const { title_formation, location} = dataFormation.acf;
  const nom = formUser.lastname;
  const prenom = formUser.firstname;
  const email = formUser.email;
  const motif = title_formation;
  const localisation = location;

   const $qrData = `${email}`;

 const infoDiv = document.getElementById('visitor-info');
  const textEl = document.getElementById('visitor-text');
  textEl.innerHTML = `
  <p>Visiteur: ${prenom} ${nom}</p>
  <p>Email: ${email}</p> 
  <p>Motif: ${motif}</p> 
  <p>Local: ${localisation}</p>
  `;
 // infoDiv.classList.remove('hidden');

  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = ""; // Réinitialiser
 // qrContainer.classList.remove('hidden');

 new QRCode(qrContainer, {
  text: $qrData,
  width: 128,
  height: 128,
  correctLevel: QRCode.CorrectLevel.L, // Plus de données, moins de redondance
  version: 10 // ou plus si nécessaire, max = 40
});
  }
  if (formUser.motif == "visit") {
    const response2 = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/personne/${formUser.list}`);
    const dataPersonne = await response2.json();
      const { telephone, local} = dataPersonne.acf;
  const nom = formUser.lastname;
  const prenom = formUser.firstname;
  const email = formUser.email;
  const telephone_personne = telephone;
  const localisation = local;

  const $qrData = `${email}`;

 const infoDiv = document.getElementById('visitor-info');
  const textEl = document.getElementById('visitor-text');
  textEl.innerHTML = `
  <p>Visiteur: ${prenom} ${nom}</p> 
  <p>Email: ${email}</p> 
  <p>Telephone: ${telephone_personne}</p>
  <p>Local: ${localisation}</p>
  `;
  //infoDiv.classList.remove('hidden');


  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = ""; // Réinitialiser
 // qrContainer.classList.remove('hidden');

 new QRCode(qrContainer, {
  text: $qrData,
  width: 128,
  height: 128,
  correctLevel: QRCode.CorrectLevel.L, // Plus de données, moins de redondance
  version: 10 // ou plus si nécessaire, max = 40
});
  }


fetch("https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/visiteur", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + $token
  },
  body: JSON.stringify({
    title: `${formUser.firstname} ${formUser.lastname}`,
    status: "publish",
    fields: {
      firstname: formUser.firstname,
      lastname: formUser.lastname,
      email: formUser.email
    }
  })
})
.then(response => {
  if (!response.ok) {
    return response.text().then(text => {
      throw new Error(`Erreur HTTP ${response.status} : ${text}`);
    });
  }
  return response.json();
})
.then(data => {
  alert("Formulaire envoyé !");
  console.log("Réponse serveur :", data);
  $VisiteUser(data.id)
})
.catch(error => {
  console.error("Erreur :", error.message);
});
function $VisiteUser (id) {
const nowdateheure = GetDateTime();
fetch("https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/visites", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + $token
  },
  body: JSON.stringify({
    title: `visite-${id}`,
    status: "publish",
    fields: {
      visites_visiteur: id,
			date_enter: nowdateheure.date,
		  hour_enter: nowdateheure.hour,
			motif_visite: [
				formUser.list
			]
    }
  })
})
.then(response => {
  if (!response.ok) {
    return response.text().then(text => {
      throw new Error(`Erreur HTTP ${response.status} : ${text}`);
    });
  }  
    window.print();
    $formPersonell.reset()
  return response.json();
})}
});

//changer les pages Entree et Sortie
$navigation.addEventListener("click", (e) => {
  e.preventDefault();
  if ($exitPage.classList.contains("hidden")) SwitchPage($exitPage, $enterPage, $enterLink, $exitLink);
  else SwitchPage($enterPage, $exitPage, $exitLink, $enterLink);
  $formConnection.classList.add("hidden");
});

//Afficher notre form connection
$linkConnection.addEventListener("click", (e) => {
  e.preventDefault();
  $formConnection.classList.remove("hidden"); 
});

//Exit button
$exitButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const emailInput = $emailExit.value.trim();
  
  
  if (emailInput) {
    // Si email est fourni manuellement
    const now = GetDateTime();
    const visiteId = await GetVisitePostIdFromEmail(emailInput);
    
      const updateRes = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/visites/${visiteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${$token}`
        },
        body: JSON.stringify({
          title: `visite-${visiteId}`,
          fields: {
            hour_partir: now.hour
          }
        })
      });
console.log(updateRes);
      if (updateRes.ok) {
        alert("Sortie enregistrée avec succès !");
      } else {
        alert("Erreur lors de la mise à jour de la visite.");
      }
    } else {
    // 📷 Démarre le scanner
    document.getElementById("reader-exit").classList.remove("hidden");

    html5QrcodeScanner = startQrScanner("reader-exit", async function(decodedText, decodedResult) {
      document.getElementById("reader-exit").classList.add("hidden");
      html5QrcodeScanner.clear();

      const email = decodedText;
      const now = GetDateTime();
      const visiteId = await GetVisitePostIdFromEmail(email);

      if (visiteId) {
        const updateRes = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/visites/${visiteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${$token}`
          },
          body: JSON.stringify({
            title: `visite-${visiteId}`,
            fields: {
              hour_partir: now.hour
            }
          })
        });

        if (updateRes.ok) {
          alert("Sortie enregistrée avec succès !");
        } else {
          alert("Erreur lors de la mise à jour de la sortie.");
        }
      } else {
        alert("Visiteur non trouvé.");
      }
    });
  }
});

//Connection button
  $connectionButton.addEventListener('click', async(e)=> {
  e.preventDefault();

  const emailVal = $emailConnection.value.trim();
  if (emailVal) {
    // Connexion manuelle par email
    const res = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/custom/v1/person-par-email?email=${emailVal}`);
    const data = await res.json();
    const resp = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/visiteur/${data[0].id}`);
    $id_user = data[0].id;
    const userData = await resp.json();
    const { firstname, lastname, email: userEmail } = userData.acf;

    $formPersonell.querySelector('[name="firstname"]').value = firstname || '';
    $formPersonell.querySelector('[name="lastname"]').value = lastname || '';
    $formPersonell.querySelector('[name="email"]').value = userEmail || '';

    $againButton.classList.remove("hidden");
    $identButton.classList.add("hidden");
    $linkConnection.classList.add("hidden");
    $formConnection.classList.add("hidden");
  } else {
    // 📷 Démarre scanner
    document.getElementById("reader-connection").classList.remove("hidden");

    html5QrcodeScanner = startQrScanner("reader-connection", async function(decodedText, decodedResult) {
      document.getElementById("reader-connection").classList.add("hidden");
      html5QrcodeScanner.clear();

      const email = decodedText;

      // 🎯 Récupère l'utilisateur via email
      const res = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/custom/v1/person-par-email?email=${email}`);
      const data = await res.json();
      const userDataRes = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/visiteur/${data[0].id}`);
      const userData = await userDataRes.json();
      const { firstname, lastname, email: userEmail } = userData.acf;

      $id_user = data[0].id;

      $formPersonell.querySelector('[name="firstname"]').value = firstname || '';
      $formPersonell.querySelector('[name="lastname"]').value = lastname || '';
      $formPersonell.querySelector('[name="email"]').value = userEmail || '';

      $againButton.classList.remove("hidden");
      $identButton.classList.add("hidden");
      $linkConnection.classList.add("hidden");
      $formConnection.classList.add("hidden");
    });
  }
});

//Create un visite avec user deja cree
 $againButton.addEventListener('click', e => {
     const formData = new FormData($formPersonell);
  const formUser = {};
  formData.forEach((value, name) => {
    formUser[name] = value;
  });

  const nowdateheure = GetDateTime();
fetch("https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/visites", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + $token
  },
  body: JSON.stringify({
    title: `visite-${$id_user}`,
    status: "publish",
    fields: {
      visites_visiteur: $id_user,
			date_enter: nowdateheure.date,
		  hour_enter: nowdateheure.hour,
			motif_visite: [
				formUser.list
			]
    }
  })
})
$formPersonell.reset();
 })


// Récupérer les éléments
const selectMotif = document.querySelector('input[name="motif"]:checked');
const selectList = document.getElementById("list");

// Fonction pour charger les posts CPT via REST API
function chargerListeCPT(cpt) {
  // Clear options
  selectList.innerHTML = "";

  fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/${cpt}`)
    .then((response) => response.json())
    .then((posts) => {
      posts.forEach((post) => {
        const option = document.createElement("option");
        option.value = post.id; // ou post.slug si tu préfères
        option.textContent = post.title.rendered;
        selectList.appendChild(option);
      });
    })
    .catch((err) => {
      console.error("Erreur chargement posts:", err);
    });
}

// Écouteur sur changement des radios "motif"
document.querySelectorAll('input[name="motif"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const motifChoisi = e.target.value;
    if (motifChoisi === "formation") {
      chargerListeCPT("formation");
    } else if (motifChoisi === "visit") {
      chargerListeCPT("personne");
    }
  });
});


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


$navigation.addEventListener("click", (e) => {
  e.preventDefault();
  if ($exitPage.classList.contains("hidden")) SwitchPage($exitPage, $enterPage, $enterLink, $exitLink);
  else SwitchPage($enterPage, $exitPage, $exitLink, $enterLink);
  $formConnection.classList.add("hidden");
});

$linkConnection.addEventListener("click", (e) => {
  e.preventDefault();
  $formConnection.classList.remove("hidden"); 
});

$formPersonell.addEventListener("submit", async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  const formData = new FormData($formPersonell);
  const formUser = {};
  formData.forEach((value, name) => {
    formUser[name] = value;
  });

  console.log("Données à envoyer :", formUser);
 const response = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/formation/${formUser.list}`);
    const dataFormation = await response.json();
      const { title_formation, location} = dataFormation.acf;
  const nom = formUser.lastname;
  const prenom = formUser.firstname;
  const email = formUser.email;
  const motif = title_formation;
  const localisation = location;

const qrData = `${nom} ${prenom} - ${email} (${motif})`;

 const infoDiv = document.getElementById('visitor-info');
  const textEl = document.getElementById('visitor-text');
  textEl.textContent = `Visiteur: ${prenom} ${nom}, Email: ${email}, Motif: ${motif}, Local: ${localisation}`;
  infoDiv.classList.remove('hidden');

  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = ""; // Réinitialiser
  qrContainer.classList.remove('hidden');

 new QRCode(qrContainer, {
  text: qrData,
  width: 128,
  height: 128,
  correctLevel: QRCode.CorrectLevel.L, // Plus de données, moins de redondance
  version: 10 // ou plus si nécessaire, max = 40
});

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
  return response.json();
})}
})

$exitButton.addEventListener('click', async(e)=> {
  const nowdateheure = GetDateTime();
   visiteId = await GetVisitePostIdFromEmail($emailExit.value);
   
    // Step 2: Update visite with current hour_partir
    console.log("id: "+ visiteId)
    if(visiteId) {
    const updateRes = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/visites/${visiteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${$token}`,
        "Accept": "application/json"
      },
      body: JSON.stringify({
        title: `visite-${visiteId}`,
        fields: {
          hour_partir: nowdateheure.hour
        }
      })
    });
    console.log(await updateRes.json());

    if (updateRes.ok) {
      alert("Heure de sortie enregistrée avec succès !");
    } else {
      alert("Erreur lors de la mise à jour.");
    }
  }
  else {
    alert('Qui êtes vous ?')
  }
  } )


  $connectionButton.addEventListener('click', async(e)=> {
    const res = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/custom/v1/person-par-email?email=${$emailConnection.value}`);
    const data = await res.json();
    console.log(data);
    const resp = await fetch(`https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/visiteur/${data[0].id}`);
    $id_user = data[0].id;
    const userData = await resp.json();
    console.log(userData);
     const { firstname, lastname, email: userEmail } = userData.acf;

    // Remplir le formulaire #identification
    $formPersonell.querySelector('[name="firstname"]').value = firstname || '';
    $formPersonell.querySelector('[name="lastname"]').value = lastname || '';
    $formPersonell.querySelector('[name="email"]').value = userEmail || '';
    $againButton.classList.remove("hidden");
    $identButton.classList.add("hidden");
    $linkConnection.classList.add("hidden");
    $formConnection.classList.add("hidden"); 
    
  });

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

// Au chargement, si un motif est déjà coché, on charge la liste correspondante
window.addEventListener("DOMContentLoaded", () => {
  const selectedMotif = document.querySelector('input[name="motif"]:checked');
  if (selectedMotif) {
    const cpt = selectedMotif.value === "formation" ? "formation" : "personne";
    chargerListeCPT(cpt);
  }
});

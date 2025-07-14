const $formPersonell = document.querySelector("#identification");
const $linkConnection = document.querySelector("#connection_link");
const $formConnection = document.querySelector("#connection");
const $navigation = document.querySelector("#navigation");
const $enterLink = document.querySelector("#enter-link");
const $exitLink = document.querySelector("#exit-link");
const $enterPage = document.querySelector("#enter");
const $exitPage = document.querySelector("#exit");

function SwitchPage(page1, page2, link1, link2) {
  page1.classList.remove("hidden");
  page2.classList.add("hidden");
  link1.classList.remove("link-active");
  link2.classList.add("link-active");
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

$formPersonell.addEventListener("submit", (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  const formData = new FormData($formPersonell);
  const object = {};
  formData.forEach((value, name) => {
    object[name] = value;
  });

  console.log("Données à envoyer :", object);
fetch("https://ingrwf12.cepegra-frontend.xyz/wp_polina/wp-json/wp/v2/visiteur", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("authToken")
  },
  body: JSON.stringify({
    title: object.firstname,
    status: "publish",
    fields: {
      firstname: object.firstname,
      lastname: object.lastname,
      email: object.email
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
})
.catch(error => {
  console.error("Erreur :", error.message);
});
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

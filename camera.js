navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    console.log("Caméra OK");
  })
  .catch((err) => {
    console.error("Erreur accès caméra :", err);
  });
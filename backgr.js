particlesJS("particles-js", {
  particles: {
    number: { value: 60 },
    color: { value: "#a974ff" },
    shape: { type: "circle" },
    opacity: { value: 0.4 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 130,
      color: "#a974ff",
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 1.2,
      direction: "none",
      out_mode: "bounce"
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 80 },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});
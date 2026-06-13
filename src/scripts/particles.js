import { tsParticles } from "tsparticles-engine";
import { loadFull } from "tsparticles";

const options = {
	fullScreen: { enable: false },
	fpsLimit: 60,
	particles: {
		number: { value: 50, density: { enable: true, area: 800 } },
		color: { value: "#ffffff" },
		shape: { type: "circle" },
		opacity: { value: 0.4, random: { enable: true, minimumValue: 0.1 } },
		size: { value: { min: 1, max: 4 }, random: true },
		move: {
			enable: true,
			speed: 1.5,
			direction: "none",
			outModes: { default: "out" },
		},
		links: {
			enable: true,
			distance: 120,
			color: "#ffffff",
			opacity: 0.15,
			width: 1,
		},
	},
	interactivity: {
		events: {
			onHover: { enable: true, mode: "grab" },
			onClick: { enable: true, mode: "push" },
		},
		modes: {
			grab: { distance: 140, links: { opacity: 0.5 } },
			push: { quantity: 4 },
		},
	},
	detectRetina: true,
	background: { color: "transparent" },
};

loadFull(tsParticles).then(() => {
	tsParticles.load("particles-container", options);
});
console.clear();

const { gsap, imagesLoaded } = window;

const buttons = {
	prev: document.querySelector(".btn--left"),
	next: document.querySelector(".btn--right"),
};
const cartsContainerEl = document.querySelector(".carts__wrapper");
const appBgContainerEl = document.querySelector(".app__bg");

const cartInfosContainerEl = document.querySelector(".info__wrapper");

buttons.next.addEventListener("click", () => swapcarts("right"));

buttons.prev.addEventListener("click", () => swapcarts("left"));

function swapcarts(direction) {
	const currentcartEl = cartsContainerEl.querySelector(".current--cart");
	const previouscartEl = cartsContainerEl.querySelector(".previous--cart");
	const nextcartEl = cartsContainerEl.querySelector(".next--cart");

	const currentBgImageEl = appBgContainerEl.querySelector(".current--image");
	const previousBgImageEl = appBgContainerEl.querySelector(".previous--image");
	const nextBgImageEl = appBgContainerEl.querySelector(".next--image");

	changeInfo(direction);
	swapcartsClass();

	removecartEvents(currentcartEl);

	function swapcartsClass() {
		currentcartEl.classList.remove("current--cart");
		previouscartEl.classList.remove("previous--cart");
		nextcartEl.classList.remove("next--cart");

		currentBgImageEl.classList.remove("current--image");
		previousBgImageEl.classList.remove("previous--image");
		nextBgImageEl.classList.remove("next--image");

		currentcartEl.style.zIndex = "50";
		currentBgImageEl.style.zIndex = "-2";

		if (direction === "right") {
			previouscartEl.style.zIndex = "20";
			nextcartEl.style.zIndex = "30";

			nextBgImageEl.style.zIndex = "-1";

			currentcartEl.classList.add("previous--cart");
			previouscartEl.classList.add("next--cart");
			nextcartEl.classList.add("current--cart");

			currentBgImageEl.classList.add("previous--image");
			previousBgImageEl.classList.add("next--image");
			nextBgImageEl.classList.add("current--image");
		} else if (direction === "left") {
			previouscartEl.style.zIndex = "30";
			nextcartEl.style.zIndex = "20";

			previousBgImageEl.style.zIndex = "-1";

			currentcartEl.classList.add("next--cart");
			previouscartEl.classList.add("current--cart");
			nextcartEl.classList.add("previous--cart");

			currentBgImageEl.classList.add("next--image");
			previousBgImageEl.classList.add("current--image");
			nextBgImageEl.classList.add("previous--image");
		}
	}
}

function changeInfo(direction) {
	let currentInfoEl = cartInfosContainerEl.querySelector(".current--info");
	let previousInfoEl = cartInfosContainerEl.querySelector(".previous--info");
	let nextInfoEl = cartInfosContainerEl.querySelector(".next--info");

	gsap.timeline()
		.to([buttons.prev, buttons.next], {
			duration: 0.2,
			opacity: 0.5,
			pointerEvents: "none",
		})
		.to(
			currentInfoEl.querySelectorAll(".text"),
			{
				duration: 0.4,
				stagger: 0.1,
				translateY: "-120px",
				opacity: 0,
			},
			"-="
		)
		.call(() => {
			swapInfosClass(direction);
		})
		.call(() => initcartEvents())
		.fromTo(
			direction === "right"
				? nextInfoEl.querySelectorAll(".text")
				: previousInfoEl.querySelectorAll(".text"),
			{
				opacity: 0,
				translateY: "40px",
			},
			{
				duration: 0.4,
				stagger: 0.1,
				translateY: "0px",
				opacity: 1,
			}
		)
		.to([buttons.prev, buttons.next], {
			duration: 0.2,
			opacity: 1,
			pointerEvents: "all",
		});

	function swapInfosClass() {
		currentInfoEl.classList.remove("current--info");
		previousInfoEl.classList.remove("previous--info");
		nextInfoEl.classList.remove("next--info");

		if (direction === "right") {
			currentInfoEl.classList.add("previous--info");
			nextInfoEl.classList.add("current--info");
			previousInfoEl.classList.add("next--info");
		} else if (direction === "left") {
			currentInfoEl.classList.add("next--info");
			nextInfoEl.classList.add("previous--info");
			previousInfoEl.classList.add("current--info");
		}
	}
}

function updatecart(e) {
	const cart = e.currentTarget;
	const box = cart.getBoundingClientRect();
	const centerPosition = {
		x: box.left + box.width / 2,
		y: box.top + box.height / 2,
	};
	let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
	gsap.set(cart, {
		"--current-cart-rotation-offset": `${angle}deg`,
	});
	const currentInfoEl = cartInfosContainerEl.querySelector(".current--info");
	gsap.set(currentInfoEl, {
		rotateY: `${angle}deg`,
	});
}

function resetcartTransforms(e) {
	const cart = e.currentTarget;
	const currentInfoEl = cartInfosContainerEl.querySelector(".current--info");
	gsap.set(cart, {
		"--current-cart-rotation-offset": 0,
	});
	gsap.set(currentInfoEl, {
		rotateY: 0,
	});
}

function initcartEvents() {
	const currentcartEl = cartsContainerEl.querySelector(".current--cart");
	currentcartEl.addEventListener("pointermove", updatecart);
	currentcartEl.addEventListener("pointerout", (e) => {
		resetcartTransforms(e);
	});
}

initcartEvents();

function removecartEvents(cart) {
	cart.removeEventListener("pointermove", updatecart);
}

function init() {

	let tl = gsap.timeline();

	tl.to(cartsContainerEl.children, {
		delay: 0.15,
		duration: 0.5,
		stagger: {
			ease: "power4.inOut",
			from: "right",
			amount: 0.1,
		},
		"--cart-translateY-offset": "0%",
	})
		.to(cartInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
			delay: 0.5,
			duration: 0.4,
			stagger: 0.1,
			opacity: 1,
			translateY: 0,
		})
		.to(
			[buttons.prev, buttons.next],
			{
				duration: 0.4,
				opacity: 1,
				pointerEvents: "all",
			},
			"-=0.4"
		);
}

const waitForImages = () => {
	const images = [...document.querySelectorAll("img")];
	const totalImages = images.length;
	let loadedImages = 0;
	const loaderEl = document.querySelector(".loader span");

	gsap.set(cartsContainerEl.children, {
		"--cart-translateY-offset": "100vh",
	});
	gsap.set(cartInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
		translateY: "40px",
		opacity: 0,
	});
	gsap.set([buttons.prev, buttons.next], {
		pointerEvents: "none",
		opacity: "0",
	});

	images.forEach((image) => {
		imagesLoaded(image, (instance) => {
			if (instance.isComplete) {
				loadedImages++;
				let loadProgress = loadedImages / totalImages;

				gsap.to(loaderEl, {
					duration: 1,
					scaleX: loadProgress,
					backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
				});

				if (totalImages == loadedImages) {
					gsap.timeline()
						.to(".loading__wrapper", {
							duration: 0.8,
							opacity: 0,
							pointerEvents: "none",
						})
						.call(() => init());
				}
			}
		});
	});
};

waitForImages();
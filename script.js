const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];


/* =========================================
   YEAR
========================================= */

$("#year").textContent = new Date().getFullYear();


/* =========================================
   CURSOR GLOW
========================================= */

const glow = $(".cursor-glow");

if (glow) {
    addEventListener("pointermove", e => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
    });
}


/* =========================================
   MOBILE MENU
========================================= */

const menu = $(".menu");
const mobileNav = $(".mobile-nav");

if (menu && mobileNav) {

    menu.addEventListener("click", () => {
        mobileNav.classList.toggle("open");
    });

    $$(".mobile-nav a").forEach(link => {

        link.addEventListener("click", () => {
            mobileNav.classList.remove("open");
        });

    });
}


/* =========================================
   REVEAL ANIMATIONS
========================================= */

const revealObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.1
    }
);

$$(".reveal").forEach(element => {
    revealObserver.observe(element);
});


/* =========================================
   PROJECT FILTERS
========================================= */

const filters = $$(".filters button");
const cards = $$(".project-card");

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filters.forEach(button => {
            button.classList.remove("active");
        });

        filter.classList.add("active");

        const selectedCategory = filter.dataset.filter;

        cards.forEach(card => {

            const category = card.dataset.category;

            const show =
                selectedCategory === "all" ||
                category === selectedCategory;

            card.classList.toggle("hide", !show);

        });

    });

});


/* =========================================
   PROJECT IMAGE PROTECTION
   Detect portrait/mobile screenshots
========================================= */

$$(".project-image img").forEach(image => {

    const detectImageType = () => {

        if (
            image.naturalWidth > 0 &&
            image.naturalHeight > 0
        ) {

            if (
                image.naturalHeight >
                image.naturalWidth * 1.15
            ) {

                image.classList.add("portrait-image");

            } else {

                image.classList.remove("portrait-image");

            }

        }

    };


    if (image.complete) {
        detectImageType();
    }

    image.addEventListener(
        "load",
        detectImageType
    );

});


/* =========================================
   PROJECT MODAL
========================================= */

const modal = $(".modal");

const modalImage = $("#mimg");
const modalTitle = $("#mtitle");
const modalDescription = $("#mdesc");
const modalStack = $("#mstack");
const modalLink = $("#mlink");

const modalThumbs = $("#mthumbs");
const modalCounter = $("#mcount");

const previousButton = $(".gallery-prev");
const nextButton = $(".gallery-next");

let currentImages = [];
let currentImageIndex = 0;


/* =========================================
   GET PROJECT IMAGES
========================================= */

function getProjectImages(card) {

    /*
       If data-images exists, use it.

       Example:

       data-images="
          images/NUVEXA_App/1.png,
          images/NUVEXA_App/2.png,
          images/NUVEXA_App/3.png
       "

       If it doesn't exist, automatically
       use the current data-image.
    */

    if (card.dataset.images) {

        return card.dataset.images
            .split(",")
            .map(image => image.trim())
            .filter(Boolean);

    }

    return card.dataset.image
        ? [card.dataset.image]
        : [];

}


/* =========================================
   OPEN PROJECT
========================================= */

$$(".details").forEach(button => {

    button.addEventListener("click", () => {

        const card = button.closest(".project-card");

        if (!card) return;


        currentImages = getProjectImages(card);

        currentImageIndex = 0;


        modalTitle.textContent =
            card.dataset.title || "";


        modalDescription.textContent =
            card.dataset.description || "";


        modalStack.textContent =
            card.dataset.stack || "";


        modalLink.href =
            card.dataset.link || "#";


        buildGallery();


        modal.classList.add("open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );

    });

});


/* =========================================
   BUILD GALLERY
========================================= */

function buildGallery() {

    modalThumbs.innerHTML = "";


    currentImages.forEach((image, index) => {

        const thumbnail =
            document.createElement("button");


        thumbnail.type = "button";

        thumbnail.className =
            "gallery-thumb";


        if (index === currentImageIndex) {
            thumbnail.classList.add("active");
        }


        const thumbnailImage =
            document.createElement("img");


        thumbnailImage.src = image;

        thumbnailImage.alt =
            `Project screenshot ${index + 1}`;

        thumbnailImage.loading = "lazy";


        thumbnail.appendChild(
            thumbnailImage
        );


        thumbnail.addEventListener(
            "click",
            () => {

                currentImageIndex = index;

                updateGallery();

            }
        );


        modalThumbs.appendChild(
            thumbnail
        );

    });


    updateGallery();

}


/* =========================================
   UPDATE GALLERY
========================================= */

function updateGallery() {

    if (!currentImages.length) {

        modalImage.removeAttribute("src");

        modalCounter.style.display = "none";

        previousButton.style.display = "none";

        nextButton.style.display = "none";

        return;

    }


    modalImage.style.opacity = "0";


    setTimeout(() => {

        modalImage.src =
            currentImages[currentImageIndex];

        modalImage.alt =
            `Project screenshot ${
                currentImageIndex + 1
            }`;

        modalImage.style.opacity = "1";

    }, 100);


    const total =
        currentImages.length;


    modalCounter.textContent =
        `${currentImageIndex + 1} / ${total}`;


    const hasMultipleImages =
        total > 1;


    previousButton.style.display =
        hasMultipleImages ? "flex" : "none";


    nextButton.style.display =
        hasMultipleImages ? "flex" : "none";


    modalCounter.style.display =
        hasMultipleImages ? "block" : "none";


    $$(".gallery-thumb").forEach(
        (thumbnail, index) => {

            thumbnail.classList.toggle(
                "active",
                index === currentImageIndex
            );

        }
    );

}


/* =========================================
   PREVIOUS
========================================= */

previousButton.addEventListener(
    "click",
    () => {

        if (currentImages.length <= 1) {
            return;
        }


        currentImageIndex--;


        if (currentImageIndex < 0) {

            currentImageIndex =
                currentImages.length - 1;

        }


        updateGallery();

    }
);


/* =========================================
   NEXT
========================================= */

nextButton.addEventListener(
    "click",
    () => {

        if (currentImages.length <= 1) {
            return;
        }


        currentImageIndex++;


        if (
            currentImageIndex >=
            currentImages.length
        ) {

            currentImageIndex = 0;

        }


        updateGallery();

    }
);


/* =========================================
   CLOSE MODAL
========================================= */

function closeProjectModal() {

    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


$(".close").addEventListener(
    "click",
    closeProjectModal
);


$(".backdrop").addEventListener(
    "click",
    closeProjectModal
);


/* =========================================
   KEYBOARD CONTROLS
========================================= */

addEventListener(
    "keydown",
    event => {

        if (!modal.classList.contains("open")) {
            return;
        }


        if (event.key === "Escape") {

            closeProjectModal();

        }


        if (event.key === "ArrowLeft") {

            previousButton.click();

        }


        if (event.key === "ArrowRight") {

            nextButton.click();

        }

    }
);


/* =========================================
   ACTIVE NAVIGATION
========================================= */

const navLinks = $$("nav a");
const sections = $$("main section[id]");


const sectionObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    navLinks.forEach(link => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") ===
                            "#" + entry.target.id
                        );

                    });

                }

            });

        },

        {
            rootMargin:
                "-35% 0px -55%"
        }

    );


sections.forEach(section => {
    sectionObserver.observe(section);
});

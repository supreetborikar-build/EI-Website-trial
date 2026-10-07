/* ==========================================================
   ENGINEERING INDIA
   JAVASCRIPT
   ========================================================== */


/* ==========================================================
   COUNTDOWN TIMER
   ========================================================== */

const targetDate =
    new Date("December 15, 2026 09:00:00").getTime();


function updateCountdown() {

    const now =
        new Date().getTime();

    const distance =
        targetDate - now;


    if (distance <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;

    }


    const days =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (distance %
                (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (distance %
                (1000 * 60 * 60)) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (distance %
                (1000 * 60)) /
            1000
        );


    const daysElement =
        document.getElementById("days");

    const hoursElement =
        document.getElementById("hours");

    const minutesElement =
        document.getElementById("minutes");

    const secondsElement =
        document.getElementById("seconds");


    if (daysElement) {

        daysElement.textContent =
            String(days).padStart(2, "0");

    }


    if (hoursElement) {

        hoursElement.textContent =
            String(hours).padStart(2, "0");

    }


    if (minutesElement) {

        minutesElement.textContent =
            String(minutes).padStart(2, "0");

    }


    if (secondsElement) {

        secondsElement.textContent =
            String(seconds).padStart(2, "0");

    }

}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* ==========================================================
   ANIMATED COUNTERS
   ========================================================== */

const counters =
    document.querySelectorAll(".number");


if (counters.length > 0) {

    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const counter =
                        entry.target;


                    const target =
                        Number(
                            counter.dataset.count
                        );


                    let current = 0;


                    const duration = 1600;

                    const startTime =
                        performance.now();


                    function animateCounter(
                        currentTime
                    ) {

                        const elapsed =
                            currentTime -
                            startTime;


                        const progress =
                            Math.min(
                                elapsed /
                                duration,
                                1
                            );


                        const easedProgress =
                            1 -
                            Math.pow(
                                1 - progress,
                                3
                            );


                        current =
                            Math.floor(
                                easedProgress *
                                target
                            );


                        counter.textContent =
                            current.toLocaleString();


                        if (progress < 1) {

                            requestAnimationFrame(
                                animateCounter
                            );

                        }

                        else {

                            counter.textContent =
                                target.toLocaleString();

                        }

                    }


                    requestAnimationFrame(
                        animateCounter
                    );


                    counterObserver.unobserve(
                        counter
                    );

                });

            },
            {
                threshold: 0.4
            }
        );


    counters.forEach(counter => {

        counterObserver.observe(
            counter
        );

    });

}


/* ==========================================================
   FEATURED / MEGA EVENT SWIPE
   ========================================================== */

const megaSlides =
    document.querySelectorAll(".mega-slide");


const megaDots =
    document.querySelectorAll(".mega-dot");


const megaNext =
    document.querySelector(".mega-next");


const megaPrev =
    document.querySelector(".mega-prev");


let currentMegaSlide = 0;


function showMegaSlide(index) {

    if (megaSlides.length === 0) {
        return;
    }


    if (index >= megaSlides.length) {

        currentMegaSlide = 0;

    }

    else if (index < 0) {

        currentMegaSlide =
            megaSlides.length - 1;

    }

    else {

        currentMegaSlide = index;

    }


    megaSlides.forEach(
        (slide, i) => {

            slide.classList.toggle(
                "active",
                i === currentMegaSlide
            );

        }
    );


    megaDots.forEach(
        (dot, i) => {

            dot.classList.toggle(
                "active",
                i === currentMegaSlide
            );

        }
    );

}


/* NEXT */

if (megaNext) {

    megaNext.addEventListener(
        "click",
        () => {

            showMegaSlide(
                currentMegaSlide + 1
            );

            resetMegaAutoPlay();

        }
    );

}


/* PREVIOUS */

if (megaPrev) {

    megaPrev.addEventListener(
        "click",
        () => {

            showMegaSlide(
                currentMegaSlide - 1
            );

            resetMegaAutoPlay();

        }
    );

}


/* DOTS */

megaDots.forEach(
    (dot, index) => {

        dot.addEventListener(
            "click",
            () => {

                showMegaSlide(index);

                resetMegaAutoPlay();

            }
        );

    }
);


/* ==========================================================
   AUTO SLIDE
   ========================================================== */

let megaAutoPlay =
    setInterval(
        () => {

            showMegaSlide(
                currentMegaSlide + 1
            );

        },
        6000
    );


function resetMegaAutoPlay() {

    clearInterval(
        megaAutoPlay
    );


    megaAutoPlay =
        setInterval(
            () => {

                showMegaSlide(
                    currentMegaSlide + 1
                );

            },
            6000
        );

}


/* ==========================================================
   TOUCH SWIPE FOR MEGA EVENTS
   ========================================================== */

const megaCarousel =
    document.querySelector(
        ".mega-carousel-track"
    );


let touchStartX = 0;

let touchEndX = 0;


if (megaCarousel) {

    megaCarousel.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


    megaCarousel.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0].screenX;


            const swipeDistance =
                touchStartX -
                touchEndX;


            if (
                Math.abs(
                    swipeDistance
                ) < 50
            ) {

                return;

            }


            if (swipeDistance > 0) {

                showMegaSlide(
                    currentMegaSlide + 1
                );

            }

            else {

                showMegaSlide(
                    currentMegaSlide - 1
                );

            }


            resetMegaAutoPlay();

        },
        {
            passive: true
        }
    );

}


/* ==========================================================
   SEARCH EVENTS
   ========================================================== */

const searchInput =
    document.getElementById(
        "searchInput"
    );


const eventCards =
    document.querySelectorAll(
        ".event-card"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const value =
                searchInput.value
                    .toLowerCase()
                    .trim();


            eventCards.forEach(card => {

                const titleElement =
                    card.querySelector(
                        ".event-title"
                    );


                const descriptionElement =
                    card.querySelector(
                        ".event-description"
                    );


                const title =
                    titleElement
                        ? titleElement.textContent
                            .toLowerCase()
                        : "";


                const description =
                    descriptionElement
                        ? descriptionElement.textContent
                            .toLowerCase()
                        : "";


                if (
                    title.includes(value) ||
                    description.includes(value)
                ) {

                    card.style.display =
                        "flex";

                }

                else {

                    card.style.display =
                        "none";

                }

            });

        }
    );

}


/* ==========================================================
   EVENT FILTER BUTTONS
   ========================================================== */

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter;


                eventCards.forEach(
                    card => {

                        const category =
                            card.dataset.category;


                        if (
                            filter === "all" ||
                            category === filter
                        ) {

                            card.style.display =
                                "flex";

                        }

                        else {

                            card.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    }
);


/* ==========================================================
   LOAD MORE EVENTS
   ========================================================== */

const loadMoreBtn =
    document.getElementById(
        "loadMoreBtn"
    );


if (loadMoreBtn) {

    loadMoreBtn.addEventListener(
        "click",
        () => {

            const hiddenCards =
                document.querySelectorAll(
                    ".hidden-card"
                );


            let shown = 0;


            hiddenCards.forEach(
                card => {

                    if (
                        shown < 3
                    ) {

                        card.style.display =
                            "flex";

                        card.classList.remove(
                            "hidden-card"
                        );

                        shown++;

                    }

                }
            );


            const remainingCards =
                document.querySelectorAll(
                    ".hidden-card"
                );


            if (
                remainingCards.length === 0
            ) {

                loadMoreBtn.textContent =
                    "All Events Loaded ✓";


                loadMoreBtn.disabled =
                    true;


                loadMoreBtn.style.opacity =
                    "0.6";


                loadMoreBtn.style.cursor =
                    "not-allowed";

            }

        }
    );

}


/* ==========================================================
   REGISTER BUTTON
   ========================================================== */

const registerButtons =
    document.querySelectorAll(
        ".btn-small.primary"
    );


registerButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const originalText =
                    button.textContent;


                button.textContent =
                    "Registered ✓";


                button.style.background =
                    "linear-gradient(135deg,#10B981,#34D399)";


                setTimeout(
                    () => {

                        button.textContent =
                            originalText;


                        button.style.background =
                            "";

                    },
                    2500
                );

            }
        );

    }
);


/* ==========================================================
   SAVE BUTTON
   ========================================================== */

const saveButtons =
    document.querySelectorAll(
        ".btn-small.outline"
    );


saveButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();


                button.classList.toggle(
                    "saved"
                );


                if (
                    button.classList.contains(
                        "saved"
                    )
                ) {

                    button.innerHTML =
                        "♥ Saved";

                }

                else {

                    button.innerHTML =
                        "Save";

                }

            }
        );

    }
);


/* ==========================================================
   CREATIVE GALLERY
   ========================================================== */

const galleryThumbs =
    document.querySelectorAll(
        ".gallery-thumb"
    );

const galleryMainImage =
    document.getElementById(
        "galleryMainImage"
    );

const galleryTitle =
    document.getElementById(
        "galleryTitle"
    );

const galleryDescription =
    document.getElementById(
        "galleryDescription"
    );

const galleryDate =
    document.getElementById(
        "galleryDate"
    );

const galleryProgress =
    document.querySelector(
        ".gallery-progress span"
    );


/*
   Gallery data.
*/

const galleryData = [

    {
        title:
            "Engineering India Meet",

        description:
            "A memorable gathering where students, innovators and members of the Engineering India community came together to share ideas, experiences and new possibilities.",

        date:
            "Engineering India • Community Meet",

        image:
            "gallery1.jpg"
    },

    {
        title:
            "Innovation & Ideas",

        description:
            "A creative space where students showcased their ideas, discussed possibilities and explored how engineering can create meaningful impact.",

        date:
            "Engineering India • Innovation",

        image:
            "featured-event.jpg"
    },

    {
        title:
            "Student Community",

        description:
            "An energetic moment from our student community, bringing together collaboration, conversations and shared learning.",

        date:
            "Engineering India • Students",

        image:
            "cyber.jpg"
    },

    {
        title:
            "Campus Moments",

        description:
            "A glimpse into the people and moments that make Engineering India more than just an initiative — it is a growing community.",

        date:
            "Engineering India • Campus",

        image:
            "community-drive.jpg"
    },

    {
        title:
            "Team Engineering India",

        description:
            "The people behind the community working together, contributing ideas and helping create meaningful experiences.",

        date:
            "Engineering India • Team",

        image:
            "cloud.jpg"
    },

    {
        title:
            "Building Together",

        description:
            "A moment that represents collaboration, creativity and the spirit of building something meaningful together.",

        date:
            "Engineering India • Collaboration",

        image:
            "ai.jpg"
    }

];


function updateGallery(index) {

    if (
        !galleryData[index]
    ) {
        return;
    }

    const data =
        galleryData[index];


    if (galleryMainImage) {

        galleryMainImage.style.opacity =
            "0";

        setTimeout(
            () => {

                galleryMainImage.src =
                    data.image;

                galleryMainImage.alt =
                    data.title;

                galleryMainImage.style.opacity =
                    "1";

            },
            180
        );

    }


    if (galleryTitle) {

        galleryTitle.textContent =
            data.title;

    }


    if (galleryDescription) {

        galleryDescription.textContent =
            data.description;

    }


    if (galleryDate) {

        galleryDate.textContent =
            data.date;

    }


    if (galleryProgress) {

        galleryProgress.style.width =
            ((index + 1) /
                galleryData.length *
                100) + "%";

    }


    galleryThumbs.forEach(
        (thumb, i) => {

            thumb.classList.toggle(
                "active",
                i === index
            );

        }
    );

}


/* GALLERY THUMBNAIL CLICK */

galleryThumbs.forEach(
    (thumb, index) => {

        thumb.addEventListener(
            "click",
            () => {

                updateGallery(index);

            }
        );

    }
);


/* INITIAL GALLERY IMAGE */

if (
    galleryData.length > 0
) {

    updateGallery(0);

}
/* ==========================================================
   CLICK TO EXPLORE - GALLERY
   ========================================================== */

const clickToExplore =
    document.querySelector(".gallery-explore");

if (clickToExplore) {

    clickToExplore.addEventListener(
        "click",
        () => {

            const eventsSection =
                document.getElementById("events");

            if (eventsSection) {

                eventsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}
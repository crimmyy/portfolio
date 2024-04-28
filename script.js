// ART/DESIGN TOGGLE
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('nav-toggle');
    const artPhotos = document.getElementById('art-photos');
    const designPhotos = document.getElementById('design-photos');

    // LIGHT/DARK THEME
    function updateTheme() {
        const theme = localStorage.getItem('theme') || 'dark-theme';
        document.body.className = theme;
        toggle.checked = (theme === 'light-theme');
    
        const updateVisibility = (parentElement, addClass, removeClass) => {
            parentElement.classList.add(addClass);
            parentElement.classList.remove(removeClass);
            const images = parentElement.querySelectorAll('img');
            images.forEach(img => {
                img.classList.add(addClass);
                img.classList.remove(removeClass);
            });
        };
        //ART/DESIGN TOGGLE
        if (theme === 'light-theme') {
            updateVisibility(artPhotos, 'invisible', 'noninvisible');
            updateVisibility(designPhotos, 'noninvisible', 'invisible');
        } else {
            updateVisibility(artPhotos, 'noninvisible', 'invisible');
            updateVisibility(designPhotos, 'invisible', 'noninvisible');
        }
    }
    
    toggle.addEventListener('change', () => {
        const newTheme = toggle.checked ? 'light-theme' : 'dark-theme';
        localStorage.setItem('theme', newTheme);
        updateTheme();
    });

    window.addEventListener('storage', (event) => {
        if (event.key === 'theme') {
            updateTheme();
        }
    });

    updateTheme();
});

// HAMBURGER MENU
function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
  }
  function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
  }

// ART PHOTOS CLICK DRAG/ REDIRECT 
const track = document.getElementById("art-photos");
let isDragging = false;
let startMousePos;

let startYPos;

const getPosition = (e) => {
    return {
        x: e.type.includes('mouse') ? e.clientX : e.touches[0].clientX,
        y: e.type.includes('mouse') ? e.clientY : e.touches[0].clientY
    };
};

const handleOnDown = e => {
    if (e.touches && e.touches.length > 1) {
        e.preventDefault();
        return; // Do not start a drag if multiple touches are detected
    }

    const startPos = getPosition(e);
    startMousePos = startPos.x;
    startYPos = startPos.y;
    track.dataset.mouseDownAt = startMousePos;
    isDragging = false; // Reset the dragging state at the start of a new touch
};

const handleOnUp = e => {
    if (!isDragging && e.target.classList.contains('redirect')) {
        const url = e.target.dataset.url;
        if (url) {
            window.location.href = url;  // Redirect only if there was no dragging
        }
    }
    isDragging = false; // Reset dragging state after every touch end
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
};



const handleOnMove = e => {
    // Prevent multi-touch gestures from affecting the viewport
    if (e.touches && e.touches.length > 1) {
        e.preventDefault();
        return; // Exit the function if more than one touch is detected
    }

    if (track.dataset.mouseDownAt === "0") return;

    const currentPos = getPosition(e);
    const currentMousePos = currentPos.x;
    const currentYPos = currentPos.y;
    const initialMousePos = parseFloat(track.dataset.mouseDownAt);
    const mouseDelta = currentMousePos - initialMousePos;
    const verticalDelta = currentYPos - startYPos;

    if (Math.abs(mouseDelta) > Math.abs(verticalDelta)) {
        e.preventDefault(); // Prevent scrolling only if it's clearly a horizontal drag

        if (Math.abs(mouseDelta) > 5) {
            isDragging = true;

            const maxDelta = window.innerWidth / 2;
            const percentage = (mouseDelta / maxDelta) * 100;

            let nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
            let nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -280);

            track.dataset.percentage = nextPercentage;

            track.animate({
                transform: `translate(${nextPercentage}%, -50%)`
            }, { duration: 1200, fill: "forwards" });

            for (const image of track.getElementsByClassName("image")) {
                image.animate({
                    objectPosition: `${100 + (nextPercentage/3)}% center`
                }, { duration: 1200, fill: "forwards" });
            }
        }
    }
};


// Add event listeners for both mouse and touch events
window.addEventListener('mousedown', handleOnDown);
window.addEventListener('mouseup', handleOnUp);
window.addEventListener('mousemove', handleOnMove);

window.addEventListener('touchstart', handleOnDown);
window.addEventListener('touchend', handleOnUp);
window.addEventListener('touchmove', handleOnMove, { passive: false });

//HIDDEN ART PHOTOS/DESIGN PHOTOS ANIMATION
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.replace('hidden', 'visible');
            }, index * 300);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const hiddenImages = document.querySelectorAll('#art-photos .image.hidden');
hiddenImages.forEach((el) => observer.observe(el));

document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5,
    });
  
    const hiddenImages = document.querySelectorAll('#design-photos img.hidden');
    hiddenImages.forEach(img => {
      observer.observe(img);
    });
  });  

//ART/DESIGN HTML/NAV BUTTONS
document.addEventListener('DOMContentLoaded', () => {
    // Determine the current type based on the URL
    const currentFilename = window.location.href.split('/').pop().split('.html')[0];
    const pageNumber = parseInt(currentFilename.substring(2));

    const isArtPage = window.location.pathname.includes('ap_htmls');
    const maxPages = isArtPage ? 11 : 4; // Use 11 for art pages, 4 for design pages

    const navigate = (offset) => {
        let newPageNumber = pageNumber + offset;
        if (newPageNumber < 1) newPageNumber = maxPages;
        if (newPageNumber > maxPages) newPageNumber = 1;
        const pagePrefix = isArtPage ? 'ap' : 'dp';
        window.location.href = `${pagePrefix}${newPageNumber}.html`;
    };

    document.getElementById('prev').addEventListener('click', () => navigate(-1));
    document.getElementById('next').addEventListener('click', () => navigate(1));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            navigate(-1);
        } else if (event.key === 'ArrowRight') {
            navigate(1);
        }
    });
});


function vhvw() {
    const artPhotos = document.getElementById('art-photos');
    const imageDirections = document.querySelector('.image-directions');

    if (artPhotos) {
        const vh70 = window.innerHeight * 0.7;
        const vw70 = window.innerWidth * 0.7;
        artPhotos.style.marginTop = `${Math.min(vh70, vw70)}px`;
    }

    if (imageDirections) {
        // Calculate 155% of viewport width and height
        const vh155 = window.innerHeight * 1.55;
        const vw155 = window.innerWidth * 1.8;

        // Determine the smaller of the two and check if vh is favored
        let topValue = Math.min(vh155, vw155);

        // Set top to the calculated value
        imageDirections.style.top = `${topValue}px`;

        // Adjust font-size based on viewport width
        imageDirections.style.fontSize = `${window.innerWidth * 0.01}px`; // Equivalent to 1vw
    }
}

// Initial adjustment when the page loads
vhvw();

// Adjust styles on window resize
window.addEventListener('resize', vhvw);

//TOP/BOT SCROLL BUTTONS
const toTop = document.querySelector(".top-scroll");
const bottomScroll = document.querySelector(".bot-scroll");

function getScrollPosition() {
    return window.scrollY || document.documentElement.scrollTop;
}

function getDocumentHeight() {
    const body = document.body;
    const html = document.documentElement;
    return Math.max(
        body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight
    );
}

window.addEventListener("scroll", () => {
    let scrollPosition = getScrollPosition();
    let windowHeight = window.innerHeight;
    let totalHeight = getDocumentHeight();

    if (scrollPosition > 100) {
        toTop.classList.add("active");
    } else {
        toTop.classList.remove("active");
    }

    if (totalHeight - windowHeight - scrollPosition > 100) {
        bottomScroll.classList.add("active");
    } else {
        bottomScroll.classList.remove("active");
    }
});

function smoothScroll(targetY, duration = 1000) {
    const start = getScrollPosition();
    const change = targetY - start;
    let currentTime = 0;
    const increment = 20;

    const animateScroll = function() {
        currentTime += increment;
        const val = Math.easeInOutQuad(currentTime, start, change, duration);
        window.scrollTo(0, val);
        if (currentTime < duration) {
            requestAnimationFrame(animateScroll);
        }
    };

    animateScroll();
}

Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

toTop.addEventListener("click", () => smoothScroll(0));
bottomScroll.addEventListener("click", () => smoothScroll(getDocumentHeight() - window.innerHeight));
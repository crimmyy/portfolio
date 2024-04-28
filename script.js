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

// ART PHOTOS CLICK DRAG/ REDIRECT 
const track = document.getElementById("art-photos");
let isDragging = false;
let startMousePos;

const handleOnDown = e => {
    startMousePos = e.clientX;
    track.dataset.mouseDownAt = e.clientX;
    isDragging = false;
};

const handleOnUp = e => {
    if (!isDragging && e.target.classList.contains('redirect')) {
        const url = e.target.dataset.url;
        if (url) {
            window.location.href = url;
        }
    }
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
};

const handleOnMove = e => {
  if (track.dataset.mouseDownAt === "0") return;
  
  const currentMousePos = e.clientX;
  const initialMousePos = parseFloat(track.dataset.mouseDownAt);
  const mouseDelta = currentMousePos - initialMousePos;

  if (Math.abs(mouseDelta) > 5) {
      isDragging = true;
      const maxDelta = window.innerWidth / 2;
      const percentage = (mouseDelta / maxDelta) * 100;

      let nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
      let nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

      track.dataset.percentage = nextPercentage;
      
      track.animate({
          transform: `translate(${nextPercentage}%, -50%)`
      }, { duration: 1200, fill: "forwards" });
      
      for (const image of track.getElementsByClassName("image")) {
          image.animate({
              objectPosition: `${100 + nextPercentage}% center`
          }, { duration: 1200, fill: "forwards" });
      }
  }
};

window.addEventListener('mousedown', handleOnDown);
window.addEventListener('mouseup', handleOnUp);
window.addEventListener('mousemove', handleOnMove);

//HIDDEN ART PHOTOS ANIMATION
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

//ART PHOTOS HTML/NAV BUTTONS
document.addEventListener('DOMContentLoaded', () => {
  const currentFilename = window.location.href.split('/').pop().split('.html')[0];
  const pageNumber = parseInt(currentFilename.substring(2));

  const navigate = (offset) => {
      let newPageNumber = pageNumber + offset;
      if (newPageNumber < 1) newPageNumber = 11;
      if (newPageNumber > 11) newPageNumber = 1;
      window.location.href = `ap${newPageNumber}.html`;
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
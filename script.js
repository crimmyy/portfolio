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

//   ART PHOTOS DRAG/REDIRECT
  const track = document.getElementById("art-photos");
  let isDragging = false;
  let startMousePos;
  let startYPos;
  let prevPercentage = 0;
  
  const getPosition = (e) => {
      return {
          x: e.type.includes('mouse') ? e.clientX : e.touches[0].clientX,
          y: e.type.includes('mouse') ? e.clientY : e.touches[0].clientY
      };
  };
  
  const handleOnDown = e => {
      if (e.touches && e.touches.length > 1) {
          e.preventDefault();
          return;
      }
  
      const startPos = getPosition(e);
      startMousePos = startPos.x;
      startYPos = startPos.y;
      track.dataset.mouseDownAt = startMousePos;
      isDragging = false;
      prevPercentage = parseFloat(track.dataset.percentage) || 0;
  };
  
  const handleOnUp = e => {
      if (!isDragging && e.target.classList.contains('redirect')) {
          const url = e.target.dataset.url;
          if (url) {
              window.location.href = url;
          }
      }
      track.dataset.prevPercentage = prevPercentage.toString();
      track.dataset.mouseDownAt = "0";
      isDragging = false;
  };
  
  const handleOnMove = e => {
      if (e.touches && e.touches.length > 1) {
          e.preventDefault();
          return;
      }
  
      if (track.dataset.mouseDownAt === "0") return;
  
      const currentPos = getPosition(e);
      const currentMousePos = currentPos.x;
      const mouseDelta = currentMousePos - startMousePos;
      const verticalDelta = currentPos.y - startYPos;
  
      if (Math.abs(mouseDelta) > Math.abs(verticalDelta)) {
          e.preventDefault();
  
          if (Math.abs(mouseDelta) > 5) {
              isDragging = true;
              const maxDelta = window.innerWidth;
              const percentage = (mouseDelta / maxDelta) * 20;
              let nextPercentage = Math.max(Math.min(prevPercentage + percentage, 0), -280);
              

  
              track.dataset.percentage = nextPercentage.toString();
              prevPercentage = nextPercentage;
  
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
      threshold: 0.2,
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
        const vh155 = window.innerHeight * 1.55;
        const vw155 = window.innerWidth * 1.8;

        let topValue = Math.min(vh155, vw155);

        imageDirections.style.top = `${topValue}px`;

        imageDirections.style.fontSize = `${window.innerWidth * 0.01}px`; // Equivalent to 1vw
    }
}
vhvw();

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
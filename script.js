AOS.init({
  easing: "ease-in-out",
  once: true // Biar animasinya jalannya cuma sekali pas pertama nge-scroll
});

// menu button
document.addEventListener("DOMContentLoaded", function () {
  var dropdownToggle = document.querySelector(".dropdown-toggle");
  var dropdownMenu = dropdownToggle ? dropdownToggle.nextElementSibling : null;

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", function () {
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", function (event) {
      if (
        !dropdownToggle.contains(event.target) &&
        !dropdownMenu.contains(event.target)
      ) {
        dropdownMenu.classList.remove("show");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var dropdownToggleAll = document.querySelectorAll(".dropdown-toggle");

  dropdownToggleAll.forEach(function (toggle) {
    toggle.addEventListener("click", function (event) {
      var dropdownMenu = this.nextElementSibling;
      if (dropdownMenu.classList.contains("show")) {
        dropdownMenu.classList.remove("show");
      } else {
        document.querySelectorAll(".dropdown-menu").forEach(function (menu) {
          menu.classList.remove("show");
        });
        dropdownMenu.classList.add("show");
      }
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".dropdown-toggle")) {
      document.querySelectorAll(".dropdown-menu").forEach(function (menu) {
        menu.classList.remove("show");
      });
    }
  });
});

// ==========================================
// LOGIC GALERI & PENCAPAIAN (Pindahan dari HTML)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Mencegah Auto-Scroll ke bawah saat halaman dimuat
    if (window.location.hash) {
        window.history.replaceState('', document.title, window.location.pathname + window.location.search);
        window.scrollTo(0, 0);
    }

    const achievementsSection = document.getElementById("achievements");
    const btnAchievements = document.getElementById("btnAchievements");
    const btnGallery = document.getElementById("btnGallery");
    const gallery = document.querySelector("#galeriCuy");
    const galleryText = document.getElementById("galleryTitle");

    if (gallery) {
        // Script Lazy Image enteng
        const images = gallery.querySelectorAll("img");
        images.forEach(img => {
            if (img.complete) {
                img.style.opacity = "1";
            } else {
                img.addEventListener("load", () => img.style.opacity = "1");
            }
        });
    }

    // FUNGSI CROSSFADE: Transisi hilangnya super mulus
    function crossfade(hideElem1, hideElem2, showElem1, showElem2) {
        if(hideElem1) hideElem1.style.opacity = "0";
        if(hideElem2) hideElem2.style.opacity = "0";

        setTimeout(() => {
            if(hideElem1) hideElem1.style.display = "none";
            if(hideElem2) hideElem2.style.display = "none";

            if(showElem1) showElem1.style.display = "block";
            if(showElem2) showElem2.style.display = "block";

            setTimeout(() => {
                if(showElem1) showElem1.style.opacity = "1";
                if(showElem2) showElem2.style.opacity = "1";
            }, 50);
        }, 400); 
    }

    function showAchievements() {
        crossfade(galleryText, gallery, null, achievementsSection);
        setTimeout(() => { if (achievementsSection) achievementsSection.scrollIntoView({ behavior: "smooth", block: "start" }) }, 410);
    }

    function showGallerySection() {
        crossfade(null, achievementsSection, galleryText, gallery);
        setTimeout(() => {
            if (galleryText) galleryText.scrollIntoView({ behavior: "smooth", block: "start" });
            else if (gallery) gallery.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 410);
    }

    // Default State yang bersih
    if(achievementsSection) achievementsSection.style.display = "none";
    if(gallery) gallery.style.display = "none";
    if(galleryText) galleryText.style.display = "none";

    if(btnAchievements) {
        btnAchievements.addEventListener("click", (event) => {
            event.preventDefault();
            showAchievements();
        });
    }

    if(btnGallery) {
        btnGallery.addEventListener("click", (event) => {
            event.preventDefault();
            showGallerySection();
        });
    }
});

// ==========================================
// LOGIC PREVIEW MODAL FOTO (Anti Race-Condition)
// ==========================================
let currentPreviewIndex = 0;
let galleryImages = [];

document.addEventListener("DOMContentLoaded", () => {
    // Ambil semua gambar di galeri
    const galeriCuy = document.getElementById('galeriCuy');
    if (galeriCuy) {
        galleryImages = Array.from(galeriCuy.querySelectorAll('img'));
        galleryImages.forEach((img, index) => {
            img.setAttribute('data-index', index);
        });
    }
    
    // Fitur Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        const previewContainer = document.getElementById("previewImage");
        if (previewContainer && previewContainer.classList.contains("active")) {
            if (e.key === "ArrowRight") window.nextPreviewImg();
            if (e.key === "ArrowLeft") window.prevPreviewImg();
            if (e.key === "Escape") window.closePreviewImg();
        }
    });
});

// Jadikan function global supaya bisa dipanggil dari atribut onclick di HTML
window.showPreview = function(imgElement) {
    currentPreviewIndex = parseInt(imgElement.getAttribute('data-index'));
    openPreviewModal();
};

function openPreviewModal(animClass = '') {
    const previewContainer = document.getElementById("previewImage");
    const contentWrapper = document.getElementById("preview-content-wrapper");
    const previewImg = document.getElementById("previewImg");
    const previewDesc = document.getElementById("previewDescription");
    const loader = document.getElementById("preview-loader");
    
    const targetImg = galleryImages[currentPreviewIndex];
    const fullSrc = targetImg.getAttribute("data-full-src");
    const desc = targetImg.getAttribute("data-description");

    document.body.style.overflow = "hidden";
    previewContainer.style.display = "flex";
    setTimeout(() => previewContainer.classList.add("active"), 10);

    // Reset Animasi
    contentWrapper.classList.remove("slide-right-anim", "slide-left-anim");
    previewImg.style.opacity = "0";
    previewDesc.style.opacity = "0";
    loader.style.display = "flex";

    // FIX UTAMA: Cegah Race Condition
    previewImg.onload = null;
    previewImg.onerror = null;
    previewImg.src = ""; 

    // Sukses Load
    previewImg.onload = function() {
        loader.style.display = "none";
        previewDesc.textContent = desc;
        
        if (animClass) {
            void contentWrapper.offsetWidth; // Restart animasi
            contentWrapper.classList.add(animClass);
        }
        
        previewImg.style.opacity = "1";
        previewDesc.style.opacity = "1";
    };
    
    // Gagal Load
    previewImg.onerror = function() {
        loader.style.display = "none";
        previewDesc.textContent = "404 Not Found: Gambar gagal dimuat.";
        
        if (animClass) {
            void contentWrapper.offsetWidth; 
            contentWrapper.classList.add(animClass);
        }
        
        previewDesc.style.opacity = "1";
    };
    
    // Mulai Load Gambar
    previewImg.src = fullSrc;
}

window.nextPreviewImg = function() {
    currentPreviewIndex = (currentPreviewIndex + 1) % galleryImages.length;
    openPreviewModal('slide-right-anim');
};

window.prevPreviewImg = function() {
    currentPreviewIndex = (currentPreviewIndex - 1 + galleryImages.length) % galleryImages.length;
    openPreviewModal('slide-left-anim');
};

window.closePreviewImg = function() {
    const previewContainer = document.getElementById("previewImage");
    previewContainer.classList.remove("active");
    document.body.style.overflow = "auto";
    
    setTimeout(() => {
        previewContainer.style.display = "none";
        document.getElementById("previewImg").src = ""; 
    }, 400); 
};
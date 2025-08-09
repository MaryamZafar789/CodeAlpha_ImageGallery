document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const gallery = document.querySelector('.gallery');
  const images = document.querySelectorAll('.img-card');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.img-title');
  const closeBtn = document.querySelector('.close-icon');
  const downloadBtn = document.querySelector('.download-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('.search-box input');
  
  // Variables
  let currentImgIndex = 0;
  const imgElements = Array.from(images);
  let filteredImages = imgElements;
  
  // Initialize the gallery
  function initGallery() {
    // Add click event to each image
    images.forEach((img, index) => {
      img.addEventListener('click', () => {
        openLightbox(index);
      });
    });
    
    // Filter functionality
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        filterImages(filter);
      });
    });
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterImagesBySearch(searchTerm);
    });
  }
  
  // Filter images by category
  function filterImages(filter) {
    if (filter === 'all') {
      filteredImages = imgElements;
    } else {
      filteredImages = imgElements.filter(img => 
        img.dataset.category === filter
      );
    }
    
    // Hide all images first
    imgElements.forEach(img => {
      img.style.display = 'none';
    });
    
    // Show filtered images
    filteredImages.forEach(img => {
      img.style.display = 'block';
    });
  }
  
  // Filter images by search term
  function filterImagesBySearch(term) {
    filteredImages = imgElements.filter(img => {
      const imgAlt = img.querySelector('img').alt.toLowerCase();
      const imgTitle = img.querySelector('.img-info span').textContent.toLowerCase();
      return imgAlt.includes(term) || imgTitle.includes(term);
    });
    
    // Hide all images first
    imgElements.forEach(img => {
      img.style.display = 'none';
    });
    
    // Show matching images
    filteredImages.forEach(img => {
      img.style.display = 'block';
    });
  }
  
  // Open lightbox with specific image
  function openLightbox(index) {
    currentImgIndex = index;
    const imgSrc = filteredImages[index].querySelector('img').src;
    const imgTitle = filteredImages[index].querySelector('.img-info span').textContent;
    
    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = imgTitle;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Update navigation buttons visibility
    updateNavButtons();
  }
  
  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
  
  // Navigate to previous image
  function showPrevImage() {
    if (currentImgIndex > 0) {
      currentImgIndex--;
    } else {
      currentImgIndex = filteredImages.length - 1;
    }
    updateLightboxImage();
  }
  
  // Navigate to next image
  function showNextImage() {
    if (currentImgIndex < filteredImages.length - 1) {
      currentImgIndex++;
    } else {
      currentImgIndex = 0;
    }
    updateLightboxImage();
  }
  
  // Update lightbox image and title
  function updateLightboxImage() {
    const imgSrc = filteredImages[currentImgIndex].querySelector('img').src;
    const imgTitle = filteredImages[currentImgIndex].querySelector('.img-info span').textContent;
    
    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = imgTitle;
    
    // Update navigation buttons visibility
    updateNavButtons();
  }
  
  // Update navigation buttons visibility
  function updateNavButtons() {
    // Always show buttons if there's more than one image
    if (filteredImages.length > 1) {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }
  
  // Download current image
  function downloadImage() {
    const link = document.createElement('a');
    link.href = lightboxImg.src;
    link.download = `image-${currentImgIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Keyboard navigation
  function handleKeyDown(e) {
    if (!lightbox.classList.contains('show')) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrevImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  }
  
  // Event listeners
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrevImage);
  nextBtn.addEventListener('click', showNextImage);
  downloadBtn.addEventListener('click', downloadImage);
  document.addEventListener('keydown', handleKeyDown);
  
  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Initialize the gallery
  initGallery();
});
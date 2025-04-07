document.addEventListener('DOMContentLoaded', function() {
  const imageOptions = document.querySelectorAll('.cfvsw-image-option');
  
  imageOptions.forEach(function(option) {
    option.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        setTimeout(function() {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 300); 
      }
    });
  });
});
	
	
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Function to update the selected size text next to the Add to Cart button
    function updateSelectedSize() {
        // Find the size swatch container specifically by swatches-attr
        const sizeSwatchContainer = document.querySelector('.cfvsw-swatches-container[swatches-attr="attribute_pa_size"]');
        if (!sizeSwatchContainer) return;
        
        // Find the selected swatch within this container
        const selectedSwatch = sizeSwatchContainer.querySelector('.cfvsw-selected-swatch');
        
        // Find the button text element
        const buttonTextElement = document.querySelector('.single_add_to_cart_button .elementor-button-text');
        
        if (selectedSwatch && buttonTextElement) {
            const sizeTitle = selectedSwatch.getAttribute('data-title');
            const originalText = 'افزودن به سبد خرید';
            buttonTextElement.textContent = originalText + ' - ' + sizeTitle;
        }
    }
    
    // Initial update
    updateSelectedSize();
    
    // Add click event listeners only to size swatches
    const sizeSwatchContainer = document.querySelector('.cfvsw-swatches-container[swatches-attr="attribute_pa_size"]');
    if (sizeSwatchContainer) {
        const sizeOptions = sizeSwatchContainer.querySelectorAll('.cfvsw-swatches-option');
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Small timeout to allow the class to be updated
                setTimeout(updateSelectedSize, 100);
            });
        });
    }
    
    // Also check for any custom events that might be triggered by the swatches plugin
    document.addEventListener('cfvsw_selected_attribute', updateSelectedSize);
    
    // For safety, periodically check if the selection has changed
    setInterval(updateSelectedSize, 1000);
});
	
	
	
	
	
	
	
jQuery(document).ready(function($) {
// Function to update price content
function updatePriceContent() {
    // Get the price content from source
    var priceContent = $('.nias-button-addtocart .woocommerce-variation-price').html();
    
    // Clear the target and insert the new content
    $('.kalmuriaprice .price').empty().html(priceContent);
}

// Function to wait for content to be available
function waitForPriceAndUpdate(maxAttempts = 10) {
    let attempts = 0;
    
    function tryUpdate() {
        attempts++;
        
        if ($('.nias-button-addtocart .woocommerce-variation-price').length > 0 && 
            $('.nias-button-addtocart .woocommerce-variation-price').html()) {
            updatePriceContent();
            return true;
        } else if (attempts < maxAttempts) {
            setTimeout(tryUpdate, 500);
            return false;
        } else {
            return false;
        }
    }
    
    tryUpdate();
}

// Run when page is ready
$(document).ready(function() {
    // Initial update with retry mechanism
    waitForPriceAndUpdate();
    
    // Set up event listener for swatch clicks
    $(document).on('click', '.cfvsw-swatches-option', function() {
        setTimeout(function() {
            waitForPriceAndUpdate();
        }, 500);
    });
});
});
</script>
<script>
jQuery(document).ready(function($) {
  // Add lightbox container to the body
  $('body').append(`
    <div id="lightbox" style="display: none; position: fixed; z-index: 999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9);">
      <div class="lightbox-content" style="display: flex; justify-content: center; align-items: center; height: 100%;">
        <span class="close" style="position: absolute; top: 20px; right: 30px; font-size: 30px; color: white; cursor: pointer;">&times;</span>
        <img id="lightbox-img" style="max-width: 90%; max-height: 90%; object-fit: contain;">
        <div class="lightbox-nav" style="position: absolute; width: 100%; display: flex; justify-content: space-between; padding: 0 50px; box-sizing: border-box;">
          <span class="prev" style="font-size: 30px; color: white; cursor: pointer; padding: 10px;">&#10094;</span>
          <span class="next" style="font-size: 30px; color: white; cursor: pointer; padding: 10px;">&#10095;</span>
        </div>
      </div>
    </div>
  `);

  // Store all images that should be in the lightbox
  let images = [];
  let currentIndex = 0;

  // Function to collect all images for lightbox
  function collectImages() {
    images = [];
    // Add thumbnail images
    $('.thumbnail_image img').each(function() {
      images.push($(this).attr('src'));
    });
    
    // Add slick slider images
    $('.slick-slide img').each(function() {
      // Only add non-empty src values
      const src = $(this).attr('src');
      if (src && src.trim() !== '') {
        images.push(src);
      }
    });
    
    return images;
  }

  // Function to show lightbox
  function showLightbox(index) {
    // Update images array before showing the lightbox
    collectImages();
    
    currentIndex = index;
    $('#lightbox-img').attr('src', images[currentIndex]);
    $('#lightbox').fadeIn(300);
  }

  // Click event for thumbnail images
  $(document).on('click', '.thumbnail_image img', function() {
    const index = $('.thumbnail_image img').index(this);
    showLightbox(index);
  });

  // Click event for slick slider images
  $(document).on('click', '.slick-slide img', function() {
    // First collect all images to ensure we have the current set
    collectImages();
    
    // Find this image's src in the collected images array
    const src = $(this).attr('src');
    const index = images.indexOf(src);
    
    // If found, show the lightbox at this index
    if (index !== -1) {
      showLightbox(index);
    }
  });

  // Close lightbox when clicking the close button or outside the image
  $('#lightbox .close, #lightbox').on('click', function(e) {
    if (e.target === this || $(e.target).hasClass('close')) {
      $('#lightbox').fadeOut(300);
    }
  });

  // Prevent lightbox from closing when clicking on the image itself
  $('#lightbox-img').on('click', function(e) {
    e.stopPropagation();
  });

  // Next image
  $('.next').on('click', function(e) {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    $('#lightbox-img').attr('src', images[currentIndex]);
  });

  // Previous image
  $('.prev').on('click', function(e) {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    $('#lightbox-img').attr('src', images[currentIndex]);
  });

  // Keyboard navigation
  $(document).keydown(function(e) {
    if ($('#lightbox').is(':visible')) {
      if (e.keyCode === 37) { // Left arrow
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        $('#lightbox-img').attr('src', images[currentIndex]);
      } else if (e.keyCode === 39) { // Right arrow
        currentIndex = (currentIndex + 1) % images.length;
        $('#lightbox-img').attr('src', images[currentIndex]);
      } else if (e.keyCode === 27) { // Esc key
        $('#lightbox').fadeOut(300);
      }
    }
  });
});

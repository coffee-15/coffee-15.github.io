document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    const modalContent = modal.querySelector('.modal-content');
    const closeButton = modal.querySelector('.modal-close');
    const prevButton = modal.querySelector('.modal-nav-arrow.prev');
    const nextButton = modal.querySelector('.modal-nav-arrow.next');
    
    let currentPost = null;

    function getVisiblePosts() {
        // Update to look for non-hidden gallery-item-links instead
        return [...document.querySelectorAll('.gallery-item-link:not(.hidden) .gallery-item')];
    }

    function openModal(post) {
        // Clean up any existing views first
        cleanupModalViews();
        
        if (post.dataset.types.includes('writing') || post.dataset.types.includes('sound')||post.dataset.types.includes('video')) {
            // Writing and Sound posts need the white container
            modalContent.style.display = 'block';
            modalContent.innerHTML = '';
            modalContent.appendChild(
                post.dataset.types.includes('writing') 
                    ? createWritingView(post) 
                    : createSoundView(post)
                    , createVideoView(post)
            );
        } else {
            // Image posts should be directly in the modal
            modalContent.style.display = 'none';
            const imageView = createImageView(post);
            modal.insertBefore(imageView, modal.querySelector('.modal-navigation'));
        }
        
        modal.classList.add('active');
        currentPost = post;
        document.body.style.overflow = 'hidden';
        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        const visiblePosts = getVisiblePosts();
        const currentIndex = visiblePosts.indexOf(currentPost);
        
        // Hide/show prev button based on position
        prevButton.style.display = currentIndex > 0 ? 'block' : 'none';
        
        // Hide/show next button based on position
        nextButton.style.display = currentIndex < visiblePosts.length - 1 ? 'block' : 'none';

        // Update navigation button positions
        const modalNavigation = modal.querySelector('.modal-navigation');
        if (currentIndex === 0) {
            // Only next items available - align navigation to right
            modalNavigation.classList.add('nav-right-only');
            modalNavigation.classList.remove('nav-left-only');
        } else if (currentIndex === visiblePosts.length - 1) {
            // Only previous items available - align navigation to left
            modalNavigation.classList.add('nav-left-only');
            modalNavigation.classList.remove('nav-right-only');
        } else {
            // Items on both sides - reset to default
            modalNavigation.classList.remove('nav-right-only', 'nav-left-only');
        }
    }

    function createWritingView(post) {
        const container = document.createElement('div');
        container.className = 'modal-writing';
        const content = `
            <div class="writing-header">
                <h1>${post.querySelector('h2').textContent}</h1>
                <span class="writing-date">${post.dataset.date || ''}</span>
            </div>
            <p class="description">${post.querySelector('p').textContent}</p>
            <div class="tag-writing">Writing</div>
            <div class="content">
                ${post.dataset.content || ''}
            </div>
        `;
        container.innerHTML = content;
        
        // Style the content images
        container.querySelectorAll('.content img').forEach(img => {
            img.classList.add('content-image');
        });
        
        // Add short-content class if content is less than viewport height
        setTimeout(() => {
            if (container.offsetHeight < window.innerHeight) {
                container.classList.add('short-content');
            }
        }, 0);
        
        return container;
    }

    function createSoundView(post) {
        const container = document.createElement('div');
        container.className = 'modal-writing';  // Reuse writing styles
        const content = `
            <div class="writing-header">
                <h1>${post.querySelector('h2').textContent}</h1>
                <span class="writing-date">${post.dataset.date || ''}</span>
            </div>
            <p class="description">${post.querySelector('p').textContent}</p>
            <div class="tag-sound">Sound</div>
            <div class="content">
                ${post.dataset.content || ''}
            </div>
        `;
        container.innerHTML = content;
        
        // Add short-content class if content is less than viewport height
        setTimeout(() => {
            if (container.offsetHeight < window.innerHeight) {
                container.classList.add('short-content');
            }
        }, 0);
        
        return container;
    }

    function createVideoView(post) {
        const container = document.createElement('div');
        container.className = 'modal-writing';
        const content = `
            <div class="writing-header">
                <h1>${post.querySelector('h2').textContent}</h1>
                <span class="writing-date">${post.dataset.date || ''}</span>
            </div>
            <p class="description">${post.querySelector('p').textContent}</p>
            <div class="tag-video">Video</div>
            <div class="content">
                ${post.dataset.content || ''}
            </div>
        `;
        container.innerHTML = content;
        
        // Style the content images
        container.querySelectorAll('.content img').forEach(img => {
            img.classList.add('content-image');
        });
        
        // Add short-content class if content is less than viewport height
        setTimeout(() => {
            if (container.offsetHeight < window.innerHeight) {
                container.classList.add('short-content');
            }
        }, 0);
        
        return container;
    }

    function createImageView(post) {
        const container = document.createElement('div');
        container.className = 'modal-image';
        const img = post.querySelector('img');
        const description = post.dataset.description || '';
        const date = post.dataset.date || '';
        
        container.innerHTML = `
            <div class="image-container">
                <img src="${img.src}" alt="${img.alt}">
                <div class="image-info">
                    <span class="image-description">${description}</span>
                    <span class="image-date">${date}</span>
                </div>
            </div>
        `;
        return container;
    }

    function cleanupModalViews() {
        // Clean up any direct image views
        const imageView = modal.querySelector('.modal-image');
        if (imageView) {
            imageView.remove();
        }
        // Reset modal content
        modalContent.innerHTML = '';
        modalContent.style.display = 'block';
    }

    function closeModal() {
        modal.classList.remove('active');
        currentPost = null;
        document.body.style.overflow = '';
        cleanupModalViews();
    }

    function navigateModal(direction) {
        const visiblePosts = getVisiblePosts();
        const currentIndex = visiblePosts.indexOf(currentPost);
        const newIndex = currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < visiblePosts.length) {
            const newPost = visiblePosts[newIndex];
            openModal(newPost);
        }
    }

    // Event Listeners
    document.querySelectorAll('.gallery-item-link').forEach(post => {
        post.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(post.querySelector('.gallery-item'));
        });
    });

    // Update navigation when filters change
    document.querySelectorAll('.type-btn, .topic-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (modal.classList.contains('active')) {
                // Check if the parent link is hidden instead of the gallery-item
                if (currentPost.closest('.gallery-item-link').classList.contains('hidden')) {
                    closeModal();
                } else {
                    updateNavigationButtons();
                }
            }
        });
    });

    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });

    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateModal(-1);
    });

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateModal(1);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                navigateModal(-1);
                break;
            case 'ArrowRight':
                navigateModal(1);
                break;
        }
    });
}); 
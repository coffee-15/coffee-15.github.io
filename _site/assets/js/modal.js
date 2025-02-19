document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    const modalContent = modal.querySelector('.modal-content');
    const closeButton = modal.querySelector('.modal-close');
    const prevButton = modal.querySelector('.modal-nav.prev');
    const nextButton = modal.querySelector('.modal-nav.next');
    
    let currentPost = null;
    const allPosts = [...document.querySelectorAll('.gallery-item')];

    function openModal(post) {
        const postContent = post.dataset.types.includes('writing') ? 
            createWritingView(post) : createImageView(post);
            
        modalContent.innerHTML = '';
        modalContent.appendChild(postContent);
        modal.classList.add('active');
        currentPost = post;
        document.body.style.overflow = 'hidden';
    }

    function createWritingView(post) {
        const container = document.createElement('div');
        container.className = 'modal-writing';
        const content = `
            <h1>${post.querySelector('h2').textContent}</h1>
            <p class="description">${post.querySelector('p').textContent}</p>
            <div class="tag">Writing</div>
            <div class="content">${post.dataset.content || ''}</div>
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

    function createImageView(post) {
        const container = document.createElement('div');
        container.className = 'modal-image';
        const img = post.querySelector('img');
        container.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
        return container;
    }

    function closeModal() {
        modal.classList.remove('active');
        currentPost = null;
        document.body.style.overflow = '';
    }

    function navigateModal(direction) {
        const currentIndex = allPosts.indexOf(currentPost);
        const newIndex = currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < allPosts.length) {
            const newPost = allPosts[newIndex];
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
document.addEventListener('DOMContentLoaded', () => {
    const topicButtons = document.querySelectorAll('.topic-btn');
    const typeButtons = document.querySelectorAll('.type-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let activeTopics = new Set();
    let activeTypes = new Set();

    function updateFilters() {
        galleryItems.forEach(item => {
            const itemTopics = item.dataset.topics.split(' ');
            const itemTypes = item.dataset.types.split(' ');
            
            const topicMatch = activeTopics.size === 0 || 
                             [...activeTopics].some(topic => itemTopics.includes(topic));
            const typeMatch = activeTypes.size === 0 || 
                            [...activeTypes].some(type => itemTypes.includes(type));
            
            const linkElement = item.closest('.gallery-item-link');
            if (linkElement) {
                linkElement.style.display = (topicMatch && typeMatch) ? 'block' : 'none';
            }
        });
    }

    topicButtons.forEach(button => {
        button.addEventListener('click', () => {
            const topic = button.dataset.topic;
            button.classList.toggle('active');
            
            if (activeTopics.has(topic)) {
                activeTopics.delete(topic);
            } else {
                activeTopics.add(topic);
            }
            
            updateFilters();
        });
    });

    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            button.classList.toggle('active');
            
            if (activeTypes.has(type)) {
                activeTypes.delete(type);
            } else {
                activeTypes.add(type);
            }
            
            updateFilters();
        });
    });
}); 
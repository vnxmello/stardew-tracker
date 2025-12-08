document.addEventListener('DOMContentLoaded', () => {
    //variaveis globais
    const searchInput = document.getElementById('searchInput');
    const cropListItems = document.querySelectorAll('.crop-list li');
    const STORAGE_KEY = 'stardewShippingTracker_v1';
    
    //carrossel variaveis
    const seasons = document.querySelectorAll('.season-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const seasonIndicator = document.getElementById('season-indicator');
    const carouselControls = document.querySelector('.carousel-controls');
    
    let currentSlideIndex = 0; //0 primavera 1 verão 2 outono

    let savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    cropListItems.forEach(item => {
        const cropId = item.getAttribute('data-crop');
        const cropNameSpan = item.querySelector('.crop-name');
        
        const counterBox = document.createElement('div');
        counterBox.className = 'counter-box';

        for (let i = 0; i <= 15; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = 'count-btn';
            btn.dataset.value = i;
            btn.addEventListener('click', handleButtonClick);
            counterBox.appendChild(btn);
        }
        item.appendChild(counterBox);

        const savedValue = savedState[cropId];
        if (savedValue !== undefined && savedValue !== null) {
            const buttonToActivate = counterBox.querySelector(`.count-btn[data-value="${savedValue}"]`);
            if (buttonToActivate) setActiveButton(counterBox, buttonToActivate, item);
        } else {
             const defaultButton = counterBox.querySelector('.count-btn[data-value="0"]');
             setActiveButton(counterBox, defaultButton, item);
        }
    });

    function handleButtonClick(e) {
        const clickedBtn = e.target;
        const parentLi = clickedBtn.closest('li');
        const counterBox = clickedBtn.parentElement;
        const cropId = parentLi.getAttribute('data-crop');
        const value = parseInt(clickedBtn.dataset.value);

        setActiveButton(counterBox, clickedBtn, parentLi);
        savedState[cropId] = value;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    }

    function setActiveButton(counterBox, targetBtn, parentLi) {
        const allButtons = counterBox.querySelectorAll('.count-btn');
        allButtons.forEach(btn => btn.classList.remove('active'));
        targetBtn.classList.add('active');
        if (targetBtn.dataset.value === "15") parentLi.classList.add('fully-completed');
        else parentLi.classList.remove('fully-completed');
    }

    function updateCarousel() {
        //remove a class active slide e adiciona na atual
        seasons.forEach((season, index) => {
            season.classList.remove('active-slide');
            if (index === currentSlideIndex) {
                season.classList.add('active-slide');
            }
        });
        
        const seasonNames = ["Primavera", "Verão", "Outono"];
        seasonIndicator.textContent = `${seasonNames[currentSlideIndex]} (${currentSlideIndex + 1}/3)`;
    }

    prevBtn.addEventListener('click', () => {
        currentSlideIndex--;
        if (currentSlideIndex < 0) currentSlideIndex = seasons.length - 1;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentSlideIndex++;
        if (currentSlideIndex >= seasons.length) currentSlideIndex = 0;
        updateCarousel();
    });

    //logica de pesquisa 
    
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const isSearching = searchTerm.length > 0;

        if (isSearching) {
            carouselControls.style.display = 'none';
        } else {
            // mobile - restaura controles do carrossel
            carouselControls.style.display = '';
        }

        cropListItems.forEach(item => {
            const nameSpan = item.querySelector('.crop-name');
            const text = nameSpan.textContent.toLowerCase();
            
            if (text.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        document.querySelectorAll('.season-card').forEach(card => {
            if (isSearching) {
                const visibleItems = card.querySelectorAll('.crop-list li[style="display: flex;"]');
                card.style.display = visibleItems.length > 0 ? 'block' : 'none';
            } else {
                card.style.display = ''; 
            }
        });
    });
        updateCarousel();
});
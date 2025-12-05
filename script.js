document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const cropListItems = document.querySelectorAll('.crop-list li');

    //chave local storage
    const STORAGE_KEY = 'stardewShippingTracker_v1';

    let savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    //init interface
    cropListItems.forEach(item => {
        const cropId = item.getAttribute('data-crop');
        const cropNameSpan = item.querySelector('.crop-name');
        
        //riar o box de botões
        const counterBox = document.createElement('div');
        counterBox.className = 'counter-box';

        //gen botoes de 0 a 15
        for (let i = 0; i <= 15; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = 'count-btn';
            btn.dataset.value = i;
            btn.setAttribute('aria-label', `Marcar ${i} unidades de ${cropNameSpan.textContent}`);
            btn.addEventListener('click', handleButtonClick);

            counterBox.appendChild(btn);
        }

        item.appendChild(counterBox);
        //verifica se tem valor salvo
        const savedValue = savedState[cropId];
        if (savedValue !== undefined && savedValue !== null) {
            const buttonToActivate = counterBox.querySelector(`.count-btn[data-value="${savedValue}"]`);
            if (buttonToActivate) {
                setActiveButton(counterBox, buttonToActivate, item);
            }
        } else {
             //se nao tiver nada salvo marca 0 como padrão
             const defaultButton = counterBox.querySelector('.count-btn[data-value="0"]');
             setActiveButton(counterBox, defaultButton, item);
        }
    });

    function handleButtonClick(e) {
        const clickedBtn = e.target;
        const counterBox = clickedBtn.parentElement;
        const parentLi = counterBox.parentElement;
        const cropId = parentLi.getAttribute('data-crop');
        const value = parseInt(clickedBtn.dataset.value);

        setActiveButton(counterBox, clickedBtn, parentLi);

        //att o estado e salva no localStorage
        savedState[cropId] = value;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    }

    //fucn para gerenciar as classes visuais ativ/inativ
    function setActiveButton(counterBox, targetBtn, parentLi) {
        const allButtons = counterBox.querySelectorAll('.count-btn');
        allButtons.forEach(btn => btn.classList.remove('active'));

        //add a class active clicando
        targetBtn.classList.add('active');

        //se chegou a 15 marca como fully
        if (targetBtn.dataset.value === "15") {
            parentLi.classList.add('fully-completed');
        } else {
            parentLi.classList.remove('fully-completed');
        }
    }

    //logica de pesquisa
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        cropListItems.forEach(item => {
            //revisar agora a busca so texto dentro do span .crop-name
            const nameSpan = item.querySelector('.crop-name');
            const text = nameSpan.textContent.toLowerCase();
            const parentCard = item.closest('.season-card');
            
            if (text.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        //esconde/mostra os cards de temporada
        document.querySelectorAll('.season-card').forEach(card => {
            const visibleItems = card.querySelectorAll('.crop-list li[style="display: flex;"]');
            if (visibleItems.length > 0 || searchTerm === "") {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
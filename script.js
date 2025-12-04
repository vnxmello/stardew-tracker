document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const cropItems = document.querySelectorAll('.crop-list li');

    const savedState = JSON.parse(localStorage.getItem('stardewCropTracker')) || {};
    
    //salvar e aplicar o estado dos itens
    cropItems.forEach(item => {
        const cropId = item.getAttribute('data-crop');
        
        //aplica o estado
        if (savedState[cropId]) {
            item.classList.add('completed');
        }

        item.addEventListener('click', () => {
            item.classList.toggle('completed');
            
            //salva o estado na memoria local
            const currentState = JSON.parse(localStorage.getItem('stardewCropTracker')) || {};
            currentState[cropId] = item.classList.contains('completed');
            localStorage.setItem('stardewCropTracker', JSON.stringify(currentState));
        });
    });

    //filtro de pesquisa

    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        cropItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const parentCard = item.closest('.season-card');
            
            //se o item inclui x termo
            if (text.includes(searchTerm)) {
                item.style.display = 'flex'; 
            } else {
                item.style.display = 'none'; 
            }

            //logica para esconder/mostrar o card da estação:
            
            parentCard.style.display = 'none';
            
            //todas os list estao dentro do card "pai"
            const allItemsInCard = parentCard.querySelectorAll('li');
            let isAnyItemVisible = false;

            allItemsInCard.forEach(li => {
                //se tiver item apos o filtro, fica visivel e vira flexbox

                if (li.textContent.toLowerCase().includes(searchTerm)) {
                    isAnyItemVisible = true;
                }
            });

            // se tiver item, aperece card da estacao
            if (isAnyItemVisible) {
                parentCard.style.display = 'block'; 
            }
        });
    });
});
function showGridLoading(isLoading) {
    const gameBoard = document.querySelector('.game-board');
    if (isLoading) {
        const loadingSpinner = document.createElement('div');
        loadingSpinner.classList.add('loading-spinner');
        gameBoard.appendChild(loadingSpinner);
    } else {
        const loadingSpinner = gameBoard.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.remove();
        }
    }
}



function previousPage() {
    const prevPage = currentPage - 1;
    console.log("Previous page ",prevPage);
    if (currentPage > 1 && getFromLocalStorage('gemma-' + prevPage)) {
        console.log("Fetching previous page...", prevPage)
        currentPage = prevPage;
        backend(prevPage);
    } else {
        console.log("No previous page available.");
    }
}

function nextPage() {
    const nextPage = currentPage + 1;
    console.log("Next page ",nextPage);
    if (currentPage < gamecount  && getFromLocalStorage('gemma-' + nextPage)) {
        console.log("Fetching next page...", nextPage)
        currentPage = nextPage;
        backend(nextPage);
    } else {
        console.log("No next page available.");
        fetchFromLLM();
    }
}

function refreshPage(){
    location.reload();
}
const cardContainer = document.getElementById('cardContainer');
const allCategories = document.getElementById('allCategories');
const modal = document.getElementById('my_modal_1');
const sortBtn = document.getElementById('sortBtn');
const loadSpinner = document.querySelector('.loadSpinner');
const rightBar = document.getElementById('rightBar');




//------------ All Pets API
const apiUrl = 'https://openapi.programming-hero.com/api/peddy/';



//----------- All Category Buttons
async function getallCategories(apiUrl) {
    const response = await fetch(apiUrl + `categories`);
    const data = await response.json();
    data.categories.forEach(category => {
        const  petCategory = document.createElement('button');
        petCategory.classList.add('btn', 'flex', 'w-36')
        petCategory.setAttribute('data-category', category.category);
        petCategory.innerHTML = `
        <img class="w-10" src="${category.category_icon}" alt=""> <span> ${category.category}
        `
        allCategories.appendChild(petCategory);
    }); 
}

getallCategories(apiUrl);


//-------------------------------- common function to create card
function createCard(pet){
    const  card = document.createElement('div');
    cardContainer.classList.add('grid-cols-3');
        card.innerHTML = `
        <div class="card bg-base-100 w-72 shadow-xl border">
                    <figure class="px-5 pt-5">
                        <img
                        src="${pet.image}"
                        alt="pet"
                        class="rounded-xl" />
                    </figure>
                    <div class="card-body flex ">
                        <h2 class="card-title">${pet.pet_name}</h2>
                        <div class="flex items-center gap-2"><i class="fa-solid fa-dice-d6"></i><p> Breed: ${pet.breed}</p></div>
                        <div class="flex items-center gap-2"><i class="fa-regular fa-calendar-days"></i><p> Birth: ${pet.date_of_birth}</p></div>
                        <div class="flex items-center gap-2"><i class="fa-solid fa-transgender"></i><p> Gender: ${pet.gender}</p></div>
                        <div class="flex items-center gap-2"><i class="fa-solid fa-dollar-sign"></i><p> Price: ${pet.price}</p></div>
                    </div>
                        <div class="flex justify-center"><hr class="w-3/4"></div>
                        <div class="space-x-5 flex justify-center my-5"><button class="btn favoriteBtn"><i class="fa-regular fa-thumbs-up"></i></button><button class="btn adaptBtn">Adopt</button><button class="btn detailsBtn">Details</button></div>
                    
                </div>
    `;
    // }
    
    cardContainer.appendChild(card);

    const detailsBtn = card.querySelector('.detailsBtn');
    const favoriteBtn = card.querySelector('.favoriteBtn');
    const adaptBtn = card.querySelector('.adaptBtn');
    console.log(adaptBtn.innerText);

    detailsBtn.addEventListener('click', ()=>{
    openModal(pet);
    });

    favoriteBtn.addEventListener('click', ()=>{
        addFavorite(pet);
    });

    adaptBtn.addEventListener('click', ()=>{
        const adaptBtn = card.querySelector('.adaptBtn');
        adaptModal(adaptBtn);
        
    });

}

// --------------------Add Favorite Pet at Right Bar Function
function addFavorite(pet){
    const  rightBarElement = document.createElement('div');
    rightBarElement.innerHTML = `
        <figure class="px-5 pt-5">
                        <img
                        src="${pet.image}"
                        alt="pet"
                        class="rounded-xl" />
        </figure>
    `;
    rightBar.appendChild(rightBarElement);
    
}


// ----------- All Pets Cards Showing at the beginning
async function getAllPets(allPetsUrl) {
    const response = await fetch(allPetsUrl + `pets`);
    let data = await response.json();

    data.pets.forEach(pet => {
        createCard(pet);
    });
}
getAllPets(apiUrl);



// --------------------------Spinning Function

function showSpinner(){
    loadSpinner.classList.remove('hidden');
    
}

function hideSpinner(){
    loadSpinner.classList.add('hidden');
}

let activeButton = null;

//--------------------------- Pets shows only by clicked category
allCategories.addEventListener('click', async event => {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')){
        const clickedBtn = event.target.closest('button');
        const btnCategory = clickedBtn.getAttribute('data-category').toLowerCase();
        clickedBtn.classList.add('rounded-full', 'bg-[#0E7A81]');

        
        
        cardContainer.innerHTML = '';
        showSpinner();

        const response = await fetch(apiUrl + `category/${btnCategory}`);
        const data = await response.json();
        
        
        setTimeout(() => {
            hideSpinner();  

            if (data.data.length === 0) {
                // If no pets found, display 'No Content'
                const noContentDiv = document.createElement('div');
                cardContainer.classList.remove('grid-cols-3');
                noContentDiv.classList.add('card', 'bg-base-100', 'max-w-[800px]', 'shadow-xl', 'border', 'text-center');
                noContentDiv.innerHTML = `
                    <figure class="p-5"><img class="w-28" src="/images/error.webp" alt=""></figure>
                    <h3 class="text-[#131313] text-2xl font-bold">No Information Available</h3>
                    <div class="p-10">
                        <p class="text-[#131313B3] text-sm">It is a long established fact that a reader will be distracted by the readable content of a page when looking at 
                            its layout. The point of using Lorem Ipsum is that it has a.</p>
                    </div>
                `;
                cardContainer.appendChild(noContentDiv);
            } else {
                // If pets are found, create cards for each pet
                data.data.forEach(pet => {
                    createCard(pet);
                });
            }
        }, 2000); // 2-second delay for loading
    }
});



// --------------------------------------Adopted Modals Function
function adaptModal(adaptBtn) {
    let counter = 3; 
    modal.innerHTML = `
    <div class="modal-box text-center">
        <p class='text-3xl font-bold'>Congratulations!</p>
        <p class='text-xl'>You have adopted your pet</p>
        <span class="countdown font-mono text-6xl">
            <span id="countdownTimer" style="--value:${counter};"></span>
        </span>
    </div>
    `;
    modal.showModal();
    const countdownTimer = document.getElementById('countdownTimer');
    const countdownInterval = setInterval(() => {
        counter--;

        countdownTimer.style.setProperty('--value', counter);


        if (counter <= 0) {
            clearInterval(countdownInterval);  

            
            modal.close();

            adaptBtn.innerText = 'Adopted';
            adaptBtn.disabled = true;
        }
    }, 1000); 
}


//-------------------------------------- Details Modals Function
function openModal(pet){
    modal.innerHTML = `
    <div class="modal-box"> 
        <figure class="px-5 pt-5 w-full flex justify-center items-center">
            <img
            src="${pet.image}"
            alt="Shoes"
            class="rounded-xl w-3/4" />
        </figure>
        <div class="card-body flex ">
            <h2 class="card-title">${pet.pet_name}</h2>
            <div class='flex gap-2'>
                <div>
                    <div class="flex items-center gap-2"><i class="fa-solid fa-dice-d6"></i><p> Breed: ${pet.breed}</p></div>
                    <div class="flex items-center gap-2"><i class="fa-regular fa-calendar-days"></i><p> Birth: ${pet.date_of_birth}</p></div>
                    <div class="flex items-center gap-2"><i class="fa-solid fa-transgender"></i><p> Gender: ${pet.gender}</p></div>
                </div>
                <div>
                    <div class="flex items-center gap-2"><i class="fa-solid fa-dollar-sign"></i><p> Price: ${pet.price}</p></div>
                    <div class="flex items-center gap-2"><i class="fa-solid fa-syringe"></i><p> Vaccinated status: ${pet.vaccinated_status}</p></div>
                </div>
            </div>
        </div>
            <div class="flex justify-center"><hr class="w-3/4"></div>
        <h1 class='font-bold'>Details Information</h1>
        <p class='text-sm p-2'>${pet.pet_details}</p>

        <div class="modal-action w-full">
            <form method="dialog" class='w-full'>
            
            <button class="btn w-full bg-[#0E7A8133] text-[#0E7A81]">Cancel</button>
            </form>
        </div>
    </div>

    `;
    modal.showModal();
}

// --------------------Sorted Button
sortBtn.addEventListener('click', async () => {
    cardContainer.innerHTML = '';

    
        const response = await fetch(apiUrl + `pets`);
        const data = await response.json();
        sorted = data.pets.sort((a,b) => b.price - a.price);

        sorted.forEach(pet => {
            createCard(pet);
        });
})


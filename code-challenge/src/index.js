// add a event to load the beer content
document.addEventListener("DOMContentLoaded", () => {
    const mainBeerContainer = document.querySelector("main")
    const listOfBeers = document.getElementById("beer-list");

    // fetch beer list from server
    fetch("http://localhost:3000/beers")
    .then(response => response.json())
    .then(beerData => {
        listOfBeers.innerHTML = ''
        beerData.forEach(item => {
            logOutAllBeer(item)
        })
    })

    function logOutAllBeer(beerDataItem) {
        let beer = document.createElement("li")
        beer.addEventListener("click", function() {
            renderBeerInfo(beerDataItem)
        })
        beer.innerText = beerDataItem.name
        listOfBeers.appendChild(beer)
    }

    // function to call the beers by id when page loads 
    function renderBeer(id) {
        if(typeof(id) !== 'number') id = parseInt(id)
        fetch(`http://localhost:3000/beers/${id}`)
        .then(response => response.json())
        .then(beer => {
            renderBeerInfo(beer)
        })
    }
// call the function to display the first beer item
    renderBeer(1)

    // add display Reviews function
    function renderReviews(beer, reviewContainer) {
        beer.reviews.forEach(item => {
            let review = document.createElement("li")
            review.innerText = item
            reviewContainer.append(review)
            review.addEventListener("click", function(){
                
            })
        })
    }

// functuin to display beer content 
    function renderBeerInfo(beer) {
        mainBeerContainer.innerHTML = '';

        // create div to hold beer details
        const beerContainer = document.createElement("div")
        beerContainer.setAttribute("class", "beer-details")

        // beer details to be child of beerContainer
        const beerContent = `
            <h2 id="beer-name">${beer.name}</h2>
            <img
            id="beer-image"
            alt=""
            src="${beer.image_url}"
            />
            <p>
            <em id="beer-description">${beer.description}</em>
            </p>
            <form id="description-form">
            <label for="description">Edited Description:</label>
            <textarea id="description"></textarea>
            <button type="submit">Update Beer</button>
            </form>
            <h3>Customer Reviews</h3>
            <ul id="review-list">
            
            </ul>
            <form id="review-form">
            <label for="review">Your Review:</label>
            <textarea id="review"></textarea>
            <button type="submit">Add review</button>
            </form>
        `

        beerContainer.innerHTML = beerContent

        const decriptionContainer = beerContainer.querySelector("#beer-description")

        let descriptionTextArea = beerContainer.querySelector("#description")
        descriptionTextArea.value = beer.description

        let reviewsContainer = beerContainer.querySelector("#review-list")
        renderReviews(beer, reviewsContainer)

        // appends beerContainer as child of mainBeerContainer
        mainBeerContainer.appendChild(beerContainer)
        const id = beer.id

        // add event listener to the review to listen for a submit event
        const reviewForm = beerContainer.querySelector("#review-form")
        reviewForm.addEventListener("submit", function(e){
            e.preventDefault()
            const entry = reviewForm["review"].value
            submitReview(beer, id, entry)
            reviewsContainer.innerHTML = ''
            renderReviews(beer, reviewsContainer)
        })
        
        // add event listener to description  to listen for a submit event
        const editDescriptionForm = beerContainer.querySelector("#description-form")
        editDescriptionForm.addEventListener("submit", function(e) {
            e.preventDefault()
            const editedDesc = descriptionTextArea.value
            submitEditedBeerDescription(beer, id, editedDesc, decriptionContainer)
        })
    }
    
    function submitReview(beer, id, entry) {
        beer.reviews.push(entry)
        const reviews = beer.reviews
        const data = {
            id: id,
            name: beer.name,
            description: beer.description,
            "image_url": beer.image_url,
            reviews: reviews
        }
        
        // send a request to the server update review to server
        fetch(`http://localhost:3000/beers/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => result)
        
    }

    function submitEditedBeerDescription(beer, id, editedDescription, descContainer) {
        const data = {
            id: id,
            name: beer.name,
            description: editedDescription,
            "image_url": beer.image_url,
            reviews: beer.reviews
        }

        // send request to update beer descriptions after editing
        fetch(`http://localhost:3000/beers/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            descContainer.innerText = ''
            descContainer.innerText = result.description
        })
    }
})
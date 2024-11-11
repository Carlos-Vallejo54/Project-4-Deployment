console.log("connected");

const apiUrl = window.location.protocol === 'file:'
  ? 'http://localhost:8080' // Local API server during development
  : ''; // Production API

let contentReviewWrapper = document.querySelector("#reviews-wrapper");

function addContentReview(data) {
    console.log("data", data);
    //creates and appends elements
    let contentName = document.createElement("h3");
    contentName.textContent = `${data.content_type}: ${data.name}, Rating: ${data.rating}`;
    let releaseYear = document.createElement("p");
    releaseYear.textContent = `Year: ${data.release_year}`;
    let genre = document.createElement("p");
    genre.textContent = `Genre: ${data.genre}`;

    // edit and delete
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button"); 
    editButton.onclick = function() {
        console.log("Content id:", data.id);
        loadReviewIntoForm(data);
    };

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = function() {
        deleteReview(data.id);
    };

    // container for each review
    let reviewDiv = document.createElement("div");
    reviewDiv.appendChild(contentName);
    reviewDiv.appendChild(releaseYear);
    reviewDiv.appendChild(genre);
    reviewDiv.appendChild(editButton);
    reviewDiv.appendChild(deleteButton);
    contentReviewWrapper.appendChild(reviewDiv);
}

// load reviews from the server
function loadContentFromServer() {
    fetch("apiUrl/contents")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        contentReviewWrapper.innerHTML = ""; // clear previous content
        data.forEach(addContentReview);
    })
    .catch(function(error) {
        console.error("Error loading reviews:", error);
    });
}

// too add editing
let editingReviewId = null; // Tracks edit mode
function toggleAddReviewHeading() {
    const addReviewHeading = document.querySelector("h3");
    if (editingReviewId) {
        addReviewHeading.style.display = "none";
    } else {
        addReviewHeading.style.display = "block";
    }
}

// fills the form with review being edited
function loadReviewIntoForm(data) {
    document.querySelector("#input-content-type").value = data.content_type;
    document.querySelector("#input-content-name").value = data.name;
    document.querySelector("#input-content-rating").value = data.rating;
    document.querySelector("#input-release-year").value = data.release_year;
    document.querySelector("#input-genre").value = data.genre;
    editingReviewId = data.id;
    toggleAddReviewHeading();
}

// reset function
function resetForm() {
    // clears input fields
    document.querySelector("#input-content-type").value = '';
    document.querySelector("#input-content-name").value = '';
    document.querySelector("#input-content-rating").value = '';
    document.querySelector("#input-release-year").value = '';
    document.querySelector("#input-genre").value = '';

    // resets the button text
    document.querySelector("#add-review-button").textContent = "Add Content";
    editingReviewId = null;
}

// add or update a made review
let addReviewButton = document.querySelector("#add-review-button");
function addOrUpdateReview () {
    let inputContentType = document.querySelector("#input-content-type");
    let inputContentName = document.querySelector("#input-content-name");
    let inputContentRating = document.querySelector("#input-content-rating");
    let inputReleaseYear = document.querySelector("#input-release-year");
    let inputGenre = document.querySelector("#input-genre");
    let data = `content_type=${encodeURIComponent(inputContentType.value)}&name=${encodeURIComponent(inputContentName.value)}&rating=${encodeURIComponent(inputContentRating.value)}&release_year=${encodeURIComponent(inputReleaseYear.value)}&genre=${encodeURIComponent(inputGenre.value)}`;

    // editing is a PUT request
    if (editingReviewId) {
        fetch(`apiUrl/contents/${editingReviewId}`, {
            method: "PUT",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(function(response) {
            if (response.status === 200) {
                // resets form and reloads reviews
                resetForm();
                loadContentFromServer();
            }
        })
        .catch(function(error) {
            console.error("Error updating review:", error);
        });
    } else {
        // a POST request to add a new review
        fetch("apiUrl/contents", {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(function(response) {
            if (response.status === 201) {
                resetForm();
                loadContentFromServer();
            }
        })
        .catch(function(error) {
            console.error("Error creating review:", error);
        });
    }
}

// deletes a review
function deleteReview(reviewId) {
    if (confirm("Are you sure you want to delete this review?")) {
        fetch(`apiUrl/contents/${reviewId}`, {
            method: "DELETE",
        })
        .then(function(response) {
            if (response.status === 200) {
                loadContentFromServer();
            }
        })
        .catch(function(error) {
            console.error("Error deleting review:", error);
        });
    }
}

addReviewButton.onclick = addOrUpdateReview;
loadContentFromServer();

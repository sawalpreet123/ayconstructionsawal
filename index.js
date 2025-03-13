 
function openModal(src) {
       document.getElementById("modalImage").src = src;
       document.getElementById("imageModal").style.display = "flex";
    }
       function closeModal() {
       document.getElementById("imageModal").style.display = "none";
    }
    document.addEventListener("DOMContentLoaded", async function () {
    const adminUsername = "ayconstructionhsp";
    const storedPasswordHash = "2feb7d661b64632928f561852957f5c2f6d53f1b086ebcd5d7c4c6a464caad06";


    const reviewForm = document.getElementById("reviewForm");
    const reviewsList = document.getElementById("reviewsList");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const adminLogin = document.getElementById("adminLogin");
    const toggleAdminLogin = document.getElementById("toggleAdminLogin");
    const ratingInput = document.getElementById("rating");
    const stars = document.querySelectorAll(".star");
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    let isAdmin = sessionStorage.getItem("isAdmin") === "true";

    toggleAdminLogin.addEventListener("click", function () {
        adminLogin.style.display = adminLogin.style.display === "none" ? "block" : "none";
    });

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    loginBtn.addEventListener("click", async function () {
        const inputUsername = document.getElementById("adminUsername").value;
        const inputPassword = document.getElementById("adminPassword").value;
        const inputHash = await hashPassword(inputPassword);

        if (inputUsername === adminUsername && inputHash === storedPasswordHash) {
            sessionStorage.setItem("isAdmin", "true");
            isAdmin = true;
            adminLogin.style.display = "none";
            logoutBtn.style.display = "block";
            alert("Login successful!");
            displayReviews();
        } else {
            alert("Invalid username or password.");
        }
    });

    logoutBtn.addEventListener("click", function () {
        sessionStorage.removeItem("isAdmin");
        isAdmin = false;
        logoutBtn.style.display = "none";
        alert("Logged out successfully!");
        displayReviews();
    });

    function displayReviews() {
        reviewsList.innerHTML = "";
        reviews.forEach((review, index) => {
            const reviewItem = document.createElement("div");
            reviewItem.classList.add("review-item");
            reviewItem.innerHTML = `<strong>${review.name}</strong><p>${review.text}</p><p>Rating: ${'★'.repeat(review.rating)}</p>`;
            
            if (isAdmin) {
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-btn");
                deleteButton.addEventListener("click", function () {
                    deleteReview(index);
                });
                reviewItem.appendChild(deleteButton);
            }
            reviewsList.appendChild(reviewItem);
        });
    }

    function deleteReview(index) {
        if (isAdmin) {
            reviews.splice(index, 1);
            localStorage.setItem("reviews", JSON.stringify(reviews));
            displayReviews();
        } else {
            alert("Only admin can delete reviews.");
        }
    }

    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const reviewText = document.getElementById("review").value;
        const rating = parseInt(ratingInput.value) || 0;

        if (name && reviewText && rating > 0) {
            reviews.push({ name: name, text: reviewText, rating: rating });
            localStorage.setItem("reviews", JSON.stringify(reviews));
            displayReviews();
            reviewForm.reset();
            ratingInput.value = "0";
        } else {
            alert("Please provide a rating!");
        }
    });

    stars.forEach(star => {
        star.addEventListener("click", function () {
            const selectedRating = parseInt(this.getAttribute("data-value"));
            ratingInput.value = selectedRating;
            stars.forEach(s => {
                s.classList.remove("selected");
                if (parseInt(s.getAttribute("data-value")) <= selectedRating) {
                    s.classList.add("selected");
                }
            });
        });
    });

    if (isAdmin) {
        adminLogin.style.display = "none";
        logoutBtn.style.display = "inline-block";
    }

    displayReviews();
});
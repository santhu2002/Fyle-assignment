let currentPage = 1;
const repositoriesPerPage = 10; // Default number of repositories per page



function fetchRepositories(currentPage) {
    const username = document.getElementById('username').value;

    const userApiUrl = `https://api.github.com/users/${username}`;

    // Fetch user details
    fetch(userApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found or error in fetching user details');
            }
            return response.json();
        })
        .then(user => {
            // Display user details
            const userDiv = document.getElementById('profile');
            userDiv.innerHTML = '';
            const userCard = document.createElement('div');

            userCard.className = 'mb-3';
            userCard.style = 'width: 47%;';
            userCard.innerHTML = `
                <div style="
                    display: flex;
                    flex-wrap: wrap;
                    align-content: center;
                    justify-content: space-evenly;
                    align-items: center;
                ">
                    <img src="${user.avatar_url}" alt="avatar" style="width:100px;height:100px;border-radius:50%;margin:0 auto;display:block">
                    <div>
                        <a class="link-underline-primary" href="${user.html_url}" target="_blank"><h3>${user.name}</h3></a>
                        <p class="card-text">${user.bio || 'No description available.'}</p>
                        <p class="card-text">Followers: ${user.followers}</p>
                        <p class="card-text">Location: ${user.location}</p>
                    </div>
                </div>
            `;
            userDiv.appendChild(userCard);

            // Fetch repositories only if the user exists
            const repositoriesApiUrl = `https://api.github.com/users/${username}/repos?per_page=${repositoriesPerPage}&page=${currentPage}`;
            return fetch(repositoriesApiUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error in fetching repositories');
            }
            return response.json();
        })
        .then(repositories => {
            // Display repositories
            displayRepositories(repositories);
            addPagination();
        })
        .catch(error => {
            console.error('Error:', error.message);
            alert('User not found or error occurred. Please check the username.');
        });
}

function displayRepositories(repositories) {
    // console.log(repositories);
    const repositoriesDiv = document.getElementById('repositories');
    repositoriesDiv.innerHTML = '';

    if (repositories.length === 0) {
        repositoriesDiv.innerHTML = '<p>No repositories found for the given user.</p>';
        return;
    }

    repositories.forEach(repository => {
        const repositoryCard = document.createElement('div');
        repositoryCard.className = 'card mb-3';
        repositoryCard.style = 'width: 47%;margin: 0 auto;';
        
        const topicsHTML = repository.topics.map(topic => `<span class="badge text-bg-secondary" style="margin-Right:3px">${topic}</span>`).join('');
    
        repositoryCard.innerHTML = `
            <div class="card-body" >
                <a class="link-underline-primary" href="${repository.html_url}" target="_blank"><h3>${repository.name}</h3></a>
                <p class="card-text">${repository.description || 'No description available.'}</p>
                ${topicsHTML}
            </div>
        `;
        repositoriesDiv.appendChild(repositoryCard);
    });
    
}

function addPagination() {
    const username = document.getElementById('username').value;
    const apiUrl = `https://api.github.com/users/${username}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(user => {
            const totalRepositories = user.public_repos;
            const totalPages = Math.ceil(totalRepositories / repositoriesPerPage);

            const pagination = document.getElementById('pagination');
            pagination.innerHTML = '';
            pagination.style = 'width: 47%;margin: 0 auto;';

            const nav = document.createElement('nav');
            nav.setAttribute('aria-label', 'Page navigation example');

            const ul = document.createElement('ul');
            ul.className = 'pagination';

            const liPrevious = document.createElement('li');
            liPrevious.className = 'page-item';
            liPrevious.addEventListener('click', () => previousPage());
            const aPrevious = document.createElement('a');
            aPrevious.className = 'page-link';
            aPrevious.setAttribute('href', '#');
            aPrevious.setAttribute('aria-label', 'Previous');
            aPrevious.innerHTML = '<span aria-hidden="true">&laquo;</span>';
            liPrevious.appendChild(aPrevious);

            ul.appendChild(liPrevious);

            for (let i = 1; i <= totalPages; i++) {
                const liPage = document.createElement('li');
                liPage.className = 'page-item';
                liPage.addEventListener('click', () => changePage(i));
                const aPage = document.createElement('a');
                aPage.className = 'page-link';
                aPage.setAttribute('href', '#');
                aPage.innerText = i;
                liPage.appendChild(aPage);
                ul.appendChild(liPage);
            }

            const liNext = document.createElement('li');
            liNext.className = 'page-item';
            liNext.addEventListener('click', () => nextPage());
            const aNext = document.createElement('a');
            aNext.className = 'page-link';
            aNext.setAttribute('href', '#');
            aNext.setAttribute('aria-label', 'Next');
            aNext.innerHTML = '<span aria-hidden="true">&raquo;</span>';
            liNext.appendChild(aNext);

            ul.appendChild(liNext);

            nav.appendChild(ul);
            pagination.appendChild(nav);
        })
        .catch(error => console.error('Error fetching user details:', error));
}


function nextPage() {
    // Assuming there is only one element with the 'pagination' class
    const ulElement = document.getElementsByClassName('pagination')[0];
    const liElements = ulElement.querySelectorAll('li');
    const numberOfLiElements = liElements.length;

    if (currentPage < numberOfLiElements - 2) {
        currentPage++;
        fetchRepositories(currentPage);
    }
}


function previousPage() {
    
    if (currentPage > 1) {
        currentPage--;
        fetchRepositories(currentPage);
    }
}


function changePage(number) {
    currentPage = number;
    fetchRepositories(currentPage);
}



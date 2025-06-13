document.getElementById('searchField').addEventListener('input', function(event) {
    let searchText = event.target.value;
  
    // Si le champ de recherche est vide, on recharge toutes les dépenses
    if (searchText.length === 0) {
      // Envoi de la requête pour récupérer toutes les dépenses
      fetch('/search-expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value  // CSRF Token
        },
        body: JSON.stringify({ searchText: '' })  // Recherche vide pour récupérer tout
      })
      .then(response => response.json())
      .then(data => {
        let tableBody = document.querySelector('.table-body');
        tableBody.innerHTML = '';  // Vide les résultats existants avant de les remplir
  
        // Remplir la table avec toutes les dépenses
        data.forEach(expense => {
          let row = document.createElement('tr');
          row.innerHTML = `
            <td>${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>${expense.date}</td>
            <td>
              <a href="/edit-expense/${expense.id}" class="btn btn-secondary btn-sm">Edit</a>
            </td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Error:', error));
  
      document.querySelector('.no-results').style.display = 'none';  // Cache le message "No results"
      return;
    }
  
    // Envoi de la requête de recherche si le champ n'est pas vide
    fetch('/search-expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value  // CSRF Token
      },
      body: JSON.stringify({ searchText: searchText })
    })
    .then(response => response.json())
    .then(data => {
      let tableBody = document.querySelector('.table-body');
      tableBody.innerHTML = '';  // Vide les résultats existants avant de les remplir
  
      if (data.length === 0) {
        document.querySelector('.no-results').style.display = 'block';  // Affiche "No results" si aucune donnée trouvée
      } else {
        document.querySelector('.no-results').style.display = 'none';  // Cache "No results" si des résultats sont trouvés
        // Remplir la table avec les résultats de la recherche
        data.forEach(expense => {
          let row = document.createElement('tr');
          row.innerHTML = `
            <td>${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>${expense.date}</td>
            <td>
              <a href="/edit-expense/${expense.id}" class="btn btn-secondary btn-sm">Edit</a>
            </td>
          `;
          tableBody.appendChild(row);
        });
      }
    })


});
  
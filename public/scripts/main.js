// public/scripts/main.js
document.getElementById('searchForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const pokemonName = document.getElementById('pokemonName').value;

    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `pokemonName=${pokemonName}`,
        });

        const data = await response.json();
        displayResult(data);
    } catch (error) {
        console.error('Error:', error);
    }
});

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (data.error) {
        resultDiv.innerText = data.error;
    } else {
        const { id, name, height, weight, types, sprites, flavorTextEntries } = data;
        const typesHTML = types.map(type => `<button class="type-button ${type.type.name}">${type.type.name}</button>`).join(' ');

        resultDiv.innerHTML = `<p>ID: ${id}</p>
                               <p>Name: ${name}</p>
                               <p>Height: ${height}</p>
                               <p>Weight: ${weight}</p>
                               <p>Types: ${typesHTML}</p>
                               <img src="${sprites.front_default}" alt="${name}"> <!-- Pokémon sprite -->
                               <p>Flavor Text Entries:</p>
                               <table>
                                   <thead>
                                       <tr>
                                           <th>Version</th>
                                           <th>Flavor Text</th>
                                       </tr>
                                   </thead>
                                   <tbody>
                                       ${flavorTextEntries.map(entry => `<tr><td>${entry.version}</td><td>${entry.flavorText}</td></tr>`).join('')}
                                   </tbody>
                               </table>`;
    }
}


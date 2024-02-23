// app.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/search', async (req, res) => {
    const pokemonName = req.body.pokemonName.toLowerCase();
    try {
        // Fetch basic Pokémon details
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const { id, name, height, weight, types } = pokemonResponse.data;

        // Convert height to meters and weight to kilograms
        const heightInMeters = height / 10; // API returns height in decimeters
        const weightInKg = weight / 10; // API returns weight in hectograms

        // Fetch Pokédex entry and flavor text details
        const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        const flavorTextEntries = speciesResponse.data.flavor_text_entries
            .filter(entry => entry.language.name === 'en')
            .map(entry => ({ version: entry.version.name, flavorText: entry.flavor_text }));

        res.json({ id, name, height: heightInMeters, weight: weightInKg, types, flavorTextEntries });
    } catch (error) {
        res.status(404).json({ error: 'Pokémon not found' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

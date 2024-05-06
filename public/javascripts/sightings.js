
async function fetchDBPediaData(plantname){
    let plantName = plantname;
    const endpointUrl = 'https://dbpedia.org/sparql';

    const sparqlQuery = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX dbo: <http://dbpedia.org/ontology/>
            SELECT ?label ?description
            WHERE {
                <http://dbpedia.org/resource/${encodeURIComponent(plantName)}> rdfs:label ?label .
                <http://dbpedia.org/resource/${encodeURIComponent(plantName)}> dbo:abstract ?description .
                FILTER (langMatches(lang(?label), "en") && langMatches(lang(?description), "en"))
            }
            LIMIT 1`;

    const encodedQuery = encodeURIComponent(sparqlQuery);
    const url = `${endpointUrl}?query=${encodedQuery}&format=json`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        return data;
    }

    catch (error) {
        console.error("Error fetching plant data from DBPedia:", error);
    }

}

async function getPlantVerificationStatus(plant) {
    try {
        const data = await fetchDBPediaData(plant.name);
        if (data && data.results && data.results.bindings && data.results.bindings.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error fetching plant verification status:", error);
        return false;
    }
}
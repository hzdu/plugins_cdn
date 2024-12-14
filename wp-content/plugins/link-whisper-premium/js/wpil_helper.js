/**
 * Helper function to parse JSON out of results that have other output included...
 **/
function extractAndValidateJSON(output, expectedIndexes) {
    // Function to find all JSON strings in the output
    function findJSONStrings(output) {
        const jsonStrings = [];
        let openBraces = 0;
        let jsonStart = -1;

        for (let i = 0; i < output.length; i++) {
            if (output[i] === '{') {
                if (openBraces === 0) {
                    jsonStart = i; // Start of a potential JSON object
                }
                openBraces++;
            } else if (output[i] === '}') {
                openBraces--;
                if (openBraces === 0 && jsonStart !== -1) {
                    // We found a complete JSON object
                    jsonStrings.push(output.slice(jsonStart, i + 1));
                    jsonStart = -1;
                }
            }
        }
        return jsonStrings;
    }

    // Function to count the matching indexes in a JSON object
    function countMatchingIndexes(jsonObject, expectedIndexes) {
        let matchCount = 0;
        for (const key of expectedIndexes) {
            if (jsonObject.hasOwnProperty(key)) {
                matchCount++;
            }
        }
        return matchCount;
    }

    // Extract JSON strings from the output
    const jsonStrings = findJSONStrings(output);
    let bestMatch = null;
    let maxMatches = 0;

    // Iterate over each JSON string and parse it
    for (const jsonString of jsonStrings) {
        try {
            const jsonObject = JSON.parse(jsonString);
            const matchCount = countMatchingIndexes(jsonObject, expectedIndexes);

            // If this JSON object has more matching indexes, consider it the best match
            if (matchCount > maxMatches) {
                maxMatches = matchCount;
                bestMatch = jsonObject;
            }
        } catch (error) {
            // Ignore invalid JSON
            continue;
        }
    }

    return bestMatch;
}

function isJSON(output) {
    if(typeof output === 'object'){
        return true;
    }

    try {
        JSON.parse(output);
        return true;  // Output is valid JSON
    } catch (error) {
        return false; // Output is not valid JSON
    }
}
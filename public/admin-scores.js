document.addEventListener('DOMContentLoaded', () => {
    const scoresContainer = document.getElementById('scores-container');
    const loadingMessage = document.getElementById('loading-message');

    // Function to fetch and display the scores
    const fetchScores = async () => {
        try {
            // Fetch data from the server's /scores endpoint
            const response = await fetch('/scores');
            
            // Check if the response was successful
            if (!response.ok) {
                throw new Error('Failed to fetch scores from the server.');
            }
            
            // Parse the JSON data
            const scores = await response.json();
            
            // Hide the loading message
            loadingMessage.classList.add('hidden');

            // Check if there are any scores to display
            if (scores.length === 0) {
                scoresContainer.innerHTML = '<p class="text-center text-xl text-gray-400">No scores have been submitted yet.</p>';
                return;
            }

            // Create a table element
            const table = document.createElement('table');
            table.className = 'min-w-full divide-y divide-gray-700 rounded-lg overflow-hidden shadow-lg';
            
            // Create the table header
            table.innerHTML = `
                <thead class="bg-gray-700">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Submitted On</th>
                    </tr>
                </thead>
                <tbody class="bg-gray-800 divide-y divide-gray-700">
                </tbody>
            `;

            // Populate the table with scores
            const tbody = table.querySelector('tbody');
            scores.forEach(score => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">${score.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${score.score}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${new Date(score.timestamp).toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });
            
            // Add the new table to the container
            scoresContainer.appendChild(table);

        } catch (error) {
            console.error('Error fetching scores:', error);
            loadingMessage.classList.add('hidden');
            scoresContainer.innerHTML = '<p class="text-center text-xl text-red-400">Error fetching scores. Please check the server.</p>';
        }
    };

    // Call the function to fetch scores when the page loads
    fetchScores();
});

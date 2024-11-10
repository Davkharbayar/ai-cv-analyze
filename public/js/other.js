/**
 * Displays a custom alert with a specified message and type.
 * @param {string} proficiencyLevel - The message to display.
 */

function getProficiencyColor(proficiencyLevel) {
    switch (proficiencyLevel.toLowerCase()) {
        case 'beginner':
            return '#f39c12'; // Orange for beginner
        case 'intermediate':
            return '#3498db'; // Blue for intermediate
        case 'advanced':
            return '#2ecc71'; // Green for advanced
        case 'expert':
            return '#9b59b6'; // Purple for expert
        default:
            return '#bdc3c7'; // Gray for undefined levels
    }
}
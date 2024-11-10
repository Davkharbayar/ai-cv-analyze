/**
 * Displays a typewriter effect for the provided text.
 * @param {object} result - The result object containing the AI summary text.
 */
function typeText(result) {
    const typewriterElement = document.getElementById('typewriter');
    typewriterElement.style.display = 'block';

    let index = 0;
    const textToType = result.data.AI_Summary || "No summary provided.";
    typewriterElement.innerHTML = ''; // Clear any existing content

    /**
     * Types each character of the text with a delay for the typewriter effect.
     */
    function typeChar() {
        if (index < textToType.length) {
            const currentChar = textToType.charAt(index);
            typewriterElement.innerHTML = typewriterElement.innerHTML.replace('<span class="cursor"></span>', '') 
                + currentChar 
                + '<span class="cursor"></span>';
            index++;
            setTimeout(typeChar, Math.random() * 10 + 10); // Random delay for realistic effect
        } else {
            typewriterElement.innerHTML = typewriterElement.innerHTML.replace('<span class="cursor"></span>', '') 
                + '<span class="cursor"></span>'; // Keep the cursor at the end
        }
    }

    typeChar();
}

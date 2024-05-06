// Function to handle edit button click
function handleEditButtonClick(event) {
    // Get the clicked element and find the parent list item
    const button = event.target.closest('.edit-button');
    if (button) {
        const listItem = button.closest('.list-group-item');
        if (listItem) {
            // Show the edit mode and hide the display mode
            listItem.querySelector('.edit-mode').classList.remove('d-none');
            listItem.querySelector('.edit-mode-display').classList.add('d-none');

            // Set the value of textarea to the current text
            const nameSpan = listItem.querySelector('.edit-mode-display span');
            listItem.querySelector('textarea').value = nameSpan.textContent;
        }
    }
}

// Function to handle save button click
// Function to handle save button click
function handleSaveButtonClick(event) {
    // Get the clicked element and find the parent list item
    const button = event.target.closest('.edit-save-btn');
    if (button) {
        const listItem = button.closest('.list-group-item');
        if (listItem) {
            // Retrieve the textarea and its data-field attribute
            const textarea = listItem.querySelector('textarea');
            const fieldName = textarea.getAttribute('data-field');

            // Get the value from the textarea
            const newValue = textarea.value;

            // Handle saving the value for the specific field
            // For example, you can send this information to your server or update your state
            console.log(`Field: ${fieldName}, New Value: ${newValue}`);

            // Update the display mode text with the new value from the textarea
            listItem.querySelector('.edit-mode-display span').textContent = newValue;

            // Switch back to display mode
            listItem.querySelector('.edit-mode').classList.add('d-none');
            listItem.querySelector('.edit-mode-display').classList.remove('d-none');
        }
    }
}


// Function to handle cancel button click
function handleCancelButtonClick(event) {
    // Get the clicked element and find the parent list item
    const button = event.target.closest('.edit-cancel-btn');
    if (button) {
        const listItem = button.closest('.list-group-item');
        if (listItem) {
            // Revert to the original value in the textarea
            const nameSpan = listItem.querySelector('.edit-mode-display span');
            listItem.querySelector('textarea').value = nameSpan.textContent;

            // Switch back to display mode
            listItem.querySelector('.edit-mode').classList.add('d-none');
            listItem.querySelector('.edit-mode-display').classList.remove('d-none');
        }
    }
}

// Attach event listeners to all edit, save, and cancel buttons
document.addEventListener('click', function(event) {
    // Handle edit button click
    if (event.target.closest('.edit-button')) {
        const editButton = event.target.closest('.edit-button');
        const listItem = editButton.closest('.list-group-item');

        // Hide the edit button
        editButton.style.display = 'none';

        // Show the edit mode (includes the textarea, save, and cancel buttons)
        listItem.querySelector('.edit-mode').classList.remove('d-none');
        listItem.querySelector('.edit-mode-display').classList.add('d-none');

        // Optionally, focus the textarea for immediate editing
        const textarea = listItem.querySelector('.edit-mode textarea');
        if (textarea) {
            textarea.focus();
        }
    }

    // Handle save button click
    if (event.target.closest('.edit-save-btn')) {
        const saveButton = event.target.closest('.edit-save-btn');
        const listItem = saveButton.closest('.list-group-item');

        // Save the updated value from the textarea
        const textarea = listItem.querySelector('textarea');
        const newName = textarea.value;

        // Update the displayed name
        const nameSpan = listItem.querySelector('.edit-mode-display span');
        nameSpan.textContent = newName;
        handleSaveButtonClick(event);

        // Switch back to display mode
        listItem.querySelector('.edit-mode').classList.add('d-none');
        listItem.querySelector('.edit-mode-display').classList.remove('d-none');

        // Show the edit button again
        listItem.querySelector('.edit-button').style.display = 'inline-block';
    }

    // Handle cancel button click
    if (event.target.closest('.edit-cancel-btn')) {
        const cancelButton = event.target.closest('.edit-cancel-btn');
        const listItem = cancelButton.closest('.list-group-item');

        // Revert the textarea to the original value
        const textarea = listItem.querySelector('textarea');
        const originalName = listItem.querySelector('.edit-mode-display span').textContent;
        textarea.value = originalName;

        // Switch back to display mode
        listItem.querySelector('.edit-mode').classList.add('d-none');
        listItem.querySelector('.edit-mode-display').classList.remove('d-none');

        // Show the edit button again
        listItem.querySelector('.edit-button').style.display = 'inline-block';
    }
});


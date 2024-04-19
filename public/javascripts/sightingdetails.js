document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-btn')) {
        updateSightingDetail(event.target.dataset)
    }
});

function updateSightingDetail(dataset) {
    const id = dataset.id;
    const fieldToUpdate = dataset.field;
    const newValue = dataset.value;

    openSyncPlantsIDB().then((db) => {
        updatePlantDetailsToSync(db, {
            id: id,
            fieldToUpdate: fieldToUpdate,
            newValue: newValue
        });
    });
}
function preventCopy(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        alert('Copying is disabled!');
    }
}

function preventContextMenu(event) {
    event.preventDefault();
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        alert('Copying is disabled!');
    }
  }

const addBlockers = () => {

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventCopy);
    console.log('done1')
}

const removeBlockers = () => {
    document.removeEventListener('contextmenu', preventContextMenu);
    document.removeEventListener('keydown', preventCopy);
    console.log('done')
}

export {addBlockers, removeBlockers}
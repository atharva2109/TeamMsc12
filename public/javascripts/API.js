function API() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDvba_AADmYUKZcMBmOnZGD0xIxCYQxT1s&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);
}
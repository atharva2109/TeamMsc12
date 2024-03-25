function API() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyARXO1sAXfsUdl_wxOfVJFFT3naSjyyoII&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);
}
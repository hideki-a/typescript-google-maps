import Swiper from "swiper";

interface GoogleMapOptions {
    selector: string;
    jsonPath: string;
    zoom?: number;
    center?: google.maps.LatLngLiteral;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
    zoomControl?: boolean;
    mapIcon?: {
        normal: object,
        active: object
    };
}

interface Location {
    id: number;
    name: string;
    address: string;
    latLng: google.maps.LatLngLiteral;
    url?: string;
}

interface LocationData {
    result: number;
    items?: Location[];
}

export class GoogleMap {
    map: google.maps.Map;
    markers: google.maps.Marker[];
    activeMarkerIndex: number;
    swiper: Swiper;
    options: GoogleMapOptions;

    constructor(options: GoogleMapOptions) {
        this.map = null;
        this.markers = [];
        this.activeMarkerIndex = -1;
        this.swiper = null;
        this.options = {
            selector: null,
            jsonPath: null,
            zoom: 12,
            center: {
                lat: 35.681236,
                lng: 139.767125
            },
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            mapIcon: {
                normal: {
                    url: 'https://maps.google.com/mapfiles/ms/micons/ltblue-dot.png'
                },
                active: {
                    url: 'https://maps.google.com/mapfiles/ms/micons/red-dot.png'
                }
            }
        };

        this.options = {...this.options, ...options};
    }

    init() {
        this.initMap();
        this.initSwiper();
        this.fetchJSON().then(data => {
            if (data.items && data.items.length) {
                this.setMarkersOnMap(data.items);
                this.makeSwiperSlide(data.items);
            }
        });
    }

    initMap() {
        this.map = new google.maps.Map(
            document.querySelector(this.options.selector + ' .map-container'),
            {
                zoom: this.options.zoom,
                center: this.options.center,
                clickableIcons: false,
                mapTypeControl: this.options.mapTypeControl,
                streetViewControl: this.options.streetViewControl,
                fullscreenControl: this.options.fullscreenControl,
                zoomControl: this.options.zoomControl
            }
        );

        // this.map.addListener('dragend', () => {
        //     const mapCenter = this.map.getCenter();
        //     const centerLat = mapCenter.lat();
        //     const centerLng = mapCenter.lng();
        //     console.log('lat: %s, lng: %s', centerLat, centerLng);
        // });
    }

    initSwiper() {
        this.swiper = new Swiper(this.options.selector + ' .swiper-container', {
            direction: 'horizontal',
            navigation: {
                nextEl: this.options.selector + ' .swiper-button-next',
                prevEl: this.options.selector + ' .swiper-button-prev'
            }
        });
        this.swiper.on('slideChange', () => {
            let index = this.swiper.realIndex;
            this.setIconImage(index);
        });
    }

    fetchJSON(): Promise<LocationData> {
        return fetch(this.options.jsonPath)
            .then(response => {
                return response.json().then(data => data as LocationData);
            })
    }

    setMarkersOnMap(locations: Location[]) {
        this.markers = locations.map((location, index) => {
            let marker = new google.maps.Marker({
                position: location.latLng,
                icon: this.options.mapIcon.normal,
                map: this.map
            });
            marker.addListener('click', () => {
                this.swiper.slideTo(index);
                this.setIconImage(index);
                this.activeMarkerIndex = index;
            });

            return marker;
        });

        this.activeMarkerIndex = 0;
        this.setIconImage(0);
    }

    setIconImage(activateIndex: number) {
        if (this.activeMarkerIndex > -1) {
            this.markers[this.activeMarkerIndex].setIcon(this.options.mapIcon.normal);
        }
        this.markers[activateIndex].setIcon(this.options.mapIcon.active);
        this.activeMarkerIndex = activateIndex;
    }

    makeSwiperSlide(locations: Location[]) {
        let slides = locations.map(location => {
            return `<li class="GoogleMap__swiperSlide swiper-slide">${location.name}<br>
                ${location.address}<br>
                <a href="${location.url}" target="_blank">${location.url}</a></li>`;
        });
        this.swiper.appendSlide(slides);
    }
}

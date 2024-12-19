document.addEventListener("DOMContentLoaded", function () {
    // Pastikan ID-nya benar
    var map = L.map('mapid', {
        center: [-6.114185,120.46417],  // Koordinat yang benar
        zoom: 18,
        minZoom: 15,
        maxZoom: 20
    });

    // Menambahkan tile layer (gambar peta dasar)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Menambahkan marker pada lokasi tertentu
    const umkmData = {
        name: "Decoral cafe & carwash",
        rating: "5.0",
        reviews: 1,
        category: "Tempat nyantai",
        imageUrl: "/.fto.jpg",
        buka: "Buka · Tutup pukul 22.04 🔻",
        alamat: "Jl. WR. Supratman No.2, Benteng, Kec. Benteng, Kab. Kepulauan Selayar, Sulawesi Selatan 92812, Indonesia",
        phone: "+6285825453794",
        coords: [-6.114185,120.46417]
    };

    const marker = L.marker(umkmData.coords).addTo(map);

    // Menambahkan tooltip permanen pada marker
    marker.bindTooltip(umkmData.name, {
        permanent: true,
        direction: "top",
        className: "marker-tooltip",
    });

    marker.bindPopup(`
        <div class="popup-container">
            <div class="popup-header">${umkmData.name}</div>
            <div class="popup-rating">⭐ ${umkmData.rating} <span>(${umkmData.reviews})</span></div>
            <div class="popup-category">${umkmData.category}</div>
            <img src="./kopitentangkita.jpg" style="height:200px; width:100%"/>
            <div class="popup-address"><i class="fas fa-map-marker-alt"></i> ${umkmData.alamat}</div>
            <div class="popup-contact"><i class="fas fa-phone-alt"></i> ${umkmData.phone}</div>
        </div>
    `);

    // Fungsi untuk memuat GeoJSON ke peta
    function loadGeoJSON(url, styleOptions) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Gagal memuat ${url}: ${response.status}`);
                }
                return response.json();
            })
            .then(geojsonData => {
                L.geoJSON(geojsonData, {
                    style: styleOptions,
                    onEachFeature: function (feature, layer) {
                        if (feature.properties && feature.properties.nama) {
                            layer.bindPopup(`${feature.properties.nama}`);
                        }
                    },
                }).addTo(map);
            })
            .catch(error => console.error`(Kesalahan saat memuat ${url}:, error)`);
    }

    // Memuat GeoJSON dengan gaya default
    loadGeoJSON("./sekolah.geojson", {
        color: "#f0f0f0",
        weight: 1.5,
        opacity: 0.8,
        fillColor: "#45F450",
        fillOpacity: 1,
    });
    loadGeoJSON("./Mesjid.geojson", {
        color: "#f0f0f0",
        weight: 1.5,
        opacity: 0.8,
        fillColor: "#45F450",
        fillOpacity: 1,
    });

    // GeoJSON dengan gaya khusus
    const geojsonFiles = [
        { url: "./BentengUtara.geojson", style: { color: "#f0f0f0", weight: 1.5, opacity: 0.8, fillColor: "red", fillOpacity: 0.2 } },
        { url: "./BentengPusat.geojson", style: { color: "#f0f0f0", weight: 1.5, opacity: 0.8, fillColor: "yellow", fillOpacity: 0.2 } },
        { url: "./BentengSelatan.geojson", style: { color: "#f0f0f0", weight: 1.5, opacity: 0.8, fillColor: "green", fillOpacity: 0.2 } },
        { url: "./jalanBentengAnjay.geojson", style: { color: "#333", weight: 3, opacity: 1 } }
    ];

    // Memuat semua file GeoJSON dalam array
    geojsonFiles.forEach(file => {
        loadGeoJSON(file.url, file.style);
    });

    // Menambahkan kontrol layer (opsional)
    const baseMaps = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    };

    const overlayMaps = {
        "UMKM Marker": marker
    };

    L.control.layers(baseMaps, overlayMaps).addTo(map);
});
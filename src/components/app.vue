<template>
    <div class="q-pa-md example-column-row-width">
        <q-banner inline-actions class="text-white bg-blue">
            <div class="widget-name" style="font-size: 25px;">Isochrones generator</div>
        </q-banner>
        <q-input v-model="distance" filled label="Set the isochrone distance in minutes" />
        <q-select v-model="pathParameter" filled :options="pathOptions" label="Path parameter" />
        <p style="margin-top: 35px;">Selected coordinates:</p>
        <q-input v-model="coordinates[0]" filled label="X" />
        <q-input v-model="coordinates[1]" filled label="Y" />
        <q-btn class="run-button" style="margin-top: 25px;" color="primary" label="Get isochrone" />       
    </div>
</template>

<style>
/* Styles to set if day/night mode toggled */
    .body--light {
        background-color: white;
}
    .body--dark #q-app {
        background-color: rgb(27, 38, 31);
}
</style>

<script>
import { widget, requirejs } from "@widget-lab/3ddashboard-utils";
// import { ref } from "vue";
export default {
    data() {
        return {
            coordinates: [0, 0],
            distance: 0,
            pathParameter: "Car",
            pathOptions: ["Walk", "Bicycle", "Electric bike", "Car"],
            mainColor: widget.getValue("mainColor"),
            mainSize: `${widget.getValue("size")}px`,
            headerColor: "bg-" + widget.getValue("mainColor"),
            pathOptionsObject: {
                "Walk" : "foot-walking",
                "Bycicle": "cycling-regular",
                "Electric bike": "cycling-electric",
                "Car": "driving-car"
            }
        };
    },

    computed: {
        distanceInSeconds() {
        return this.distance * 60;
        }
},
    async mounted() {
    const platformAPI = await requirejs("DS/PlatformAPI/PlatformAPI");
    platformAPI.subscribe("xCity.resolve", result => result.topic === "xCity.onClick" ? this.getCoords(result) : null);
    },

    methods: {
    getCoords(result) {
      console.log(result);
      this.coordinates[0] = result.x;
      this.coordinates[1] = result.y;
    },
    fetchOpenRoutesData() {
        let request = new XMLHttpRequest();
        request.open("POST", "https://api.openrouteservice.org/v2/isochrones/driving-car");
        request.setRequestHeader("Accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8");
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Authorization", "5b3ce3597851110001cf6248575c5a9ab2384617b5665773e5e51a29");
        request.onreadystatechange = function () {
        if (this.readyState === 4) {
            console.log("Status:", this.status);
            console.log("Headers:", this.getAllResponseHeaders());
            console.log("Body:", this.responseText);
        }
        };
        const body = `{"locations":[${this.coordinates[0]},${this.coordinates[1]}],"range":${this.distance}}`;
        request.send(body);
    }
  }
};
</script>

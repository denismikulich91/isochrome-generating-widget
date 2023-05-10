import { widget, disableDefaultCSS, onVisibilityChange, requirejs } from "@widget-lab/3ddashboard-utils";
import { createApp } from "vue";
import App from "./components/app.vue";
import { store } from "./store";
import { Notify, Quasar } from "./plugins/quasar";
import { test } from "./plugins/test";

function start() {
    disableDefaultCSS(true);

    window.title = "Widget Template Vue";
    widget.setTitle(window.title);

    const app = createApp(App);

    app.use(Quasar, { plugins: [Notify] });
    app.use(store);
    app.mount("app");

    console.log(test.name)

    requirejs(["DS/PlatformAPI/PlatformAPI"], (/* PlatformAPI*/) => {
        // use 3DDashboard APIs
    });

    onVisibilityChange((/* visibility  */) => {
        // widget (or fullpage) visibility has changed
        // you can enable/disable periodic data refresh based on visibility
    });
}

widget.addEvent("onLoad", () => {
    start();
});
widget.addEvent("onRefresh", () => {
    // TODO an application data refresh
    // meaning only refresh dynamic content based on remote data, or after preference changed.
    // we could reload the frame [ window.location.reload() ], but this is not a good practice, since it reset preferences
});

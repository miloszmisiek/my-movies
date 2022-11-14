import "bootstrap/dist/css/bootstrap.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App);

app.use(router);
library.add(faPlus);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";

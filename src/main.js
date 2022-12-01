import "bootstrap/dist/css/bootstrap.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faPlus,
  faTrash,
  faEdit,
  faCloudDownload,
  faSpinner,
  faFilm,
  faSadTear,
  faEnvelope,
  faChevronCircleUp,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
require('default-passive-events');

const app = createApp(App);

app.use(router);
library.add(
  faPlus,
  faTrash,
  faEdit,
  faCloudDownload,
  faSpinner,
  faFilm,
  faSadTear,
  faEnvelope,
  faLinkedin,
  faGithub,
  faChevronCircleUp,
  faChevronCircleDown
);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";

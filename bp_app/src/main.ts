/**
 * @file main.ts
 * @description This is main script of file. 
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

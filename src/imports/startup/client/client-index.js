import { Meteor } from 'meteor/meteor';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { sync } from 'vuex-router-sync';
import { VuexAltPlugin } from 'vuex-alt';

import { createRouter as createRouterOriginal } from './../../modules/router/client/lib/router';
import { createStore as createStoreOriginal } from './../../modules/store/client/lib/store';
import App from './App.vue';

/**
 * Export the setup of Vue, and allow overriding of the store and
 * router factory functions. Mostly for unit tests.
 * @param {Object} params
 * @param {Function} [params.createStore]     optional, function that returns a configured Vuex store
 * @param {Function} [createRouter]           optional, function that returns a configured VueRouter instance
 */
export const setupVue = ({
  createStore = createStoreOriginal,
  createRouter = createRouterOriginal
 } = {}) => {
  Vue.use(VueRouter);
  Vue.use(Vuex);

  const store = createStore();
  const router = createRouter();

  Vue.use(VuexAltPlugin, { store });

  sync(store, router);

  return { store, router };
};

// client application startup
Meteor.startup(() => {
  const { store, router } = setupVue();

  new Vue({
    render: h => h(App),
    router,
    store
  }).$mount('#app');
});

import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: "#119DA4",
            secondary: "#171b34",
            accent: "#3D87E4",
            error: colors.red.accent3,
            background: "#EEEEEE",
          },
          dark: {
            primary: colors.blue.lighten3, 
            background: colors.indigo.base,
          },
        },
      },
    })

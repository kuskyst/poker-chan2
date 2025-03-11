// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import vuetify from '~/utils/vuetify'

export default defineNuxtPlugin((app) => {
  app.vueApp.use(vuetify)
})
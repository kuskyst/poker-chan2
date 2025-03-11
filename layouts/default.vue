<template>
  <v-app>
    <Transition>
      <slot/>
    </Transition>
  </v-app>
</template>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
  user-select: none;
}
.v-enter-active {
    transition: opacity 2s;
}
.v-enter-active {
    transition: opacity 2s reverse;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>
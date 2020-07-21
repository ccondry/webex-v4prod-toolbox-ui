<template>
  <div>
    <section class="app-main">
      <div class="container is-fluid is-marginless app-content">
        <transition
        mode="out-in"
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
        appear>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </section>
</div>
</template>

<style lang="scss">
.app-main {
  padding-top: 40px;
  // enable hardware acceleration
  transform: translate3d(0, 0, 0);
}

.app-content {
  padding: 20px;
}
</style>

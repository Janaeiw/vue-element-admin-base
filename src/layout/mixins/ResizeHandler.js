import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  watch: {
    $route() {
      if (this.device === 'mobile' && this.aside.opened) {
        store.dispatch('app/closeAside', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$resizeHandler)
  },
  mounted() {
    const isMobile = this.$isMobile()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeAside', { withoutAnimation: true })
    }
  },
  methods: {
    // use $ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeAside', { withoutAnimation: true })
        }
      }
    }
  }
}

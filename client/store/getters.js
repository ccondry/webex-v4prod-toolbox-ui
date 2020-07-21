export const pkg = state => state.pkg
export const app = state => state.app
export const device = state => state.app.device
export const sidebar = state => state.app.sidebar
export const effect = state => state.app.effect
export const menuitems = state => state.menu.items
export const authEnabled = () => true
export const loading = state => state.loading
export const working = state => state.working
export const defaults = state => state.defaults
export const production = () => process.env.NODE_ENV === 'production'
export const demoConfigId = state => state.demoConfigId

import { ToastProgrammatic as Toast } from 'buefy'

function openNotification ({
  title = '',
  message = '',
  type = '',
  duration = 5000
}) {
  Toast.open({
    duration,
    message,
    // position: 'is-bottom',
    type: 'is-' + type
  })
}

const actions = {
  notification ({state}, options) {
    openNotification({
      title: options.title || '',
      message: options.message || '',
      type: options.type || 'info',
      duration: options.duration || 6000
    })
  },
  successNotification ({state}, options) {
    openNotification({
      title: options.title,
      message: options.message,
      type: 'success',
      duration: options.duration || 2500
    })
  },
  errorNotification ({state}, options) {
    openNotification({
      title: options.title,
      message: options.message,
      type: 'danger',
      duration: options.duration || 8000
    })
  },
  infoNotification ({state}, options) {
    openNotification({
      title: options.title,
      message: options.message,
      type: 'info',
      duration: options.duration || 6000
    })
  },
  warningNotification ({state}, options) {
    openNotification({
      title: options.title,
      message: options.message,
      type: 'warning',
      duration: options.duration || 6000
    })
  }
}

export default {
  actions
}

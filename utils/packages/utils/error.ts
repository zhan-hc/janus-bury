/**
 * 页面报错异常监听
 */
export const errorReport = (callback: (data: any) => void) => {
  window.addEventListener("error", (event) => {
    callback({
      event_type: 'error',
      event_msg: JSON.stringify({
        msg: event.message,
        file:  event.filename,
        lineno:  event.lineno,
        colno:  event.colno
      })
    });
    event.preventDefault(); // 阻止默认行为
  }, true)
}


export const rejectReport = (callback: (data: any) => void) => {
  window.addEventListener("unhandledrejection", (event) => {
    console.log(event, 'event')
    callback({
      event_type: 'rejectError',
      event_msg: JSON.stringify({
        reason: event.reason
      })
    });
  });
}


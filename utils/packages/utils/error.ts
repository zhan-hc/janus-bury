/**
 * 页面报错异常监听
 */
export const errorReport = (callback: (data: any) => void) => {
  window.addEventListener("error", (event) => {
    const target:any = event.target;
    if (target instanceof HTMLElement) {
      // 资源加载错误
      callback({
        event_type: 'resourceError',
        event_msg: JSON.stringify({
          tag: target.tagName,
          src: (target as any).src || '',
          alt: (target as any).alt || '',
          href: (target as any).href || ''
        })
      });
    } else {
      // 运行时错误
      callback({
        event_type: 'error',
        event_msg: JSON.stringify({
          msg: event.message,
          file:  event.filename,
          lineno:  event.lineno,
          colno:  event.colno
        })
      });
    }
    
    event.preventDefault(); // 阻止默认行为
  }, true)
}


export const rejectReport = (callback: (data: any) => void) => {
  window.addEventListener("unhandledrejection", (event) => {
    callback({
      event_type: 'rejectError',
      event_msg: JSON.stringify({
        reason: event.reason
      })
    });
  });
}


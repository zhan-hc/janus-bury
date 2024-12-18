import { getFetchUrl } from "./common";

/**
 * 请求接口拦截
 */
export const requestReport = (callback: (data: any) => void) => {
  const originalSend = XMLHttpRequest.prototype.send;
  const originalOpen = XMLHttpRequest.prototype.open;
  let params:any = {}
  XMLHttpRequest.prototype.open = function (...args: any) {
    this._customParams = {
      method: args[0],
      url: args[1]
  };
    originalOpen.apply(this, args);
  };

  XMLHttpRequest.prototype.send = function(data) {
    if (this._customParams) {
      this._customParams.data = data;
    }
    this.addEventListener('loadend', () => {
      const { response, status, _customParams  } = this;
      if (_customParams) {
        if (status >= 400 || status ===0) {
          callback({
            event_type: 'reqError',
            event_msg: JSON.stringify({
              ..._customParams,
              response,
              status
            })
          })
        }
        
      }
    });
    originalSend.call(this, data);
  };

  const originalFetch = fetch;
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    try {
      const response = await originalFetch(input, init);
  
      // 检查 HTTP 状态码
      if (!response.ok) {
        callback({
          event_type: 'reqError',
          event_msg: JSON.stringify({
            type: 'HTTP_ERROR',
            status: response.status,
            url: response.url,
            message: response.statusText,
          })
        })
      }
  
      return response;
    } catch (error: any) {
      callback({
        event_type: 'reqError',
        event_msg: JSON.stringify({
          type: 'NETWORK_ERROR',
          status: 0,
          url: getFetchUrl(input),
          message: error.message || '网络/跨域/等未知错误',
        })
      })
      throw new Error(`Fetch 请求失败: ${error.message}`);
    }
  }
}
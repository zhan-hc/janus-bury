export const reportError = (callback: (event: ErrorEvent) => void) => {
  window.addEventListener("error", (event) => {
    callback(event);
    event.preventDefault(); // 阻止默认行为
  }, true)
}
/**
 * JS QUEST - MUNDO 1: BOOTSTRAPPER MVC
 */
document.addEventListener("DOMContentLoaded", () => {
  const model = new Mundo1Model();
  const view = new Mundo1View();
  const controller = new Mundo1Controller(model, view);

  window.__JS_QUEST__ = { model, view, controller };
});

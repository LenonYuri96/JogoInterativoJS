/**
 * JS QUEST - MUNDO 4: BOOTSTRAPPER MVC
 */
document.addEventListener("DOMContentLoaded", () => {
  const model = new Mundo4Model();
  const view = new Mundo4View();
  const controller = new Mundo4Controller(model, view);

  window.__JS_QUEST_MUNDO4__ = { model, view, controller };
});

/**
 * JS QUEST - MUNDO 3: BOOTSTRAPPER MVC
 */
document.addEventListener("DOMContentLoaded", () => {
  const model = new Mundo3Model();
  const view = new Mundo3View();
  const controller = new Mundo3Controller(model, view);

  window.__JS_QUEST_MUNDO3__ = { model, view, controller };
});

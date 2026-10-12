/**
 * JS QUEST - MUNDO 5: BOOTSTRAPPER MVC
 */
document.addEventListener("DOMContentLoaded", () => {
  const model = new Mundo5Model();
  const view = new Mundo5View();
  const controller = new Mundo5Controller(model, view);

  window.__JS_QUEST_MUNDO5__ = { model, view, controller };
});

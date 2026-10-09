/**
 * JS QUEST - MUNDO 2: BOOTSTRAPPER MVC
 */
document.addEventListener("DOMContentLoaded", () => {
  const model = new Mundo2Model();
  const view = new Mundo2View();
  const controller = new Mundo2Controller(model, view);

  window.__JS_QUEST_MUNDO2__ = { model, view, controller };
});

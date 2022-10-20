const Tarea = require("./tarea");
const colors = require("colors");

class Tareas {
  _listado = null;

  constructor() {
    this._listado = {};
  }

  borrarTarea(id) {
    if (this._listado[id]) delete this._listado[id];
  }

  cargarTareasFromArray(tareas = []) {
    console.log({ tareas });
    this._listado = tareas.reduce((prev, current) => {
      prev[current.id] = current;
      return prev;
    }, {});
  }

  creatTarea(desc = "") {
    const tarea = new Tarea(desc);
    this._listado[tarea.id] = tarea;
  }

  get listadoArr() {
    return Object.keys(this._listado).map((key) => this._listado[key]);
  }

  _listadoConFormato(listado) {
    const getTareaInline = (idx, desc, isComplete) =>
      `${colors.green(idx)}. ${desc} :: ${
        isComplete ? "Completada".green : "Pendiente".red
      }\n`;

    const output = listado.reduce((prev, current, idx) => {
      const tareaInline = getTareaInline(
        idx + 1,
        current.desc,
        !!current.completadoEn
      );
      prev += tareaInline;
      return prev;
    }, "");

    return output || "No hay tareas para mostrar".red;
  }

  listadoCompleto() {
    return this._listadoConFormato(this.listadoArr);
  }

  listarCompletadas(completadas = true) {
    const listado = this.listadoArr.filter(
      (tarea) => Boolean(tarea.completadoEn) === completadas
    );
    return this._listadoConFormato(listado);
  }

  getSingleTask(id) {
    return this.listadoArr.filter((tarea) => tarea.id === id).pop();
  }

  toggleCompletadas(ids = []) {
    ids.forEach((id) => {
      const tarea = this._listado[id];
      if (!Boolean(tarea.completadoEn))
        tarea.completadoEn = new Date().toISOString();
    });

    this.listadoArr.forEach((tarea) => {
      if (!ids.includes(tarea.id)) this._listado[tarea.id].completadoEn = null;
    });
  }
}

module.exports = Tareas;

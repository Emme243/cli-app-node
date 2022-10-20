const colors = require("colors");
const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist: mostarListadoChecklist,
} = require("./helpers/inquirer");
const Tareas = require("./models/tareas");

const main = async () => {
  console.clear();

  let opt = "";
  const tareas = new Tareas();
  const tareasDB = leerDB();
  tareas.cargarTareasFromArray(tareasDB);

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1: {
        const desc = await leerInput("Descripción: ");
        tareas.creatTarea(desc);
        break;
      }
      case 2: {
        console.log(tareas.listadoCompleto());
        break;
      }
      case 3: {
        console.log(tareas.listarCompletadas(true));
        break;
      }
      case 4: {
        console.log(tareas.listarCompletadas(false));
        break;
      }
      case 5: {
        const ids = await mostarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;
      }
      case 6: {
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== "0") {
          const tarea = tareas.getSingleTask(id);
          const youSure = await confirmar(
            `¿Seguro que deseas borrar esta tarea?: ${colors.blue(tarea.desc)}`
          );

          if (youSure) {
            tareas.borrarTarea(id);
            console.log("Tarea eliminada".green);
          }
        } else {
          console.log("No se ha eliminado nada".green);
        }

        break;
      }
    }

    guardarDB(tareas.listadoArr);

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();

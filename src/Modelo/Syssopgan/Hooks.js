import { Tarea } from "./Asociaciones.js";
import { Proyecto } from "./Asociaciones.js";


// Escucha el evento save() del modelo Tarea
// Se ejecuta al utilizar create(), update() y save() en el modelo Tarea
Tarea.afterSave(async (task, options) => {
    try {
        // obtener la suma de las tarifas de cada tarea de un proyecto
        const id_proyecto_fk = task.id_proyecto_fk
        const totalTarifa = await Tarea.sum('total_tarifa', { where: { id_proyecto_fk } })
        // console.log(totalTarifa)
        // actualizar el total proyecto
        await Proyecto.update({ total_proyecto: totalTarifa }, { where: { id_proyecto: id_proyecto_fk } })       
    } catch (error) {
        console.error('Error al actualizar el total proyecto de: ' + id_proyecto_fk + ', mensaje: ', error);
    }
  });
Tarea.afterUpdate(async (task, options) => {
    try {
        // obtener la suma de las tarifas de cada tarea de un proyecto
        const id_proyecto_fk = task.id_proyecto_fk
        const totalTarifa = await Tarea.sum('total_tarifa', { where: { id_proyecto_fk } })
        console.log(totalTarifa)
        // actualizar el total proyecto
        await Proyecto.update({ total_proyecto: totalTarifa }, { where: { id_proyecto: id_proyecto_fk } })       
    } catch (error) {
        console.error('Error al actualizar el total proyecto de: ' + id_proyecto_fk + ', mensaje: ', error);
    }
  });

// Escucha el evento destroy() del modelo Tarea
Tarea.afterDestroy(async (task, options) => {
    try {
        // obtener la suma de las tarifas de cada tarea de un proyecto
        const id_proyecto_fk = task.id_proyecto_fk
        let totalTarifa = await Tarea.sum('total_tarifa', { where: { id_proyecto_fk } })    
        if (!totalTarifa || totalTarifa === 0 || totalTarifa === undefined) {
            totalTarifa = 0
        }
        // actualizar el total proyecto
        await Proyecto.update({ total_proyecto: totalTarifa }, { where: { id_proyecto: id_proyecto_fk } })  
    } catch (error) {
        console.error('Error al actualizar el total proyecto de: ' + id_proyecto_fk + ', mensaje: ', error);
    }
  });


// exportar los modelos con sus respectivos hooks
export { Proyecto, Tarea }
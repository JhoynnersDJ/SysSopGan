// todas las associaciones
import Proyecto from "./ProyectoModel.js";
import ResponsableTecnico from "./ResponsableTecnicoModel.js";

ResponsableTecnico.hasMany(Proyecto, {foreignKey: 'id_responsable_tecnico_fk'});
Proyecto.belongsTo(ResponsableTecnico, { foreignKey: 'id_responsable_tec' })


export { Proyecto, ResponsableTecnico };
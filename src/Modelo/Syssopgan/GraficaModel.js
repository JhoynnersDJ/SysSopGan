// Importar Sequelize y la conexión a la base de datos
import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize.js'; // Asegúrate de importar la instancia sequelize adecuadamente

// Definir el modelo Grafica
const Grafica = sequelize.define('Grafica', {
  id_grafica: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  nombre_grafica: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  id_proyecto: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'proyecto', // Nombre de la tabla de referencia
      key: 'id_proyecto', // Clave primaria en la tabla de referencia
    },
  },
}, {
  timestamps: false, // Desactivar las columnas createdAt y updatedAt
});

export { Grafica };

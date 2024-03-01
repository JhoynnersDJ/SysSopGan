// Importar Sequelize y la conexión a la base de datos
import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize.js'; // Asegúrate de importar la instancia sequelize adecuadamente

// Definir el modelo PDF
const PDF = sequelize.define('PDF', {
  id_pdf: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  nombre_pdf: {
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
      model: 'proyecto', 
      key: 'id_proyecto', 
    },
  },
}, {
  timestamps: false, // Desactivar las columnas createdAt y updatedAt
});

export { PDF };

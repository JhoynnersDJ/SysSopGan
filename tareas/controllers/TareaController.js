import tarea from '../model/TareaModel'

export const register = async (req, res) => {
    const { date, start_time, end_time, id_project, id_service } = req.body;
    try {
        const proyectFound = await tarea.findProjectById(id_project);

        if (!proyectFound) return res.status(404).json({message: 'Proyecto no encontrado'});        

        const serviceFound = await tarea.findServiceById(id_service);

        if (!serviceFound) return res.status(404).json({message: 'Servicio no encontrado'});        

        const time = tarea.calulateTotalTime(start_time,end_time);
        res.status(200).json({
            total_time: time
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
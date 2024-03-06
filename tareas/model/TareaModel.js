import userMockup from './TareaMockup.js';

export default class tarea{
    constructor(id_tarea, fecha, hora_inicio,hora_fin,  total_hora,id_proyeccto_fk,id_servicio_fk,feriado_fk, total_tarifa, total_tiempo){
        this.id_tarea = id_tarea;
        this.fecha = fecha;
        this.hora_inicio = hora_inicio;
        this.hora_fin = hora_fin;
        this.total_hora = total_hora;
        this.id_proyeccto_fk = id_proyeccto_fk;
        this.id_servicio_fk = id_servicio_fk;
        this.feriado_fk = feriado_fk;
        this.total_tarifa = total_tarifa;
        this.total_tiempo = total_tiempo;
        
    }
    static save(tarea) {
        return userMockup.saveTarea(tarea);
      }
      static findProjectById(id) {
        return userMockup.findProjectById(id);
      }
      static findServiceById(id) {
        return userMockup.findServiceById(id);
      }
      static calulateTotalTime(dt1, dt2) {
        return userMockup.calulateTotalTime(dt1, dt2);
      }
}
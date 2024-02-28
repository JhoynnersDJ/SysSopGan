export function generarHTML(project,fecha2) {

    // Obtener el nombre del cliente, o una cadena vacía si no hay cliente o nombre
    let nombreCliente = project.cliente ? project.cliente.get('nombre_cliente') : '';

    // Obtener el cliente del proyecto
        let cliente = project.cliente;

    // Obtener el nombre del responsable del cliente, o una cadena vacía si no hay responsable o nombre
    let nombreResponsable = "..."//cliente.responsable_clientes ? cliente.responsable_clientes.get('nombre_responsable_cl') : '';

    function compararFechas(a, b) {
        // Convertir las fechas a objetos Date
        let fechaA = new Date(a.dataValues.fecha);
        let fechaB = new Date(b.dataValues.fecha);
    
        // Devolver la diferencia entre las fechas en milisegundos
        return fechaA - fechaB;
    }
    


    // Ordenar el array de tareas por la fecha en orden ascendente
    project.dataValues.tareas.sort(compararFechas);

    // Generar el HTML de la tabla
    let tableRows = '';
    for (let tarea of project.dataValues.tareas) {
        let serviceName = '';
        if (tarea.dataValues.servicio) {
            serviceName = tarea.dataValues.servicio.nombre;
        }
        tableRows += `
            <tr>
                <td>${tarea.dataValues.fecha}</td>
                <td class="text-center">${tarea.dataValues.hora_inicio}</td>
                <td class="text-right">${tarea.dataValues.hora_fin}</td>
                <td class="text-right">${tarea.dataValues.total_hora}</td>
                <td class="text-right">${serviceName}</td>
                <td class="text-right"></td>
            </tr>
        `;
    }


    

            //console.log(project.dataValues.tarea.id_tarea); 
    // Aquí puedes generar tu HTML basado en los datos de la base de datos
    // Este es solo un ejemplo, deberás adaptarlo a tus necesidades
    return `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice V1</title>
        
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
        
            <link rel="stylesheet" type="text/css" href="styles.css">

            <link rel='stylesheet' href='https://netdna.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'>

            <script src='https://netdna.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js'></script>
        
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        </head>
        
        <div class="container">
            <div class="row">
    				<!-- BEGIN INVOICE -->
					<div class="col-xs-12">
						<div class="grid invoice">
							<div class="grid-body">
								<div class="invoice-title">
									<br>
                                    <div class="row" style="display: flex; justify-content: center;">
                                        <div class="col-xs-12" style="text-align: center;">
                                            <h2>ByteCreativos<br>
                                            <span class="small">Nombre del Proyecto(${project.nombre_proyecto})</span></h2>
                                        </div>
                                    </div>
								</div>
								<hr>
								<div class="row">
									<div class="col-xs-6">
										<address>
											<strong>Nombre del Cliente:${nombreCliente} </strong><br>
											<strong>Persona Responsable:${nombreResponsable} </strong><br>
											<strong>Compañia que se le presto servicio:${nombreCliente} </strong><br>
											<strong>Tecnico: ${project.usuario.dataValues.nombre} ${project.usuario.dataValues.apellido} </strong><br>
										</address>
									</div>
									<div class="col-xs-6 text-right">
										<address>
											<strong>Tarifa por Hora ${project.tarifa}$:</strong><br>
											<strong>Total por Horas: </strong><br>
										</address>
									</div>
								</div>
								<div class="row">
								<div class="row">
									<div class="col-xs-6">
										<address>
											<strong>Fecha de Emision del Documento:</strong><br>
                                            ${fecha2} <br>
										</address>
									</div>
								</div>
								<div class="row">
									<div class="col-md-12">
                                    <div class="row" style="display: flex; justify-content: center;">
                                        <div class="col-xs-12" style="text-align: center;">
                                            <h3>CONTROL DE VISITAS</h3>
                                        </div>
                                    </div>
                                    <table class="table table-striped">
                                        <thead>
                                            <tr class="line">
                                                <td class="text-center"><strong>Fecha</strong></td>
                                                <td class="text-center"><strong>HR.INICIAL</strong></td>
                                                <td class="text-right"><strong>HR.FINAL</strong></td>
                                                <td class="text-right"><strong>TOTAL HORAS</strong></td>
                                                <td class="text-right"><strong>ACTIVIDAD</strong></td>
                                                <td class="text-right"><strong>FIRMA Y SELLO</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${tableRows}
                                        </tbody>
                                    </table>
									</div>									
								</div>
                                    <div class="row" style="display: flex; justify-content: center;">
                                        <div class="col-xs-12" style="text-align: center;">
                                            <p>Firma del Tecnico Responsable<br><strong>_______________________</strong></p>
                                        </div>
                                    </div>
									
								</div>
							</div>
						</div>
					</div>
			</div>
        </div>
        
        </html>

    `;
    
}

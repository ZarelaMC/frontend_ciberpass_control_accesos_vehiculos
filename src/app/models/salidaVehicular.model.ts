export class SalidaVehicular{
    idAccesoVehicular?: number;
    nombreCompleto?: string;
    tipoVehiculoPermitido?: string;
    placaVehiculo?: string;
    fechaRegistro?: Date | string;
    fechaActualizacion?: Date | string; 
    numIncidencias?: string;

}

/*    av.idAccesoVehicular,
    CONCAT(c.nombres, ' ', c.apellidos) AS nombreCompleto,
    p.tipoVehiculoPermitido,
    av.placaVehiculo,
    av.fechaRegistro,
    av.fechaActualizacion,
    c.numIncidencias */
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { salidaVehicularService } from '../../services/salidaVehicular.service';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MenuComponent } from '../../menu/menu.component';
import { MatCommonModule } from '@angular/material/core';
import { AppMaterialModule } from '../../app.material.module';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AccesoVehicular } from '../../models/accesoVehicular.model';
import { MatDialog } from '@angular/material/dialog';
import { AddIncidenciaComponent } from '../add-incidencia/add-incidencia.component';
import { IncidenciaService } from '../../services/incidencia.service';


@Component({
  selector: 'app-add-salida-vehicular',
  templateUrl: './add-salida-vehicular.component.html',
  standalone: true,
  imports: [AppMaterialModule,
    CommonModule, FormsModule, MatCommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule], 
  styleUrls: ['./add-salida-vehicular.component.css'],
})
export class AddSalidaVehicularComponent {
  //Grila
  dataSource:any;

  //Clase para la paginacion
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["nombreCompleto",
                      "tipoVehiculoPermitido"
                      ,"placaVehiculo",
                      "fechaRegistro",
                      "fechaActualizacion", 
                      "accionIncidencia",  
                      "numIncidencias"];

  objUsuario: Usuario = {};


  constructor(
    private salidaVehicularService: salidaVehicularService,
    private tokenService: TokenService,
    private dialogService: MatDialog,
    private incidenciaService: IncidenciaService
  ) {
    this.objUsuario.idUsuario = this.tokenService.getUserId();
    this.refrescarTable();
    
  }

  cargarDatos() {
    this.salidaVehicularService.listarSalidaVehicular().subscribe({
      next: (data) => {
        const formattedData = data.map((item) => ({
          idCliente:item[0],
          nombreCompleto: item[1],
          tipoVehiculoPermitido: item[2],
          placaVehiculo: item[3],
          fechaRegistro: new Date(item[4]),
          fechaActualizacion: item[5] ? new Date(item[5]) : null,
          totalIncidencias: item[6],
          idAccesoVehicular: item[7],
        }));
        this.dataSource.data = formattedData;
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      },
    });
  }

  //Refrescar tabla
  refrescarTable(){
    console.log(">>> REFRESCAR TABLA [ini]");
    this.salidaVehicularService.listarSalidaVehicular().subscribe(
          x => {
            this.dataSource = new MatTableDataSource<AccesoVehicular>(x);
            this.dataSource.paginator = this.paginator
          }
    );

    console.log(">>> REFRESCAR TABLA [fin]");
  }

  registrarSalida(idAccesoVehicular:number) {
    // Obtener la hora actual
    const fechaSalida = new Date();

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas registrar la salida?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.salidaVehicularService.registrarSalida(idAccesoVehicular).subscribe(
            response => {
                if (response.mensaje) {
                    console.log('Salida registrada con éxito:', response.mensaje);
                    Swal.fire({
                        icon: 'success',
                        title: 'Salida registrada',
                        text: `La salida se registró correctamente el ${response.fechaSalida}`
                    });
                } else if (response.error) {
                    console.error('Error al registrar la salida:', response.error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar la salida',
                        text: response.error
                    });
                }
                this.refrescarTable();
                this.cargarDatos();
            },
            error => {
                console.error('Error al registrar la salida:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo registrar la salida debido a un problema en el servidor'
                });
            }
        );
      }
    });
}

  
    //Abrir Modal Registrar Incidencia
    openRegistroDialog(idCliente: number, conductor:string, fechaActualizada:Date){
      console.log(">>> openAddDialog [ini]");
      const dialogo = this.dialogService.open(AddIncidenciaComponent, {data:{ dataIdCliente:idCliente, dataConductor:conductor, dataFechaA:fechaActualizada }});
      console.log(">>> dataConductor  -  " + conductor);
      dialogo.afterClosed().subscribe(result => {
        if (result?.success) {
          console.log("Diálogo cerrado exitosamente");
          this.refrescarTable();
          this.cargarDatos();
        } else {
          console.log("Diálogo cerrado sin éxito");
        }
      });
  
      console.log(">>> openAddDialog [fin]");
    }


    ngOnInit(): void {
      // this.loadWatsonAssistant();
      this.cargarDatos();
    }
}

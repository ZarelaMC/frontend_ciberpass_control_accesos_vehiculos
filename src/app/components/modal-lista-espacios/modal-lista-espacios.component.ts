import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AccesoVehicular } from '../../models/accesoVehicular.model';
import { ParqueosService } from '../../services/parqueos.service';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppMaterialModule } from '../../app.material.module';
import Swal from 'sweetalert2';
import { Parqueos } from '../../models/parqueos.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { CrudEspacioParqueoUpdateComponent } from '../crud-espacio-parqueo-update/crud-espacio-parqueo-update.component';
import { Usuario } from '../../models/usuario.model';
import { Ubicacion } from '../../models/ubicacion.model';
import { TipoParqueo } from '../../models/tipoParqueo.model';
import { TipoVehiculo } from '../../models/tipoVehiculo.model';
import { EstadoEspacios } from '../../models/estadoEspacios.model';

@Component({
  selector: 'app-modal-lista-espacios',
  standalone: true,
  imports: [AppMaterialModule, CommonModule, ReactiveFormsModule, MatStepperModule, MatDialogModule],
  templateUrl: './modal-lista-espacios.component.html',
  styleUrls: ['./modal-lista-espacios.component.css']
})
export class ModalListaEspaciosComponent implements OnInit {

  lstParqueos: Parqueos[] = [];
  lstUbicaciones: Ubicacion[] = [];
  lstTipoParqueo: TipoParqueo[] = [];
  lstTipoVehiculo: TipoVehiculo[] = [];
  lstEstadoEspacios: EstadoEspacios[] = [];
  lstAcceso: AccesoVehicular[] = [];
  parqueos: Parqueos[] = [];
   // Otras propiedades
   isEstadoDisponible: boolean = false;  // Para controlar si el estado es "Disponible"
  //listado

  parqueosPorUbicacion: { [key: number]: Parqueos[] } = {};

  objParqueo: Parqueos = {
    ubicacion: { idUbicacion: -1 },
    tipoParqueo: { idTipoParqueo: -1 },
    tipoVehiculo: { idTipoVehiculo: -1 },
    estadoEspacios: { idEstadoEspacios: -1 }
  };

  objAcceso: AccesoVehicular = {
    cliente: { idCliente: -1, nombres: '', apellidos: '', identificador: '', telefono: '' },
    placaVehiculo: '',  // Campo para la placa del vehículo
    fechaRegistro: '',  // Campo para la fecha de registro
  };
  objUsuario: Usuario = {};

  formsActualiza = this.formBuilder.group({
    validaUbicacion: ['', Validators.min(1)],
    validaTipo: ['', Validators.min(1)],
    validaEstadoEspacios: ['', Validators.min(1)],
    validaNombres: ['', Validators.min(1)],
    validaPlacaVehiculo: ['', Validators.required],  // Validación para la placa
    validaFechaRegistro: ['', Validators.required]  // Validación para la fecha
  });

  constructor(
    private UtilService: UtilService,
    private parqueosService: ParqueosService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private dialogRef: MatDialogRef<CrudEspacioParqueoUpdateComponent>,  // <-- Inyección de MatDialogRef
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.objParqueo = data; // Aquí recibes los datos del parqueo que se va a actualizar
    this.utilService.listaUbicacion().subscribe(x => this.lstUbicaciones = x);
    this.utilService.listaTipoParqueo().subscribe(x => this.lstTipoParqueo = x);
    this.utilService.listaTipoVehiculo().subscribe(x => this.lstTipoVehiculo = x);
    this.utilService.listaEstadoEspacios().subscribe(x => this.lstEstadoEspacios = x);
    this.parqueosService.filtrarAccesosPorParqueo(this.objParqueo.idParqueos!).subscribe(x => this.lstAcceso = x);
    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  ngOnInit(): void {
    this.parqueosService.filtrarAccesosPorParqueo(this.objParqueo.idParqueos!).subscribe((accesos) => {
      this.lstAcceso = accesos;
      if (this.lstAcceso.length > 0) {
        this.objAcceso = this.lstAcceso[0];  // Asignar el primer acceso al objeto
      }
    });
    this.isEstadoDisponible = this.objParqueo.estadoEspacios?.nombreEstadoEspacios === 'Disponible';
      // Deshabilitar los controles cuando se inicia el componente
  this.formsActualiza.get('validaUbicacion')?.disable();
  this.formsActualiza.get('validaTipo')?.disable();
  this.formsActualiza.get('validaEstadoEspacios')?.disable();
  this.formsActualiza.get('validaNombres')?.disable();
  this.formsActualiza.get('validaPlacaVehiculo')?.disable();
  this.formsActualiza.get('validaFechaRegistro')?.disable();
  }
  



  // Método de cancelación
  cancelar() {
    this.dialogRef.close();  // Esto cierra el modal
  }
}

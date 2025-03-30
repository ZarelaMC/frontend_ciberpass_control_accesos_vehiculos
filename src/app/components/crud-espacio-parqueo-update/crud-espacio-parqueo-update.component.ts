import {  Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app.material.module';
import { Ubicacion } from '../../models/ubicacion.model';
import { TipoParqueo } from '../../models/tipoParqueo.model';
import { TipoVehiculo } from '../../models/tipoVehiculo.model';
import { EstadoEspacios } from '../../models/estadoEspacios.model';
import { Parqueos } from '../../models/parqueos.model';
import { Usuario } from '../../models/usuario.model';
import { ParqueosService } from '../../services/parqueos.service';
import { UtilService } from '../../services/util.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Para notificaciones
import { TokenService } from '../../security/token.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-espacio-parqueo-update',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, ReactiveFormsModule, MatStepperModule, MatDialogModule],
  templateUrl: './crud-espacio-parqueo-update.component.html',
  styleUrls: ['./crud-espacio-parqueo-update.component.css'] // <-- Corrección aquí
})
export class CrudEspacioParqueoUpdateComponent implements OnInit {
  lstParqueos: Parqueos[]= [];
  lstUbicaciones: Ubicacion[] = [];
  lstTipoParqueo: TipoParqueo[] = [];
  lstTipoVehiculo: TipoVehiculo[] = [];
  lstEstadoEspacios: EstadoEspacios[] = [];
  parqueos: Parqueos[] = [];
  //listado

  parqueosPorUbicacion: { [key: number]: Parqueos[] } = {};

  objParqueo: Parqueos = {
    ubicacion: { idUbicacion: -1 },
    tipoParqueo: { idTipoParqueo: -1 },
    tipoVehiculo: { idTipoVehiculo: -1 },
    estadoEspacios: { idEstadoEspacios: -1 }
  };
  objUsuario: Usuario = {};

  formsActualiza = this.formBuilder.group({
    validaUbicacion: ['', Validators.min(1)],
    validaTipo: ['', Validators.min(1)],
    validaTipoVehiculo: ['', Validators.min(1)],
    validaEstadoEspacios: ['', Validators.min(1)]
  });

  constructor(
    private snackBar: MatSnackBar, // Opcional, para notificaciones
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
    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  ngOnInit(): void {
    //SACAR EL "DESHABILITADO" DEL CBO (ESTE ES PARA LA ELIMINAICON)
    this.utilService.listaEstadoEspacios().subscribe(x => {
      this.lstEstadoEspacios = x.filter(estado => estado.idEstadoEspacios !== 5);
    });
    //SACAR EL "DESHABILITADO" DEL CBO (ESTE ES PARA LA ELIMINAICON)
    this.UtilService.listaEstadoEspacios().subscribe(x => {
      this.lstEstadoEspacios = x.filter(estado => estado.idEstadoEspacios !== 1);
      // Limitar la lista a los primeros 3 elementos
      this.lstEstadoEspacios = this.lstEstadoEspacios.slice(1, 4);

    });
  }

  // Método de actualización
  actualizar() {
    this.objParqueo.usuarioActualiza = this.objUsuario;
    this.objParqueo.usuarioRegistro = this.objUsuario;

    this.parqueosService.actualizarParqueo(this.objParqueo).subscribe((response) => {
      if (response.error) {
        // Si hay un error, mostramos el mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error en el Registro',
          text: response.error, // Aquí asumimos que `response.error` contiene el mensaje de error
        }); 
      } else {
        // Si no hay error, mostramos el mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Resultado del Registro',
          text: response.mensaje, // Aquí usamos `response.mensaje` si la actualización fue exitosa
        });

        // Refresca la lista de parqueos tras la actualización
        this.parqueosService.listarTodos().subscribe((nuevosParqueos) => {
          this.parqueos = nuevosParqueos; // Actualiza los datos en la lista local
        });

        // Reinicializa el objeto y el formulario después de la actualización
        this.objParqueo = {
          ubicacion: { idUbicacion: -1 },
          tipoParqueo: { idTipoParqueo: -1 },
          tipoVehiculo: { idTipoVehiculo: -1 },
          estadoEspacios: { idEstadoEspacios: -1 }
        };
        this.formsActualiza.reset();
      }
    });
  }

  elimina(obj: Parqueos) {
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el parqueo con ID ${obj.idParqueos}?`);
    if (confirmacion) {
      this.parqueosService.eliminarParqueo(this.objParqueo.idParqueos!).subscribe({
        next: () => {
          this.snackBar.open('Parqueo eliminado correctamente', 'Cerrar', { duration: 3000 });
          // Aquí puedes actualizar la lista si es necesario
        },
        error: (err) => {
          console.error('Error eliminando el parqueo:', err);
          this.snackBar.open('Hubo un error al eliminar el parqueo', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
  

  // Método de cancelación
  cancelar() {
    this.dialogRef.close();  // Esto cierra el modal
  }
}

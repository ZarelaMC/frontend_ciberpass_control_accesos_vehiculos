import { Component, Inject, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilService } from '../../services/util.service';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { TipoIncidencia } from '../../models/tipoIncidencia.model';
import { Incidencia } from '../../models/incidencia.model';
import { Cliente } from '../../models/cliente.model';
import { AccesoVehicular } from '../../models/accesoVehicular.model';
import { IncidenciaService } from '../../services/incidencia.service';
import { clienteService } from '../../services/cliente.service';
import { ingresoVehicularService } from '../../services/ingresoVehicular.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-incidencia',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-incidencia.component.html',
  styleUrl: './add-incidencia.component.css'
})


export class AddIncidenciaComponent {
  imagePreview: string | ArrayBuffer | null = null; 
  selectedFile: File | null = null;   
  lstTipoIncidencia : TipoIncidencia[] = [];
    objUsuario: Usuario  = {};
    maxFileSize = 20 * 1024 * 1024; 

  

    //Objeto para mostrar datos al cargar formulario
    objIncidencia: Incidencia = {
      cliente: {
        identificador: "",
        nombres: "",
        apellidos: "",
        telefono: "",
        idCliente: 0 
      },
      comentario: "",           
      evidencia: "",            
      tipoIncidencia: {
          idTipoIncidencia: 1
      },
      fecha: new Date().toISOString(),  // Se inicializa en formato ISO
      hora: new Date().toLocaleTimeString('es-ES', { hour12: false })  // Se inicializa en HH:mm:ss
    };


      //Validators form
      formRegistro = this.formBuilder.group
      ({
          validaConductor: [{ value: '', disabled: true }, [Validators.required]],
          validaComentarios: ['', [Validators.pattern('[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ,.\s]+$'), Validators.max(300)]], 
          validaTipoIncidencia: ['', [Validators.min(1)]],
          validaFecha: ['', [Validators.required, yearRangeValidator, maxDaysValidator(2), noDiasPosteriores]],
          validaHora: ['', [Validators.required, horaValidaValidator]],
          validaEvidencia: ['']
      });

      
    constructor(private UtilService : UtilService,
              private clienteService: clienteService,
              private IncidenciaService: IncidenciaService,
              private tokenService: TokenService,
              private formBuilder : FormBuilder,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AddIncidenciaComponent>,
              private http: HttpClient) 
    { 

      //this.objIncidencia.idAccesoVehicular = data.dataIdAcceso;
        console.log(">>>> ACCESO  -  " + data);
        console.log(">>>> ID CONDUCTOR  -  " + data.dataIdCliente);
        console.log(">>>> CONDUCTOR  -  " + data.dataConductor);
        console.log(">>>> FECHA ACTUALIZACIÓN  -  " + data.dataFechaA);

        //Llenar cbo Tipo Incidencia
        this.UtilService.listaTipoIncidencia().subscribe(
           x => {
                this.lstTipoIncidencia = x;
           }
        );

        //Traer Acceso relacionado para el registro de la Incidencia
        this.clienteService.buscarClientePorId(this.data.dataIdCliente).subscribe(
          {
            next: (conductor) => {
              if (conductor != null) {
                console.log(">>>> Data del conductor: ", conductor);
                console.log(">>>> ID CONDUCTOR: ", this.data.dataIdCliente);
                this.objIncidencia.cliente = conductor;
              } else {
                console.error("No se encontró conductor para el ID ", this.data.dataConductor);
              }
            },
            error: (err) => {
              console.error("Error al traer el acceso: ", err);
            }
          }
        );
          
        //Captura ID usuario quién registra
        this.objUsuario.idUsuario = this.tokenService.getUserId();
    }




// Manejar la selección de la imagen
onFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0]; 

      // Verificar si el archivo es de tipo imagen
      if (!selectedFile.type.startsWith('image/')) {
          Swal.fire('Error', 'Por favor, selecciona un archivo de imagen válido.', 'error');
          this.selectedFile = null;
          return;
      }

      //Validar tamaño 
      if (selectedFile.size > this.maxFileSize) {
          Swal.fire('Error', 'El tamaño de la imagen no debe exceder los 20 MB.', 'error');
          this.selectedFile = null;
          return;
      }

      // Asignar el archivo seleccionado
      this.selectedFile = selectedFile;

      // Generar la previsualización de la imagen
      const reader = new FileReader();
      reader.onload = () => {
          this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);    
  }
}


  registrar() {
      if (this.selectedFile) {
          // Subir la imagen
          this.IncidenciaService.subirEvidenciaS3(this.selectedFile).subscribe(
              (imageUrl) => {
                  console.log('Imagen cargada: ' + imageUrl);
                  // Una vez obtenida la URL, registrar la incidencia
                  this.objIncidencia.evidencia = imageUrl
                  console.log(">>>> OBJETO INCIDENCIA: -------------------- ", this.objIncidencia);
                  this.IncidenciaService.registrarIncidencia(this.objIncidencia).subscribe(
                      (response) => {
                        Swal.fire({
                            icon: response.error ? 'error' : 'success',
                            title: response.error ? 'Error en el registro' : 'Incidencia registrada exitosamente',
                            text: response.error || response.mensaje
                        });
                        //Limpiar luego de registrar
                        this.imagePreview = null;
                        this.selectedFile = null;

                        this.formRegistro.reset();
                        this.salir();
                      },
                      (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error en el registro',
                            text: error.mensaje
                        });
                        console.error("Error al registrar la incidencia:", error);
                      }
                  );
              },
              (error) => {
                  console.error("Error al subir la imagen:", error);
              }
          );
      }
  }

    //Cerrar modal
    salir(): void {
      // Al cerrar el diálogo explícitamente
      this.dialogRef.close({ success: true });
    }
  

    ngOnInit(): void {
          this.formRegistro.controls.validaConductor.setValue(this.data.dataConductor);

          if (this.data.dataFechaA) {
            const fechaHora = new Date(this.data.dataFechaA);
            this.formRegistro.controls.validaFecha.setValue(fechaHora.toISOString().split('T')[0]); 
            this.formRegistro.controls.validaHora.setValue(fechaHora.toTimeString().slice(0, 5));
          }
      }

}

// Validar que la fecha sea del año actual
export function yearRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const year = new Date(control.value).getFullYear();
      return year !== new Date().getFullYear() ? { 'yearRange': true } : null;
  };
}

// Validar que la fecha sea como máximo 2 días antes de la actual
export function maxDaysValidator(maxDays: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const fechaSeleccionada = new Date(control.value);
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - maxDays);
      return fechaSeleccionada < fechaLimite ? { 'maxDays': true } : null;
  };
}

// Validar que la fecha no sea días posteriores a la actual
export function noDiasPosteriores(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const fechaSeleccionada = new Date(control.value);
      const fechaLimite = new Date();
      fechaLimite.setHours(0, 0, 0, 0); 
      return fechaSeleccionada > fechaLimite ? { 'noDiasPosteriores': true } : null;
  };
}

// Validar que la hora esté entre 07:00 y 23:45
export function horaValidaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const [hora, minutos] = control.value.split(':').map(Number);
      const horaInicio = 7 * 60; // 07:00 en minutos
      const horaFin = 23 * 60 + 45; // 23:45 en minutos
      const minutosTotales = hora * 60 + minutos;
      return minutosTotales < horaInicio || minutosTotales > horaFin ? { 'horaInvalida': true } : null;
  };


}

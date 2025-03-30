import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app.material.module';
import { Ubicacion } from '../../models/ubicacion.model';
import { EstadoEspacios } from '../../models/estadoEspacios.model';
import { TipoUbicacion } from '../../models/tipoUbicacion.model';
import { Usuario } from '../../models/usuario.model';
import { UbicacionService } from '../../services/ubicacion.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ParqueosService } from '../../services/parqueos.service';
import { Parqueos } from '../../models/parqueos.model';

@Component({
  selector: 'app-crud-ubicacion-update',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, ReactiveFormsModule, MatStepperModule],
  templateUrl: './crud-ubicacion-update.component.html',
  styleUrl: './crud-ubicacion-update.component.css'
})
export class CrudUbicacionUpdateComponent implements OnInit {
  lstUbicacion: Ubicacion[] = [];
  lstTipoUbicacion: TipoUbicacion[] = [];
  lstEstadoEspacios: EstadoEspacios[] = [];
  parqueos: Parqueos[] = [];

  objUbicacion: Ubicacion = {
    nombreUbicacion: "",
    tipoUbicacion: { idTipoUbicacion: -1 },
    limiteParqueos: undefined,
    estadoEspacios: { idEstadoEspacios: -1 }
  };

  objUsuario: Usuario = {};

  formsActualiza = this.formBuilder.group({
    validaNombreUbicacion: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ0-9 ]{3,30}$')]],
    validaTipoUbicacion: ['', Validators.min(1)],
    validaLimiteParqueos: ['', [Validators.required, Validators.min(1), Validators.max(300)]],
    validaEstadoEspacios: ['', Validators.min(1)]
  });
  parqueosPorUbicacion: any;

  constructor(

    private UtilService: UtilService,
    private parqueosService: ParqueosService,
    private ubicacionService: UbicacionService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private dialogRef: MatDialogRef<CrudUbicacionUpdateComponent>,  // <-- Inyección de MatDialogRef
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.objUbicacion = data; // Recibes los datos de la ubicación a actualizar
    this.utilService.listaTipoUbicacion().subscribe(x => this.lstTipoUbicacion = x);
    this.utilService.listaEstadoEspacios().subscribe(x => this.lstEstadoEspacios = x);
    this.objUsuario.idUsuario = tokenService.getUserId();
  }


  ngOnInit(): void {
    this.formsActualiza.patchValue({
      validaNombreUbicacion: this.objUbicacion.nombreUbicacion,
    });

    // Saca el "deshabilitado" del CBO
    this.UtilService.listaEstadoEspacios().subscribe(x => {
      this.lstEstadoEspacios = x.filter(estado => estado.idEstadoEspacios !== 1);
      // Limita la lista a los primeros 3 elementos
      this.lstEstadoEspacios = this.lstEstadoEspacios.slice(1, 4);
    });



  }






   agruparPorUbicacion() {
    this.parqueosPorUbicacion = {}; // Limpiamos el objeto antes de agrupar
    this.parqueos.forEach(parqueo => {
      // Verificamos que la ubicación y su id sean válidos
      const idUbicacion = parqueo.ubicacion?.idUbicacion;
      if (idUbicacion !== undefined) {
        // Si no existe la clave de la ubicación, la creamos
        if (!this.parqueosPorUbicacion[idUbicacion]) {
          this.parqueosPorUbicacion[idUbicacion] = [];
        }
        // Agregamos el parqueo al arreglo de la ubicación correspondiente
        this.parqueosPorUbicacion[idUbicacion].push(parqueo);
      }
    });
  }


  
  // Método de actualización de ubicación
  actualizar() {
    // Asegurarte de que el valor del formulario se asigna solo cuando se presiona actualizar
    if (this.formsActualiza.valid) {
      this.objUbicacion.nombreUbicacion = this.formsActualiza.controls.validaNombreUbicacion.value ?? undefined;


      this.objUbicacion.usuarioActualiza = this.objUsuario;
      this.objUbicacion.usuarioRegistro = this.objUsuario;

      this.ubicacionService.actualizarUbicacion(this.objUbicacion).subscribe(response => {
        if (response.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en la Actualización',
            text: response.error,
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Resultado de la Actualización',
            text: response.mensaje,
          });

          this.parqueosService.listarTodos().subscribe((nuevosParqueos) => {
            this.parqueos = nuevosParqueos;
          });

          // Limpiar después de la actualización
          this.objUbicacion = {
            nombreUbicacion: "",
            tipoUbicacion: { idTipoUbicacion: -1 },
            limiteParqueos: undefined,
            estadoEspacios: { idEstadoEspacios: -1 }
          };
          this.formsActualiza.reset();
        }
      });

    }
  }

  elimina(obj: Ubicacion) {
    
  }




  // Método de cancelación
  cancelar() {
    this.dialogRef.close();  // Esto cierra el modal
    this.parqueosService.listarTodos().subscribe((nuevosParqueos) => {
      this.parqueos = nuevosParqueos;

  

      this.parqueosService.listarTodos().subscribe(
        (data: Parqueos[]) => {
          this.parqueos = data;
          // Agrupamos nuevamente los parqueos después de la actualización
          this.agruparPorUbicacion();
        },
        (error) => {
          console.error('Error al cargar los parqueos', error);
        }
      );



      // Limpiamos el formulario y el objeto después de la actualización
      this.objUbicacion = {
        nombreUbicacion: "",
        tipoUbicacion: { idTipoUbicacion: -1 },
        limiteParqueos: undefined,
        estadoEspacios: { idEstadoEspacios: -1 }
      };
      this.formsActualiza.reset();

    });
  }
}


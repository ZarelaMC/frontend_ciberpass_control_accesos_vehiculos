import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ubicacion } from '../models/ubicacion.model';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private baseUrl = 'http://localhost:8090/url/ubicacion'; // Ajustar según AppSettings.URL_CROSS_ORIGIN si lo tienes configurado

  constructor(private http: HttpClient) {}

  // Listar todas las ubicaciones
  listarTodos(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.baseUrl}`);
  }

  // Buscar ubicación por ID
  buscarPorId(idUbicacion: number): Observable<Ubicacion> {
    return this.http.get<Ubicacion>(`${this.baseUrl}/${idUbicacion}`);
  }

  // Registrar nueva ubicación
  registrarUbicacion(ubicacion: Ubicacion): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/registraUbicacion`, ubicacion);
  }

  // Actualizar ubicación existente
  actualizarUbicacion(ubicacion: Ubicacion): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/actualizaUbicacion/${ubicacion.idUbicacion}`, ubicacion);
  }

  // Eliminar ubicación por ID
  eliminarUbicacion(idUbicacion: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/eliminaUbicacion/${idUbicacion}`);
  }

  /* Listar ubicaciones por tipo (descomentar si el método está implementado en el backend)
  listarPorTipo(idTipoUbicacion: number): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.baseUrl}/tipo/${idTipoUbicacion}`);
  }
  */
}

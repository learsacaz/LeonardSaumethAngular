import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private readonly endpoint:string="http://localhost:3002/bp/";

  private header=new HttpHeaders()
  .set("Accept","application/json")
  .set("Content-Type","application/json;charset=utf-8");
  constructor(private http:HttpClient) { }

  private opciones={
    headers:this.header
  }
  public getProduct(direccionApi:string):Observable<any>{
    return this.http.get(this.endpoint+direccionApi,this.opciones);
  }
  public getProducts(direccionApi:string):Observable<any>{
    return this.http.get(this.endpoint+direccionApi,this.opciones);
  }
  public postProducts(direccionApi:string,body:any){
    return this.http.post(this.endpoint+direccionApi,body,this.opciones);
  }
  public putProducts(direccionApi:string,body:any){
    return this.http.put(this.endpoint+direccionApi,body,this.opciones);
  }
  public deleteProducts(direccionApi:string){
    return this.http.delete(this.endpoint+direccionApi,this.opciones);
  }

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Items } from './items';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  items: Items[] = [];

  constructor(private httpClient: HttpClient) { }



  getItems(id: number): Observable<Items[]> {
    return this.httpClient.get<Items[]>("http://localhost:3000/items?list_id=" + id)
  }

  getItemById(id: number): Observable<Items> {
    return this.httpClient.get<Items>("http://localhost:3000/items/" + id);
  }

  getItemsByListId(id: string): Observable<Items[]> {
    return this.httpClient.get<Items[]>("http://localhost:3000/items?list_id=" + id)
  }

  postItem(item: Items): Observable<Items> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.httpClient.post<Items>("http://localhost:3000/items", item, {headers: headers});
  }

  putItem(id: number, item: Items): Observable<Items> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.httpClient.put<Items>("http://localhost:3000/items/" + id, item, {headers:headers});
  }

  deleteItem(id: number): Observable<Items> {
    console.log("deleting: " + id)
    return this.httpClient.delete<Items>("http://localhost:3000/items/" + id);

  } 



}

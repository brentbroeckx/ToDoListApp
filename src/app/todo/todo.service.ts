import { Injectable } from '@angular/core';
import { ToDo } from './todo';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {

  constructor(private httpClient: HttpClient) { 
    
  }

  getTodos(): Observable<ToDo[]> {
    return this.httpClient.get<ToDo[]>("http://localhost:3000/lists");
  }

  getTodoById(id: number): Observable<ToDo> {
    return this.httpClient.get<ToDo>("http://localhost:3000/lists/" + id);
  }

  postTodo(category: ToDo): Observable<ToDo> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.httpClient.post<ToDo>("http://localhost:3000/lists", category, {headers: headers});
}

putTodo(id:number, category: ToDo): Observable<ToDo> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.httpClient.put<ToDo>("http://localhost:3000/lists/" + id, category, {headers: headers});
}

deleteTodo(id: number): Observable<ToDo> {
    return this.httpClient.delete<ToDo>("http://localhost:3000/lists/" + id);
}

}
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToDo } from '../todo';
import { Items } from '../todo-detail/items';
import { ItemsService } from '../todo-detail/items.service';
import { ToDoService } from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todolist: ToDo[] = [];
  todoitems: Items[] = [];
  todolist$: Subscription = new Subscription();
  items$: Subscription = new Subscription();
  deleteTodo$: Subscription = new Subscription();

  errorMessage: string = '';

  constructor(private todoService: ToDoService, private itemsService: ItemsService, private router: Router) { }

  ngOnInit(): void {
    this.getTodoList();
  }

  ngOnDestroy(): void {
    this.todolist$.unsubscribe();
    this.items$.unsubscribe();
    this.deleteTodo$.unsubscribe();
  }

  getTodoList() {
    this.todolist$ = this.todoService.getTodos().subscribe(result => this.todolist = result);
  }

  add() {
    this.router.navigate(['/todo/form'], {state: {mode: 'add'}});
  }

  

  delete(id: number) {

    var deleteTodoItems: Items[] = [];

    this.items$ = this.itemsService.getItems(id).subscribe(result => {
      if (result.length > 0) {
        result.forEach(item => {
          this.deleteTodo$ = this.itemsService.deleteItem(item.id).subscribe();
        });
      }
      this.deleteTodo$ = this.todoService.deleteTodo(id).subscribe();
        this.getTodoList();


    });

    

    
  }

  edit(id: number) {
    this.router.navigate(['/todo/form'], {state: {id: id, mode: 'edit'}});
  }

  detail(id: number) {
    this.router.navigate(['/todo/items/', id]);
  }

  applyStyles(todo: ToDo) {

    var colorChoise = todo.category;
    var textColor = "Black";

    if(colorChoise == "Black") {
      textColor = "White";
    }

    const styles = {
      'background-color': colorChoise,
      'color': textColor
    }

    return styles;

  }

}

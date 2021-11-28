import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToDoService } from '../todo.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, OnDestroy {

  isAdd: boolean = false;
  isEdit: boolean = false;
  todoId: number = 0;

  isSubmitted: boolean = false;
  errorMessage: string = '';
  prevTodoTitle: string = '';
  todoTitleChange: string = '';

  todo$: Subscription = new Subscription();
  postForm$: Subscription = new Subscription();
  putForm$: Subscription = new Subscription();

  todoForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    category: new FormControl('', [Validators.required])
  })



  constructor(private router: Router, private todoService: ToDoService) {
    this.isAdd = this.router.getCurrentNavigation()?.extras.state?.mode === 'add';
    this.isEdit = this.router.getCurrentNavigation()?.extras.state?.mode === 'edit';
    this.todoId = +this.router.getCurrentNavigation()?.extras.state?.id;
    

    if (this.todoId != null && this.todoId > 0) {
      this.todo$ = this.todoService.getTodoById(this.todoId).subscribe(result => {

        this.prevTodoTitle = result.title;

        this.todoForm.setValue({
          title: result.title,
          category: result.category
        });
      });
    }


   }

  ngOnInit(): void {
    this.onChanges();
  }

  ngOnDestroy(): void {
    this.todo$.unsubscribe();
    this.postForm$.unsubscribe();
    this.putForm$.unsubscribe();
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.isAdd) {
      this.postForm$ = this.todoService.postTodo(this.todoForm.value).subscribe(result => {
        this.router.navigateByUrl("");
      },
      error => {
        this.errorMessage = error.message;
      });
    }

    if (this.isEdit) {
      this.putForm$ = this.todoService.putTodo(this.todoId, this.todoForm.value).subscribe(result => {
        this.router.navigateByUrl("");
      }, 
      error => {
        this.errorMessage = error.message;
      });
    }

  }

  back() {
    this.router.navigate(['/']);
  }

  onChanges(): void {
    this.todoForm.get('title')?.valueChanges.subscribe(val => {
      this.todoTitleChange = `Title changed from ${this.prevTodoTitle} => ${val}`
    })
  }



}

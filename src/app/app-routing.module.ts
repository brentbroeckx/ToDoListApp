import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TodoDetailComponent } from './todo/todo-detail/todo-detail.component';
import { TodoItemFormComponent } from './todo/todo-detail/todo-item-form/todo-item-form.component';
import { TodoFormComponent } from './todo/todo-form/todo-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'todo/items/:id', component: TodoDetailComponent},
  { path: 'todo/form', component: TodoFormComponent},
  { path: 'todo/item/form', component: TodoItemFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

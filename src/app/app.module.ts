import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TodoComponent } from './todo/todo.component';
import { TodoListComponent } from './todo/todo-list/todo-list.component';
import { SharedModule } from './shared/shared.module';
import { ToDoService } from './todo/todo.service';

import { HttpClientModule } from '@angular/common/http';
import { TodoDetailComponent } from './todo/todo-detail/todo-detail.component';
import { TodoFormComponent } from './todo/todo-form/todo-form.component';
import { TodoItemFormComponent } from './todo/todo-detail/todo-item-form/todo-item-form.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    TodoComponent,
    TodoListComponent,
    TodoDetailComponent,
    TodoFormComponent,
    TodoItemFormComponent
  ],
  imports: [
    DragDropModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [
    ToDoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Items } from './items';
import { ItemsService } from './items.service';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})
export class TodoDetailComponent implements OnInit, OnDestroy {

  items: Items[] = [];
  todo: Items[] = [];
  active: Items[] = [];
  done: Items[] = [];
  fixedItem : Items[] = [];

  isSubmitted = false;
  errorMessage = '';
  itemId = 0;
  todoId = 0;

  putItem$: Subscription = new Subscription;
  deleteItem$: Subscription = new Subscription;
  
  @Input() clickedItem: Items = {id: 0, description: '', list_id: 0, name: '', date: '', order: 0, status: ''}


  itemForm = new FormGroup({
    list_id: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    date: new FormControl(''),
    status: new FormControl(''),
    order: new FormControl('')
  })

  constructor(
    private itemsService: ItemsService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private modalService: NgbModal,
    private itemService: ItemsService) { }

  ngOnInit(): void {
    const saveTodoId = this.route.snapshot.paramMap.get('id');
    if (saveTodoId != null) {
      this.todoId = +saveTodoId;
      this.getItems(this.todoId);

    }
  }

  ngOnDestroy(): void {
    this.putItem$.unsubscribe();
    this.deleteItem$.unsubscribe();
  }

  openXl(content: any, item: Items) {
    this.setClickedItem(item);
    this.modalService.open(content, { size: 'xl'});
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  getItems(id: number) {
    this.todo = [];
    this.active = [];
    this.done = [];
    this.itemsService.getItems(+id).subscribe(result => this.moveItemsToPosition(result));
  }

  moveItemsToPosition(list: Items[]) {
    list.forEach(item => {  
      if(item.status === "todo") {
        this.todo.push(item);
      } else if (item.status === "active") {
        this.active.push(item);
      } else if (item.status === "done") {
        this.done.push(item);
      }
      
    });

    this.todo.sort((a, b) => this.sortItems(a, b));
    this.active.sort((a, b) => this.sortItems(a, b));
    this.done.sort((a, b) => this.sortItems(a, b));
  }

  sortItems(a: any, b: any) {

    if(a.date != "" && b.date != "") {

      if (a.date < b.date) {
        return -1;
      }
      else {
        return 1
      }
    }
    else {
      if (a.order < b.order) {
        return -1;
      }
      else {
        return 1
      }
    }
  }

  resetLists() {
    this.todo = [];
    this.active = [];
    this.done = [];
  }

  drop(event: CdkDragDrop<Items[]>, typeItem: string) {
    var draggedItem = event.item.data; 

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      draggedItem.order = event.currentIndex;

      this.putItem$ = this.itemService.putItem(draggedItem.id, draggedItem).subscribe(result => {

      });

    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

        draggedItem.order = event.currentIndex;

        if (typeItem != null) {
          draggedItem.status = typeItem;
        } else {
          return;
        }

        this.putItem$ = this.itemService.putItem(draggedItem.id, draggedItem).subscribe(result => {
          
        });

    }

    var latestData = event.container.data;
    
    this.itemsService.getItems(this.todoId).subscribe(result => this.updateAllContainerData(result, latestData));
  
  }

  addItem(itemType: string) {
    const list_id = this.route.snapshot.paramMap.get('id')?.toString();

    if (list_id != null) {
      this.router.navigate(['/todo/item/form'], {state: {listId: list_id, itemType: itemType, mode: 'add'}});
    }
    
  }

  editItem(id: number) {
    this.router.navigate(['/todo/item/form'], {state: {mode: 'edit'}});

  }

  setClickedItem(item: Items) {
    this.itemForm.setValue({
      list_id: item.list_id,
      name: item.name,
      description: item.description,
      date: item.date,
      status: item.status,
      order: item.order
    });
    this.clickedItem = item;
    this.itemId = item.id;
  }

  onSubmit(): void {

    this.isSubmitted = true;

    this.putItem$ = this.itemService.putItem(this.itemId, this.itemForm.value).subscribe(result => {
      //close modal
      if (this.todoId != null) {
        this.resetLists();
        this.getItems(this.todoId);
      };
      this.closeModal();
      this.isSubmitted = false;
    }, error => {
      this.errorMessage = error.message;
    });
  }

  delete(id: number) {
    this.deleteItem$ = this.itemService.deleteItem(id).subscribe(result => {
      this.getItems(this.todoId);
      this.closeModal();
    }, error => {
      this.errorMessage = error.message;
    });
  }

  updateAllContainerData(list: Items[], latestData: Items[]) {

    latestData.forEach(item => {
    
      const itemToCheck = list.find(element => element.id == item.id);

      if (itemToCheck != null) {
        var itemIndex = latestData.indexOf(item);
            
        itemToCheck.order = itemIndex;
        this.putItem$ = this.itemService.putItem(itemToCheck.id, itemToCheck).subscribe(result => {
          console.log("Saved all items in container");
        }); 
      }


            
    });

  }



}

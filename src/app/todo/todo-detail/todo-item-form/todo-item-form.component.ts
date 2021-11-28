import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemsService } from '../items.service';

@Component({
  selector: 'app-todo-item-form',
  templateUrl: './todo-item-form.component.html',
  styleUrls: ['./todo-item-form.component.scss']
})
export class TodoItemFormComponent implements OnInit, OnDestroy {

  isAdd: boolean = false;
  isEdit: boolean = false;
  itemId: number = 0;
  list_id: string = '';
  type: string = '';

  isSubmitted: boolean = false;
  errorMessage: string = '';
  prevItemDesc: string = '';
  itemDescChange: string = '';

  item$: Subscription = new Subscription();
  postItem$: Subscription = new Subscription();
  putItem$: Subscription = new Subscription();

  itemForm = new FormGroup({
    list_id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl(''),
    date: new FormControl(''),
    status: new FormControl('', [Validators.required]),
    order: new FormControl('')
  })

  constructor(private router: Router, private itemService: ItemsService) {
    
    this.isAdd = this.router.getCurrentNavigation()?.extras.state?.mode === 'add';
    this.itemId = +this.router.getCurrentNavigation()?.extras.state?.id;
    this.list_id = this.router.getCurrentNavigation()?.extras.state?.listId;
    this.type = this.router.getCurrentNavigation()?.extras.state?.itemType;

   }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.item$.unsubscribe();
    this.postItem$.unsubscribe();
    this.putItem$.unsubscribe();
  }

  onSubmit(): void {
    this.isSubmitted = true;

    this.itemForm.patchValue({
      list_id: this.list_id,
      order: 0
    });

    if (this.isAdd) {
      this.postItem$ = this.itemService.postItem(this.itemForm.value).subscribe(result => {
        this.router.navigate(['/todo/items/', this.list_id]);
      }, error => {
        this.errorMessage = error.message;
      });
    }

    

  }

  back() {
    this.router.navigate(['/todo/items/', this.list_id]);
  }

}

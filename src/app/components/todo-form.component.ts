import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import TodoRepository from '../repositories/todo.repository';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
      <input type="text" formControlName="title" placeholder="Enter todo" />
      <button
        type="submit"
        [disabled]="
          todoForm.invalid || todoRepository.addTodoMutation.isPending()
        "
      >
        {{
          todoRepository.addTodoMutation.isPending() ? 'Adding...' : 'Add Todo'
        }}
      </button>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        margin-bottom: 20px;
      }
      input {
        flex-grow: 1;
        padding: 10px;
        margin-right: 10px;
      }
      button {
        padding: 10px;
        background-color: #4caf50;
        color: white;
        border: none;
        cursor: pointer;
      }
      button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
    `,
  ],
})
export class TodoFormComponent {
  todoForm: FormGroup;
  private fb = inject(FormBuilder);
  public todoRepository = inject(TodoRepository);

  constructor() {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    if (this.todoForm.valid) {
      this.todoRepository.addTodoMutation.mutate({
        title: this.todoForm.value.title,
        completed: false,
      });
      this.todoForm.reset();
    }
  }
}

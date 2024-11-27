import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Todo, TodoService} from '../services/todo.service';
import { injectMutation } from '@tanstack/angular-query-experimental';
import TodoRepository from '../repositories/todo.repository';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
      <input
        type="text"
        formControlName="title"
        placeholder="Enter todo"
      >
      <button
        type="submit"
        [disabled]="todoForm.invalid || addTodoMutation.isPending()"
      >
        {{ addTodoMutation.isPending() ? 'Adding...' : 'Add Todo' }}
      </button>
    </form>
  `,
  styles: [`
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
      background-color: #4CAF50;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class TodoFormComponent {
  todoForm: FormGroup;
  private todoService = inject(TodoService);
  private fb = inject(FormBuilder);
  private todoRepository = inject(TodoRepository);

  constructor() {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  addTodoMutation = injectMutation(() => ({
    mutationFn: (todo: Todo) => firstValueFrom(this.todoService.addTodo(todo)),
    onSuccess: () => {
      this.todoForm.reset();
      this.todoRepository.todoQuery.refetch()
    }
  }));

  onSubmit() {
    if (this.todoForm.valid) {
      this.addTodoMutation.mutate({
        title: this.todoForm.value.title,
        completed: false
      });
    }
  }
}

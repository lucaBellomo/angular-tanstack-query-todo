import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import TodoRepository from '../repositories/todo.repository';
import {Todo, TodoService} from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="this.todoRepository.todoQuery.isLoading()">Loading...</div>
    <div *ngIf="this.todoRepository.todoQuery.isError()">Error: {{ this.todoRepository.todoQuery.error() }}</div>

    <ul *ngIf="this.todoRepository.todoQuery.isSuccess()">
      <li *ngFor="let todo of this.todoRepository.todoQuery.data()">
        <span [class.completed]="todo.completed">
          {{ todo.title }}
        </span>
        <div>
          <input
            type="checkbox"
            [checked]="todo.completed"
            (change)="this.toggleTodo(todo)"
          >
          <button (click)="this.deleteTodo(todo.id!)">Delete</button>
        </div>
      </li>
    </ul>
  `,
  styles: [`
    .completed {
      text-decoration: line-through;
      color: gray;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    button {
      margin-left: 10px;
      background-color: #ff4444;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
    }
  `]
})
export class TodoListComponent {
  todoRepository = inject(TodoRepository);
  private todoService = inject(TodoService);

  toggleTodo(todo: Todo) {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(updatedTodo).subscribe(() => {
      this.todoRepository.todoQuery.refetch();
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todoRepository.todoQuery.refetch();
    });
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { TodoService, Todo } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="query.isLoading()">Loading...</div>
    <div *ngIf="query.isError()">Error: {{ query.error() }}</div>

    <ul *ngIf="query.isSuccess()">
      <li *ngFor="let todo of query.data()">
        <span [class.completed]="todo.completed">
          {{ todo.title }}
        </span>
        <div>
          <input
            type="checkbox"
            [checked]="todo.completed"
            (change)="toggleTodo(todo)"
          >
          <button (click)="deleteTodo(todo.id!)">Delete</button>
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
  private todoService = inject(TodoService);

  query = injectQuery(() => ({
    queryKey: ['todos'],
    queryFn: () => this.todoService.getTodos().toPromise()
  }));

  toggleTodo(todo: Todo) {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(updatedTodo).subscribe(() => {
      this.query.refetch();
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.query.refetch();
    });
  }
}

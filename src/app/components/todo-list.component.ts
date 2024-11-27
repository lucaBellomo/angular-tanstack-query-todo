import { Component, inject } from '@angular/core';
import TodoRepository from '../repositories/todo.repository';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  template: `
    @if (this.todoRepository.todoQuery.isLoading()) {
      <div>Loading...</div>
    }
    @if (this.todoRepository.todoQuery.isError()) {
      Error: {{ this.todoRepository.todoQuery.error() }}
    }

    @if (this.todoRepository.todoQuery.isSuccess()) {
      <ul>
        @for (todo of this.todoRepository.todoQuery.data(); track todo.id) {
          <li>
            <span [class.completed]="todo.completed">
              {{ todo.title }}
            </span>
            <div>
              <input
                type="checkbox"
                [checked]="todo.completed"
                (change)="this.todoRepository.toggleTodoMutation.mutate(todo)"
              />
              <button
                (click)="
                  this.todoRepository.deleteTodoMutation.mutate(todo.id!)
                "
              >
                Delete
              </button>
            </div>
          </li>
        }
      </ul>
    }
  `,
  styles: [
    `
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
    `,
  ],
})
export class TodoListComponent {
  todoRepository = inject(TodoRepository);
}

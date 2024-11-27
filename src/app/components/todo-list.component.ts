import { Component, inject } from '@angular/core';
import TodoRepository from '../repositories/todo.repository';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  template: `
    @if (this.todoRepository.todoQuery.isLoading()) {
      <span class="loader"></span>
    }
    @if (this.todoRepository.todoQuery.isError()) {
      Error: {{ this.todoRepository.todoQuery.error() }}
    }

    @if (this.todoRepository.todoQuery.isSuccess()) {
      <ul>
        @for (todo of this.todoRepository.todoQuery.data(); track todo.id) {
          <li>
            <span>{{ todo.id }}</span>
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
                (click)="this.todoRepository.deleteTodoMutation.mutate(todo)"
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
        border-radius: 3px;
      }

      .loader {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: inline-block;
        border-top: 4px solid #53818d;
        border-right: 4px solid transparent;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        position: absolute;
        top: 50%;
        left: 50%;
      }

      .loader::after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 0;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border-left: 4px solid #ff3d00;
        border-bottom: 4px solid transparent;
        animation: rotation 0.5s linear infinite reverse;
      }

      @keyframes rotation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class TodoListComponent {
  todoRepository = inject(TodoRepository);
}

import { Component } from '@angular/core';
import { TodoListComponent } from './components/todo-list.component';
import { TodoFormComponent } from './components/todo-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoListComponent, TodoFormComponent],
  template: `
    <div class="container">
      <h1>todo</h1>
      <app-todo-form />
      <app-todo-list />
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
      }
      h1 {
        text-align: center;
        color: #333;
      }
    `,
  ],
})
export class AppComponent {}

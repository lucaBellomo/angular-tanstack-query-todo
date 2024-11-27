import { inject, Injectable } from '@angular/core';
import { Todo, TodoService } from '../services/todo.service';
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { QueryClient } from '@tanstack/query-core';

@Injectable({ providedIn: 'root' })
export default class TodoRepository {
  private todoService = inject(TodoService);
  private queryClient = inject(QueryClient);

  todoQuery = injectQuery(() => ({
    queryKey: ['todos'],
    queryFn: () => firstValueFrom(this.todoService.getTodos()),
    placeholderData: [{ id: 1, title: 'Todo', completed: false }],
  }));

  toggleTodoMutation = injectMutation(() => ({
    mutationFn: (todo: Todo) => {
      const updatedTodo = { ...todo, completed: !todo.completed };
      return this.todoService.updateTodo(updatedTodo).toPromise();
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({
        queryKey: ['todos'],
      });
    },
  }));

  deleteTodoMutation = injectMutation(() => ({
    mutationFn: (id: number) => this.todoService.deleteTodo(id).toPromise(),
    onSuccess: () => {
      this.queryClient.invalidateQueries({
        queryKey: ['todos'],
      });
    },
  }));
}

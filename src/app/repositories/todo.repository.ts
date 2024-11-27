import { inject, Injectable } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class TodoRepository {
  private todoService = inject(TodoService);

  todoQuery = injectQuery(() => ({
    queryKey: ['todos'],
    queryFn: () => firstValueFrom(this.todoService.getTodos()),
  }));
}

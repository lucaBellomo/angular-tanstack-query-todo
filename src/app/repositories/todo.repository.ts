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
      return firstValueFrom(this.todoService.updateTodo(updatedTodo));
    },
    onMutate: (todo: Todo) => {
      // Store the current todos for potential rollback
      const previousTodos = this.todoQuery.data() || [];

      // Optimistically update the query cache
      this.queryClient.setQueryData(
        ['todos'],
        previousTodos.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t,
        ),
      );

      // Return context for potential rollback
      return { previousTodos };
    },
    onError: (error, todo, context) => {
      // Rollback to previous state if mutation fails
      this.queryClient.setQueryData(['todos'], context?.previousTodos || []);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      this.todoQuery.refetch();
    },
  }));

  deleteTodoMutation = injectMutation(() => ({
    mutationFn: (todo: Todo) =>
      firstValueFrom(this.todoService.deleteTodo(todo.id!)),
    onMutate: (todo: Todo) => {
      // Store the current todos for potential rollback
      const previousTodos = this.todoQuery.data() || [];

      // Optimistically remove the todo
      this.queryClient.setQueryData(
        ['todos'],
        previousTodos.filter((t) => t.id !== todo.id),
      );

      // Return context for potential rollback
      return { previousTodos };
    },
    onError: (error, todo, context) => {
      // Rollback to previous state if mutation fails
      this.queryClient.setQueryData(['todos'], context?.previousTodos || []);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      this.todoQuery.refetch();
    },
  }));

  addTodoMutation = injectMutation(() => ({
    mutationFn: (todo: Todo) => firstValueFrom(this.todoService.addTodo(todo)),
    onMutate: (todo: Todo) => {
      // Store the current todos for potential rollback
      const previousTodos = this.todoQuery.data() || [];

      // Optimistically remove the todo
      this.queryClient.setQueryData(['todos'], [todo, ...previousTodos]);

      // Return context for potential rollback
      return { previousTodos };
    },
    onError: (error, todo, context) => {
      // Rollback to previous state if mutation fails
      this.queryClient.setQueryData(['todos'], context?.previousTodos || []);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      this.todoQuery.refetch();
    },
  }));
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Wrapper, Task, TaskPostRequest } from './dtos';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private _http: HttpClient) {
  }

  private tasksUrl = `${environment.baseUrl}/tasks`;

  private httpOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Application-ID': environment.applicationId
    }
  };

  // tasks$ stay cached across view loads, even when refcount = 0
  refreshTasks$ = new BehaviorSubject<void>(null);
  tasks$ = this.refreshTasks$.pipe(
    switchMap(x => this.getTasks()),
    shareReplay(1));

  private getTasks() {
    return this._http.get<Wrapper<Task[]>>(this.tasksUrl, this.httpOptions).pipe(
      map(resp => resp.data.map(x => new Task(x))));
  }

  // This is more a RPC than REST way of doing things (I'm not using the returned todo task), didn't have time to think of a good rest solution.
  // However, if the data is being changed by multiple users or multiple locations, this is a good time to refresh the data.
  createTask(taskRequestPost: TaskPostRequest) {
    return this._http.post<Wrapper<Task>>(this.tasksUrl, taskRequestPost, this.httpOptions).pipe(
      map(resp => new Task(resp)),
      tap(x => this.refreshTasks$.next()));
  }

  deleteTask(id: number) {
    // must remove 'Content-Type': 'application/json',
    let deleteOptions = {
      headers: { 'Application-ID': environment.applicationId },
      params: { id: String(id) }
    };

    return this._http.delete<Wrapper<Task>>(this.tasksUrl, deleteOptions).pipe(
      map(resp => new Task(resp)),
      tap(x => this.refreshTasks$.next()));
  }
}

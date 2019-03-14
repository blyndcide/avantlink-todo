import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Wrapper, Task } from './dtos';
import { BehaviorSubject, of } from 'rxjs';
import { map, exhaustMap, catchError, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private _http: HttpClient) {
  }

  private tasksUrl = 'http://homework.avantlink.com/tasks';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Application-ID': environment.applicationId
    })
  };

  refreshTasks$ = new BehaviorSubject<void>(null);
  tasks$ = this.refreshTasks$.pipe(
    exhaustMap(x => this.getTasks().pipe(catchError(() => of<Task[]>([])))),
    shareReplay(1));

  private getTasks() {
    return this._http.get<Wrapper<Task[]>>(this.tasksUrl, this.httpOptions).pipe(
      map(resp => resp.data.map(x => new Task(x))));
  }

  createTask(task: Task) {
    return this._http.post<Wrapper<Task[]>>(this.tasksUrl, task, this.httpOptions).pipe(
      map(resp => resp.data.map(x => new Task(x))));
  }
}

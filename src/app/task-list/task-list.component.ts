import { Component, OnInit } from '@angular/core';
import { TaskService } from '../core/task.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  constructor(private _taskService: TaskService) { }

  tasks$ = this._taskService.tasks$;

  ngOnInit() {
  }

}

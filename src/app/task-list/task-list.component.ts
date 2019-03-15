import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../core/task.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TaskPostRequest, Task, Error, ErrorWrapper } from '../core/dtos';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {

  constructor(private _taskService: TaskService, private _fb: FormBuilder, private _matSnackBar: MatSnackBar) { }

  tasks$ = this._taskService.tasks$;

  // handle displaying get tasks errors
  tasks$Sub = this.tasks$
    .subscribe(x => {
      // do nothing on success
    }, (errorResp: HttpErrorResponse) => {
        // more error handling required in case an ErrorWrapper isn't returned
        this._matSnackBar.open((<ErrorWrapper>errorResp.error).errors.map(x => x.message).join(' '), 'Done');
    });

  controls = {
    name: this._fb.control('', Validators.required)
  };

  tasksForm = this._fb.group(this.controls);

  ngOnInit() {
  }

  ngOnDestroy() {
    this.tasks$Sub.unsubscribe();
  }

  onSubmit() {
    let taskPost: TaskPostRequest = this.tasksForm.value;

    this._taskService.createTask(taskPost)
      .subscribe(x => {
        this.controls.name.setValue('');
        this._matSnackBar.open('Task Added', 'Done', { duration: 1500 });
      }, (errorResp: HttpErrorResponse) => {
        this._matSnackBar.open((<ErrorWrapper>errorResp.error).errors.map(x => x.message).join(' '), 'Done');
      });
  }

  onDelete(id: number) {
    this._taskService.deleteTask(id)
      .subscribe(x => {
        this.controls.name.setValue('');
        this._matSnackBar.open('Task Deleted', 'Done', { duration: 1500 });
      }, (errorResp: HttpErrorResponse) => {
        this._matSnackBar.open((<ErrorWrapper>errorResp.error).errors.map((x: Error) => x.message).join(' '), 'Done');
      });
  }

  //didn't have time for edit task functionality, MVP right? :)

  trackByTaskId(index: number, task: Task): number { return task.task_id; }
}

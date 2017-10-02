
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { PeriodService } from "../../../services/period.service";

@Component({
    templateUrl: 'delete-course.html',
    styleUrls: ['../period.component.css']
  })
  export class DeleteCourseDialog {
    result;
    trainingId;
    constructor(@Inject(MD_DIALOG_DATA) public data: any, private periodService: PeriodService) {
        this.trainingId = data.trainingId;
    }

    deleteCourse(courseId){
      this.periodService.deleteCourse(this.trainingId, courseId).subscribe(((res) => {
        this.result = res;
        if(this.result == true){
          console.log(this.result);
          window.location.reload();
        //this.notificationService.setNotificationInfo('Period success to created');
        }else{
        //this.notificationService.setNotificationError('Period failed to created !');
        console.log(this.result);
        }
        })); 
    }
  }
import { Component, ElementRef, Inject, ViewChild, OnInit, OnChanges } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { PeriodService } from "../../../services/period.service";
import { DeleteCourseDialog } from "./delete-course";
import { AddCourseDialog } from "./add-course";
import { DetailDialog } from "./detail-course";
import { AddEnrollDialog } from "./enroll-participants";
import { EditScheduleDialog } from "./edit-schedule-dialog";


declare var $:any;

@Component({
  templateUrl: 'schedule-list.component.html',
  styleUrls: ['../period.component.css']
})
export class ScheduleListComponent implements OnInit{

  // constructor(public periodSerice: PeriodService, private router: Router) {
  //   this.curentData = periodSerice.getPeriodById()
  //  }
  trainingId: number;
  periodical: boolean;
  private sub: any;

  constructor(public addCourse: MdDialog, public deleteCourse: MdDialog, public detailCourse: MdDialog, public enrollParicipants: MdDialog, public editSchedule: MdDialog, private route: ActivatedRoute, private periodService: PeriodService, private router: Router) {

  }
  ngOnInit() {
    // edit period
    this.sub = this.route.params.subscribe(params => {
       this.trainingId = +params['trainingId']; // (+) converts string 'id' to a number
       this.periodical = params['periodical'] == 'true';
       this.periodService.getCourseList(this.trainingId).subscribe((listCourseSchedule => {
        $('#schedule-list-table').DataTable( {
          
          data: listCourseSchedule,
          columns: [
              { title: "Name", data : "courseName" },
              { title: "Trainer", data : "mainTrainer" },
              { title: "Backup Trainer", data : "backupTrainer" },
              { title: "Class Room", data : "classroom" },
              { title: "Day", data : "day" },
              { title: "Start Time", data : "startTime" },
              { title: "End Time", data : "endTime" },
              { title: "Capacity", data : "capacity" },
              { title: "Participants<br>List", data : "apList" },
              {
                title: "Action",
                render: function (data, type, full, meta) {
                return `<button class="action-button" id="detail-button" data-element-id="${full.coursePeriodId}" style="background-color: transparent; border: white;">
                          <img class="image-button" src="../../assets/image/information.svg" style="width: 12px;height: 15px;">
                        </button>
                        <button class="action-button" id="participants-button" data-element-id="${full.coursePeriodId}" style="background-color: transparent; border: white;">
                          <img class="image-button" src="../../assets/image/participants.svg" style="width: 15px;height: 15px;">
                        </button><br>
                        <button class="action-button" id="edit-button" data-element-id="${full.coursePeriodId}" data-element-name="${full.courseName}" style="background-color: transparent; border: white;">
                          <img class="image-button" src="../../assets/image/edit.svg" style="width: 15px;height: 15px;">
                        </button>
                        <button class="action-button" id="delete-button" data-element-id="${full.coursePeriodId}" style="background-color: transparent; border: white;">
                          <img class="image-button" src="../../assets/image/garbage.svg" style="width: 15px;height: 15px;">
                        </button>`
                }
              }
          ],
          columnDefs: [
            {
                render: function (data, type, full, meta) {
                    return "<div style='white-space:normal; width:70px'>" + data + "</div>";
                },
                targets: [1, 2, 5, 6]
            },
            {
              render: function (data, type, full, meta) {
                  return "<div style='white-space:normal; width:115px; text-align:left;'>" + data + "</div>";
              },
              targets: [0, 3]
            }
         ]
      }); //console.log(elligibleparticipants);
      var that = this;

      $('#schedule-list-table').on('click', '#participants-button', function() {
        let coursePeriodId = $(this).data('element-id');
        that.openDialogEnroll(coursePeriodId)
        //that.router.navigate(['/home/period/edit', trainingId,'eligible']);
      } );

      $('#schedule-list-table').on('click', '#edit-button', function() {
        let coursePeriodId = $(this).data('element-id');
        let courseName = $(this).data('element-name');
        that.openDialogEdit(coursePeriodId, courseName)
        //that.router.navigate(['/home/period/edit', trainingId,'eligible']);
      } );

      $('#schedule-list-table').on('click', '#detail-button', function() {
        let coursePeriodId = $(this).data('element-id');
        that.openDialogDetail(coursePeriodId);
      } );
  
      // Delete a record
      $('#schedule-list-table').on('click', '#delete-button', function () {
        let coursePeriodId = $(this).data('element-id'); 
        that.openDialogDelete(coursePeriodId);
      } );
      }));
   // here the code
    });
  }
  openDialogDelete(courseId) {
    this.deleteCourse.open(DeleteCourseDialog, {
      data: { trainingId: this.trainingId, courseId: courseId }
    });
  }

  openDialogAdd() {
    this.deleteCourse.open(AddCourseDialog, {
      width: '50%',
      data: { id: this.trainingId}
    });
  }

  openDialogDetail(idCourse) {
    this.detailCourse.open(DetailDialog, {
      width: '40%',
      data: { idTraining: this.trainingId, idCourse: idCourse }
    });
  }

  openDialogEnroll(idCourse) {
    this.enrollParicipants.open(AddEnrollDialog, {
      width: '60%',
      data: { idTraining: this.trainingId, idCourse: idCourse }
    });
  }

  openDialogEdit(idCourse, courseName) {
    this.editSchedule.open(EditScheduleDialog, {
      width: '45%',
      data: { idTraining: this.trainingId, idCourse: idCourse, periodical: this.periodical, courseName: courseName}, 
    });
  }
  
}
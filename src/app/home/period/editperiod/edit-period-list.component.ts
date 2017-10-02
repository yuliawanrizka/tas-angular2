import { Component, ElementRef, Inject, ViewChild, OnInit, OnChanges } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { PeriodService } from "../../../services/period.service";
import { Periods } from "../period";
import { AddPeriods } from "../add-period";

declare var $:any;

@Component({
  templateUrl: 'edit-period-list.component.html',
  styleUrls: ['../period.component.css']
})
export class EditPeriodListComponent implements OnInit{
  finalData;
  currentData: any={};
  result;
  addPeriodFormControl = new FormControl('', [
    Validators.required
  ]);
  // constructor(public periodSerice: PeriodService, private router: Router) {
  //   this.curentData = periodSerice.getPeriodById()
  //  }
  trainingId: number;
  private sub: any;

  constructor(private route: ActivatedRoute, private periodService: PeriodService, private router: Router) {

  }
  ngOnInit() {
    // edit period
    this.sub = this.route.params.subscribe(params => {
       this.trainingId = +params['trainingId']; // (+) converts string 'id' to a number
      this.periodService.getPeriodById(this.trainingId).subscribe(((res) => {
        this.currentData.trainingName= res.trainingName;
        const start: string[] = res.startDate.split('-');
        this.currentData.startDate= new Date(+start[0], +start[1]-1, +start[2]);
        const end: string[] = res.endDate.split('-');
        this.currentData.endDate= new Date(+end[0], +end[1]-1, +end[2]);
        this.currentData.openEnrollment= res.openEnrollment;
        this.currentData.activeStatus= res.activeStatus;
        this.currentData.periodical = res.periodical;
        })); 
    });
    //elligible participants
    
  }

  savePeriod(id) {
    this.finalData = new AddPeriods(this.currentData.trainingName,
      this.currentData.startDate, this.currentData.endDate, 
      this.currentData.openEnrollment,  this.currentData.activeStatus, this.currentData.periodic );
    console.log(this.finalData);
      this.periodService.editDataPeriod(id,this.finalData).subscribe(((res) => {
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
        this.router.navigate(['/home/period/']);
  }
}
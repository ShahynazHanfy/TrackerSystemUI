import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { assignedRequests } from 'src/Shared/Models/assignedRequest';
import { projectPosition } from 'src/Shared/Models/projectPosition';
import { projectTeam } from 'src/Shared/Models/projectTeam';
import { requestDescription } from 'src/Shared/Models/requestDescription';
import { AssignedRequestsService } from 'src/Shared/Services/assigned-requests.service';
import { ProjectPositionService } from 'src/Shared/Services/project-position.service';
import { ProjectTeamService } from 'src/Shared/Services/project-team.service';
import { RequestDescriptionService } from "../../../../Shared/Services/request-description.service";

@Component({
  selector: 'app-assign-requests',
  templateUrl: './assign-requests.component.html',
  styleUrls: ['./assign-requests.component.css']
})
export class AssignRequestsComponent implements OnInit {

  assignedReqObj: assignedRequests
  lstProjectPosition: projectPosition[]
  lstProjectTeamAfterFilter: projectTeam[]
  lstProjectTeam: projectTeam[]
  lstProjectTeamAfterFiltration: projectTeam[]
  reqDescriptionObj: requestDescription
  projectTeamForEmployees: projectTeam[]
  reqId: number
  LoginedUserId: string;
  Id: any
  teamId: any;
  empId: number

  constructor(
    private activeRoute: ActivatedRoute, private route: Router,
    private assignedRequestsService: AssignedRequestsService,
    private projectPositionService: ProjectPositionService,
    private projectTeamService: ProjectTeamService,
    private requestDescriptionService: RequestDescriptionService
  ) { }

  ngOnInit(): void {
    // this.projectTeamObj = {
    //   departmentId: 0, departmentName: '', employeeId: 0, id: 0, projectId: 0, projectName: '', projectPositionId: 0,
    //   TeamId: 0, teamName: '', employeeName: '', projectPositionName: ''
    // }
    this.reqId = Number(this.activeRoute.snapshot.params['reqId']);
    this.LoginedUserId = localStorage.getItem("loginedUserId")
    this.lstProjectPosition = []
    this.reqDescriptionObj = {
      description: '', id: 0, requestId: this.reqId, userId: this.LoginedUserId
    }
    this.assignedReqObj = {
      employeeId: 0,
      requestId: this.reqId, id: 0, projectPositionId: 0, teamId: 0
    }
    this.projectPositionService.GetAllProjectPosition().subscribe(e => {
      this.lstProjectPosition = e
    })

  }
  getTeamsByPositionId(event) {
    this.projectTeamService.GetProjectTeamsByProjectPositionId(this.assignedReqObj.projectPositionId).subscribe(e => {
      this.lstProjectTeam = e
      // this.lstProjectTeamAfterFiltration=e
      // console.log("lst of projteams",this.lstProjectTeam)
      // this.lstProjectTeamAfterFiltration = e.reduce((unique, o) => {
      //   if (!unique.some(obj => obj.TeamId == o.TeamId)) {
      //     unique.push(o);
      //   }
      //   return unique;
      // }, []);
    })

    // this.projectTeamService.GetEmployeessByTeamIdAndPositionId(this.teamId, this.assignedReqObj.projectPositionId).subscribe(e => {
    //   this.projectTeamForEmployees = e
    //   console.log(this.projectTeamForEmployees)
    // })
  }
  saveAssignedRequest() {
    this.assignedReqObj.employeeId = Number( this.empId)

    this.assignedReqObj.projectPositionId = Number(this.assignedReqObj.projectPositionId)
    this.assignedReqObj.teamId = Number(this.teamId)
    this.assignedReqObj.requestId = Number(this.assignedReqObj.requestId)
    this.assignedRequestsService.AssignedRequest(this.assignedReqObj).subscribe(e => {
      console.log("ass", this.assignedReqObj)
      this.requestDescriptionService.AddRequestDescription(this.reqDescriptionObj).subscribe(e => {
        console.log("desc")
      })
    })
  }
  getEmp(event) {
    this.teamId = event;
    console.log(this.teamId)
    this.projectTeamService.GetEmployeessByTeamIdAndPositionId(this.teamId, this.assignedReqObj.projectPositionId).subscribe(e => {
      this.projectTeamForEmployees = e
      console.log(this.projectTeamForEmployees)
    })
  }
  getEmpId(event) {
    console.log(event)
    this.empId = event
  }
}

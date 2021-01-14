import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Problem } from 'src/Shared/Models/problem';
import { projectTeam } from 'src/Shared/Models/projectTeam';
import { projectTeamVM } from 'src/Shared/Models/projectTeamVM';
import { request } from 'src/Shared/Models/request';
import { requestDescription } from 'src/Shared/Models/requestDescription';
import { RequestImage } from 'src/Shared/Models/RequestImages';
import { ProblemServiceService } from 'src/Shared/Services/problem-service.service';
import { ProjectTeamService } from 'src/Shared/Services/project-team.service';
import { RequestDescriptionService } from 'src/Shared/Services/request-description.service';
import { RequestService } from 'src/Shared/Services/request.service';

@Component({
  selector: 'app-all-team-leader-requests',
  templateUrl: './all-team-leader-requests.component.html',
  styleUrls: ['./all-team-leader-requests.component.css']
})
export class AllTeamLeaderRequestsComponent implements OnInit {
  role:string
  LoggedInUserId:number
  lstProjectTeams:projectTeam[]
  projectTeamId:number
  lst:string
  lstofIds:projectTeamVM  
  lstRequests:any[]
  reqImages:RequestImage[]
  lstRequestDesc:requestDescription[]
  NewclientDialogbool: boolean;
  NewdecDialogbool: boolean;
  lstRequestProblems:Problem[]


  constructor(private projectTeamSrvice:ProjectTeamService,private requestsService:RequestService,
    private requestProblemService:ProblemServiceService,
    private requestDescservive:RequestDescriptionService,
    private router: Router) { }

  ngOnInit(): void {
    this.reqImages=[]
    this.lstRequestDesc=[]
    this.lstRequestProblems=[]
    this.requestProblemService.GetAllProblems().subscribe(
      res=>{this.lstRequestProblems=res,
        console.log("lstRequestProblems",res)
    }

    )
    this.lstofIds={ProjectTeamIds:''}
    this.lstProjectTeams=[]
  this.role= localStorage.getItem('roles')
  this.LoggedInUserId = Number(localStorage.getItem('id'))
  console.log("loggedin",localStorage.getItem('id'))
  this.projectTeamSrvice.GetProjectTeamByProjectPositionIdAndEmployeeId(1,this.LoggedInUserId).subscribe(e=>{
    this.lstProjectTeams = e
    this.lstProjectTeams.forEach(element => {
      console.log(element.id.toString())
      this.lstofIds.ProjectTeamIds+=(element.id).toString()+','
    });
    this.lstofIds.ProjectTeamIds=this.lstofIds.ProjectTeamIds.substring(0, this.lstofIds.ProjectTeamIds.length - 1)
    console.log("lst=",this.lstofIds.ProjectTeamIds)

    this.requestsService.GetAllRequestByProjectTeamId(this.lstofIds).subscribe(e=>{
      console.log(e)
      this.lstRequests=e

    })
  })
  }
  assignRequests(id:number){
    console.log(id)
    this.router.navigate(['home/assignReq', id]);
  }
  ViewImages(reqId:number){
    console.log(reqId)
    this.requestsService.GetRequestImageByRequestId(reqId).subscribe(e=>{
      this.reqImages = e
      console.log(this.reqImages)
      this.NewclientDialogbool = true
    })
  }
  viewSingleDoc(imgObj){
    console.log(imgObj)
    var filePath = `${environment.Domain}wwwroot/requestImage/${imgObj.imageName}`;
    window.open(filePath);
  }
  GetAllTLRequests(){
    this.ngOnInit()
  }
  GetproblemId(problemId){
    console.log("problemId",problemId)
    this.requestProblemService.GetAllRequestByRequestProblemId(problemId).subscribe(e=>{
      this.lstRequests=e
      console.log(e)
    })
  }
  ViewMoreDesc(requestID){
this.requestDescservive.GetAllDescByRequestID(requestID).subscribe(res=>{
  console.log("desc",res)
  this.lstRequestDesc=res;
  this.NewdecDialogbool=true;
})
  }
}

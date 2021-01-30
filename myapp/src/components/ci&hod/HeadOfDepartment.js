import React from "react";
import axios from 'axios';
import Profile from './Profile'
import Schedule from './Schedule'
import ViewLeaveRequest from  './ViewLeaveRequests'
import ViewDayOffReq from  './ViewDayOffReq'
import ViewDayOff from  './ViewDayOff'
import CoursCoverag1 from './CoursCoverag1'
import SlotAssignment1 from './SlotAssignment1'
import StaffDept1 from './StaffInDept1'
import StaffInCourse from './StaffInCourse'
import AssignCi from './AssignCi'
import UpdateCi from './UpdateCi'
import DeletCi from './DeletCi'
import {Navbar,Button,Nav,ButtonGroup,Dropdown,DropdownButton,Container,Row,Col} from 'react-bootstrap';
//==========================================================
import UpdateProfile from "./UpdateProfile";
import ResetPassword from "./ResetPassword";
import ViewAttendance from "./ViewAttendance";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import ViewMissingDays from "./ViewMissingDays";
import ViewHours from "./ViewHours";
class HeadOfDepartment extends React.Component
{
    constructor()
    {
        super()

        this.state=
        {
         current:"main",
         navigation:"Main HOD"
        }
         this.Handlecoverage = this.Handlecoverage.bind(this)
         this.HandleTAC = this.HandleTAC.bind(this)
         this.HandleDF = this.HandleDF.bind(this)
         this.HandleSIC = this.HandleSIC.bind(this)
         this.HandleSID = this.HandleSID.bind(this)
         this.HandleACI = this.HandleACI.bind(this)
         this.HandleUCI = this.HandleUCI.bind(this)
         this.HandleDCI = this.HandleDCI.bind(this)
         this.HandleDFR = this.HandleDFR.bind(this)
         this.HandleLR = this.HandleLR.bind(this)
         this.HandleHome = this.HandleHome.bind(this)
         //==============================================================
        this.HandleUpdateProfile = this.HandleUpdateProfile.bind(this)
        this.HandleResetPassword = this.HandleResetPassword.bind(this)
        this.HandleViewAttendance = this.HandleViewAttendance.bind(this)
        this.HandleSignIn = this.HandleSignIn.bind(this)
        this.HandleSignOut = this.HandleSignOut.bind(this)
        this.HandleViewMissingDays = this.HandleViewMissingDays.bind(this)
        this.HandleViewHours = this.HandleViewHours.bind(this)
    }
    store()
    {
        localStorage.setItem('hod',JSON.stringify(this.state));
    }
    componentDidMount()
  {
    try {
        this.documentData = JSON.parse(localStorage.getItem('hod'));
        //localStorage.clear()
        if (localStorage.getItem('document')) {
            this.setState({
              current: this.documentData.current,
              navigation: this.documentData.navigation,
              
        })
         }
         else {
          this.setState({
            current:"main",
            navigation:"Main HOD"
          })
      }
      } catch (error) {
        this.setState({
            current:"main",
         navigation:"Main HOD"
            
      })
      }
  }

    Handlecoverage(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"view coverage",
                navigation:"Main HOD/view course coverage"
            }
            ,()=>this.store())
    }

    HandleTAC(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"TAC", 
                navigation:"Main HOD/Teaching assignment of a course"
            }
            ,()=>this.store() )
    }
    HandleDF(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"DF", //view coverage TAC DF
                navigation:"Main HOD/view day off of staff"
            }
            ,()=>this.store())
    }
    HandleSIC(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"SIC",
                navigation:"Main HOD/view Staff in course"
            }
            ,()=>this.store())
    }
    HandleSID(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"SID",
                navigation:"Main HOD/view staff in department"
            }
            ,()=>this.store())
    }
    HandleACI(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"ACI",
                navigation:"Main HOD/Assign course instructor"
            }
            ,()=>this.store())
    }
    HandleUCI(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"UCI",//view coverage TAC DF  SIC  SID  ACI  UCI
                navigation:"Main HOD/Replace course instructor"
            }
            ,()=>this.store() )
    }
    HandleDCI(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"DCI",//view coverage TAC DF  SIC  SID  ACI  UCI  DCI
                navigation:"Main HOD/remove course instructor"
            }
            ,()=>this.store())
    }
    HandleDFR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"DFR",
                navigation:"Main HOD/view day off requests"
            }
            ,()=>this.store())
    }
    HandleLR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"LR",
                navigation:"Main HOD/view leave requests"
            }
            ,()=>this.store())
    }

    HandleHome(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"main",
                navigation:"Main HOD"
            }
            ,()=>this.store() )
    }

//==============================================================================    
    HandleUpdateProfile(event){
        event.preventDefault()
        this.setState({
            current:"update Profile",
            navigation:"Main HOD/Update Profile"
        },()=>this.store())
    }
    HandleResetPassword(event){
        event.preventDefault()
        this.setState({
            current:"Reset Password",
            navigation:"Main HOD/Reset Password"
        },()=>this.store())
    }
    HandleViewAttendance(event){
        event.preventDefault()
        this.setState({
            current:"View Attendance",
            navigation:"Main HOD/View Attendance"
        },()=>this.store())
    }
    HandleSignIn(event){
        event.preventDefault()
        this.setState({
            current:"Sign In",
            navigation:"Main HOD/Sign In"
        },()=>this.store())
    }
    HandleSignOut(event){
        event.preventDefault()
        this.setState({
            current:"Sign Out",
            navigation:"Main HOD/Sign Out"
        },()=>this.store())
    }
    HandleViewMissingDays(event){
        event.preventDefault()
        this.setState({
            current:"View Missing Days",
            navigation:"Main HOD/View Missing Days"
        },()=>this.store())
    }
    HandleViewHours(event){
        event.preventDefault()
        this.setState({
            current:"View Hours",
            navigation:"Main HOD/View Missing and Extra Hours"
        },()=>this.store())
    }
    HandleLogOut(token){
                   
        axios.post('http://localhost:4000/authentication/logout',{headers:{
            'token':token
        }})

        .then(res=>
            {
                
                
                localStorage.clear();
                window.location.reload();
               // this.HandleLogOut()
            })
            .catch(err=>
                {
                    console.log(err)
                })
    }

    render()
    {
        let x,y;

        switch (this.state.current) {//view coverage TAC DF  SIC  SID  ACI  UCI  DCI  DFR LR  main
            case "main":{x=(<Schedule token={this.props.token} userid={this.props.userId}/>);y=(<Profile token={this.props.token} userid={this.props.userId}/>);break;}
                
                

                case "view coverage":{x=(<CoursCoverag1 token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
                
                
                case "TAC":{x=(<SlotAssignment1 token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
                
                
                case "DF":{x=(<ViewDayOff token={this.props.token} userid={this.props.userId}/>);y=(null);break; }
                
                
                case "SIC":{x=(<StaffInCourse token={this.props.token} userid={this.props.userId}/>);y=(null);break; }
                
                
                case "SID":{x=(<StaffDept1 token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
                
                 
                case "ACI":{x=(<AssignCi token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
                
                 
                case "UCI":{x=(<UpdateCi token={this.props.token} userid={this.props.userId}/>);y=(null);break; }
                
                
                case "DCI":{x=(<DeletCi token={this.props.token} userid={this.props.userId}/>);y=(null);break; }
                
                
                case "DFR":{x=(<ViewDayOffReq token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
                
                 
                case "LR":{x=(<ViewLeaveRequest token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
                
                case "update Profile":
                    x=(<UpdateProfile token={this.props.token}/>)
                    break;
                case "Reset Password":
                    x=(<ResetPassword token={this.props.token}/>)
                    break;
                case "View Attendance":
                    x=(<ViewAttendance token={this.props.token}/>)
                    break;
                case "Sign In":
                    x=(<SignIn token={this.props.token}/>)
                    break;
                case "Sign Out":
                    x=(<SignOut token={this.props.token}/>)
                    break;
                case "View Missing Days":
                    x=(<ViewMissingDays token={this.props.token}/>)
                    break;
                case "View Hours":
                    x=(<ViewHours token={this.props.token}/>)
                    break;
        
            default:
                break;
        }

        return(
            <div >
        
        
        <div >
                <Navbar bg="dark" variant="dark" >
                    <Navbar.Brand >{this.state.navigation}</Navbar.Brand>
                    <Nav className="mr-auto">
                    
                    </Nav>
                    <Button variant="outline-info" onClick={()=>{console.log()
                    this.HandleLogOut(this.props.token)
         }}>Log Out</Button>
                    <Button variant="outline-info" onClick={this.HandleHome}>home</Button>
                </Navbar>
        </div>
        <Container>
                    <Row>
                        <Col>                       
                        <ButtonGroup vertical>
                        <Button onClick={this.Handlecoverage} >View the coverage of course</Button>
                        <Button onClick={this.HandleTAC}>View the traching assignments of course</Button>
                        <Button onClick={this.HandleDF}>View the day off of staff</Button>

                        <DropdownButton as={ButtonGroup} title="View all the staf" id="bg-vertical-dropdown-1">
                            <Dropdown.Item eventKey="1" onClick={this.HandleSIC} >in course</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={this.HandleSID} >in department</Dropdown.Item>
                        </DropdownButton>

                        <DropdownButton as={ButtonGroup} title="Course Instructor" id="bg-vertical-dropdown-1">
                            <Dropdown.Item eventKey="1" onClick={this.HandleACI} >Assign course instructor</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={this.HandleUCI}>Update course instructor</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={this.HandleDCI}> remove course instructor</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton as={ButtonGroup} title="requests" id="bg-vertical-dropdown-1">
                            <Dropdown.Item eventKey="1" onClick={this.HandleDFR}>change day off requests</Dropdown.Item>
                            <Dropdown.Item eventKey="1" onClick={this.HandleLR} >leave requests</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton as={ButtonGroup} title="Staff Members Functions" id="bg-vertical-dropdown-1">
                            <Dropdown.Item eventKey = "1" onClick={this.HandleUpdateProfile}>Update Profile</Dropdown.Item>
                            <Dropdown.Item eventKey = "2" onClick={this.HandleResetPassword}>Reset Password</Dropdown.Item>
                            <Dropdown.Item eventKey = "3" onClick={this.HandleViewAttendance}>View Attendendance</Dropdown.Item>
                            <Dropdown.Item eventKey = "4" onClick={this.HandleSignIn}>Sign In</Dropdown.Item>
                            <Dropdown.Item eventKey = "5" onClick={this.HandleSignOut}>Sign Out</Dropdown.Item>
                            <Dropdown.Item eventKey = "6" onClick={this.HandleViewMissingDays}>View Missing Days</Dropdown.Item>
                            <Dropdown.Item eventKey = "6" onClick={this.HandleViewHours}>View Missing And Extra Hours</Dropdown.Item>
                        </DropdownButton>
                        
                        </ButtonGroup>        </Col>
                        <Col>
                        {x}
                         </Col>
                    </Row>
                    <Row>
                            <Col>
                                
                            </Col>
                        <Col>
                        {y}
                         
                         
                        </Col>
                        
                        
                    </Row>
        </Container>
    </div>
        )
    }
}

export default HeadOfDepartment


// Remove all keys
//localStorage.clear()
import React from "react";
import axios from 'axios';
import Profile from './Profile'
import Schedule from './Schedule'
import VorCreq from './VorCreqs'
import ChangeDayOff from './ChangeDayOff'
import SendRepReq from './SendRepReq'
import Respond from './Respond'
import AnnualLeave from './AnnualLeave'
import MatLeave from './MatLeave'
import SickLeave from './SickLeave'
import AccLeave from './AccLeave'
import CompLeave from './CompLeave'
import SLLR from './SLLR'
import Notification from './Notification'
/////////////////////////////////////////
import UpdateProfile from "../ci&hod/UpdateProfile";
import ResetPassword from "../ci&hod/ResetPassword";
import ViewAttendance from "../ci&hod/ViewAttendance";
import SignIn from "../ci&hod/SignIn";
import SignOut from "../ci&hod/SignOut";
import ViewMissingDays from "../ci&hod/ViewMissingDays";
import ViewHours from "../ci&hod/ViewHours";
import {Navbar,Button,Nav,ButtonGroup,Dropdown,DropdownButton,Container,Row,Col} from 'react-bootstrap';

export default class AcademicMem extends React.Component
{
    constructor()
    {
        super();
        this.state=
        ({
            current:"main",
            navigation:"Main TA"
        })
        this.HandleHome = this.HandleHome.bind(this)
        this.HandleVORC = this.HandleVORC.bind(this)
        this.HandleCDO = this.HandleCDO.bind(this)
        this.HandleSRR = this.HandleSRR.bind(this)
        this.HandleRES = this.HandleRES.bind(this)
        this.HandleALR = this.HandleALR.bind(this)
        this.HandleMLR = this.HandleMLR.bind(this)
        this.HandleSLR = this.HandleSLR.bind(this)
        this.HandleAcLR = this.HandleAcLR.bind(this)
        this.HandleCLR = this.HandleCLR.bind(this)
        this.HandleSLLR = this.HandleSLLR.bind(this)
        this.HandleNOT = this.HandleNOT.bind(this)
        /////////////////////////////////////
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
        localStorage.setItem('am',JSON.stringify(this.state));
    }
    componentDidMount()
  {
    try {
        this.documentData = JSON.parse(localStorage.getItem('am'));
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
            navigation:"Main TA"
          })
      }
      } catch (error) {
        this.setState({
            current:"main",
         navigation:"Main TA"
            
      })
      }
  }
  HandleHome(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"main",
                navigation:"Main TA"
            }
            ,()=>this.store() )
    }
    HandleNOT(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"NOT",
                navigation:"Main TA/notification"
            }
            ,()=>this.store() )
    }
    HandleVORC(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"VORC",
                navigation:"Main TA/View or Cancel Requests"
            }
            ,()=>this.store() )
    }

    HandleCDO(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"CDO",
                navigation:"Main TA/Change Day Off Request"
            }
            ,()=>this.store() )
    }
    HandleSRR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"SRR",
                navigation:"Main TA/Send Replacment Request"
            }
            ,()=>this.store() )
    }

    HandleRES(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"RES",
                navigation:"Main TA/respond to replacement request"
            }
            ,()=>this.store() )
    }

    HandleALR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"ALR",
                navigation:"Main TA/Annual Leave Request"
            }
            ,()=>this.store() )
    }

    HandleMLR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"MLR",
                navigation:"Main TA/Matrernity Leave Request"
            }
            ,()=>this.store() )
    }
    HandleSLR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"SLR",
                navigation:"Main TA/Sick Leave Request"
            }
            ,()=>this.store() )
    }

    HandleAcLR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"AcLR",
                navigation:"Main TA/Acceidential Leave Request"
            }
            ,()=>this.store() )
    }
    HandleCLR(event)
    {
       // console.log("lol")
        event.preventDefault()
        this.setState(
            {
                current:"CLR",
                navigation:"Main TA/compensation Leave Request"
            }
            ,()=>this.store() )
    }

    HandleSLLR(event)
    {
       // console.log("lol")
        event.preventDefault()
        this.setState(
            {
                current:"SLLR",
                navigation:"Main TA/slot linking request Request"
            }
            ,()=>this.store() )
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
    HandleUpdateProfile(event){
        event.preventDefault()
        this.setState({
            current:"update Profile",
            navigation:"Main TA/Update Profile"
        },()=>this.store())
    }
    HandleResetPassword(event){
        event.preventDefault()
        this.setState({
            current:"Reset Password",
            navigation:"Main TA/Reset Password"
        },()=>this.store())
    }
    HandleViewAttendance(event){
        event.preventDefault()
        this.setState({
            current:"View Attendance",
            navigation:"Main TA/View Attendance"
        },()=>this.store())
    }
    HandleSignIn(event){
        event.preventDefault()
        this.setState({
            current:"Sign In",
            navigation:"Main TA/Sign In"
        },()=>this.store())
    }
    HandleSignOut(event){
        event.preventDefault()
        this.setState({
            current:"Sign Out",
            navigation:"Main TA/Sign Out"
        },()=>this.store())
    }
    HandleViewMissingDays(event){
        event.preventDefault()
        this.setState({
            current:"View Missing Days",
            navigation:"Main TA/View Missing Days"
        },()=>this.store())
    }
    HandleViewHours(event){
        event.preventDefault()
        this.setState({
            current:"View Hours",
            navigation:"Main TA/View Missing and Extra Hours"
        },()=>this.store())
    }
    
    render()
    {
        let x,y;
        switch (this,this.state.current) {
            case "main":{x=(<Schedule token={this.props.token} userid={this.props.userId}/>);y=(<Profile token={this.props.token} userid={this.props.userId}/>);break;}
            
            case "VORC":{x=(<VorCreq token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
            
            case "CDO":{x=(<ChangeDayOff token={this.props.token} userid={this.props.userId}/>);y=(null);break;}

            case "SRR":{
               x=(<SendRepReq token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
            
            case "RES":{
                    x=(<Respond token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
                
            case "ALR":{
                    x=(<AnnualLeave token={this.props.token} userid={this.props.userId}/>);y=(null);break;}   
            case "MLR":{
                     x=(<MatLeave token={this.props.token} userid={this.props.userId}/>);y=(null);break;}   
            case "SLR":{
                     x=(<SickLeave token={this.props.token} userid={this.props.userId}/>);y=(null);break;} 
            case "AcLR":{
                     x=(<AccLeave token={this.props.token} userid={this.props.userId}/>);y=(null);break;}   
            case "CLR":{
                     x=(<CompLeave token={this.props.token} userid={this.props.userId}/>);y=(null);break;} 
            case "SLLR":{
                     x=(<SLLR token={this.props.token} userid={this.props.userId}/>);y=(null);break;}   
            case "NOT":{
                     x=(<Notification token={this.props.token} userid={this.props.userId}/>);y=(null);break;}  
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
                    <Nav.Link href="#features" onClick={this.HandleNOT}>Notifications</Nav.Link>
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
                        <Button onClick={this.HandleVORC} >View or cancel sent requests</Button>
                        <Button onClick={this.HandleSLLR}>send slot linking request</Button>
                        <Button onClick={this.HandleCDO}>change dayoff request</Button>



                        <DropdownButton as={ButtonGroup} title="Replacment requests" id="bg-vertical-dropdown-1">
                            <Dropdown.Item eventKey="1" onClick={this.HandleSRR} >send</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={this.HandleRES} >responde</Dropdown.Item>
                            
                        </DropdownButton>

                        <DropdownButton as={ButtonGroup} title="Leave requests" id="bg-vertical-dropdown-1">       
                            <Dropdown.Item eventKey = "1" onClick={this.HandleAcLR}>AccidentalLeaveRequest</Dropdown.Item>
                            <Dropdown.Item eventKey = "2" onClick={this.HandleCLR}>CompensationLeaveRequest</Dropdown.Item>
                            <Dropdown.Item eventKey = "3" onClick={this.HandleSLR}>SickLeavesRequest</Dropdown.Item>
                            <Dropdown.Item eventKey = "4" onClick={this.HandleMLR}>MaternityLeaveRequest</Dropdown.Item>
                            <Dropdown.Item eventKey = "5" onClick={this.HandleALR}>annualleaverequest</Dropdown.Item>
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
                        {/* <Profile token={this.props.token} userid={this.props.userId}/> */}
                         
                        {y}
                        </Col>
                        
                        
                    </Row>
        </Container>
    </div>
        )
    }
}
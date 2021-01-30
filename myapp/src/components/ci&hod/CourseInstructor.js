import React from "react";
import axios from 'axios';
import  "./CourseInstructor.css"
import {Navbar,Button,Nav,ButtonGroup,Dropdown,DropdownButton,Container,Row,Col} from 'react-bootstrap';
import Profile from './Profile'
import Schedule from './Schedule'
import CoursCoverag from './CourseCoverage'   
import SlotAssignment from './SlotAssignment'
import StaffCourse from './StaffCourse'
import StaffDept from './StaffDept'
import AssignToSlot from './AssignToSlot'
import DeletFromSlot from './DeletFromSlot'
import UpdateSlot from './UpdateSlot'
import RemoveFromCourse from './RemoveFromCourse'
import CourseCoordinator from './CourseCoordinator'
import Notification from '../Notification'
import AcademicMem from "../AM/AcademicMem1" 
//==========================================================
import UpdateProfile from "./UpdateProfile";
import ResetPassword from "./ResetPassword";
import ViewAttendance from "./ViewAttendance";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import ViewMissingDays from "./ViewMissingDays";
import ViewHours from "./ViewHours";
class CourseInstructor extends React.Component
{
    constructor()
    {
        super()

        this.state=
        {
         current:"main",
         navigation:"Main CI",
         CI:true
        }
        this.HandleCc = this.HandleCc.bind(this)
        this.HandleCourseRem = this.HandleCourseRem.bind(this)
        this.HandleCoverage = this.HandleCoverage.bind(this)
        this.HandleSlotAssi = this.HandleSlotAssi.bind(this)
        this.HandleSlotDel = this.HandleSlotDel.bind(this)
        this.HandleSlotRepl = this.HandleSlotRepl.bind(this)
        this.HandleStaffCourse = this.HandleStaffCourse.bind(this)
        this.HandleStaffdept = this.HandleStaffdept.bind(this)
        this.HandleViewAssi = this.HandleViewAssi.bind(this)
        this.HandleHome = this.HandleHome.bind(this)
        //==============================================================
        this.HandleUpdateProfile = this.HandleUpdateProfile.bind(this)
        this.HandleResetPassword = this.HandleResetPassword.bind(this)
        this.HandleViewAttendance = this.HandleViewAttendance.bind(this)
        this.HandleSignIn = this.HandleSignIn.bind(this)
        this.HandleSignOut = this.HandleSignOut.bind(this)
        this.HandleViewMissingDays = this.HandleViewMissingDays.bind(this)
        this.HandleViewHours = this.HandleViewHours.bind(this)
        this.HandleNOT = this.HandleNOT.bind(this)
        this.HandleCI = this.HandleCI.bind(this)
        this.BACK = this.BACK.bind(this)
    }

    store()
    {
        localStorage.setItem('ci',JSON.stringify(this.state));
    }
    BACK(){
        
        this.setState({
            current:"main",
            navigation:"Main CI",
            CI:true
        },()=>{this.store();console.log(this.state)})
    }

    HandleNOT(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"NOT",
                navigation:"Main CI/Notifications",
                
            }
        ,()=>this.store())
        
        //localStorage.setItem('ci',JSON.stringify(this.state));
    }
    HandleCoverage(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"view coverage",
                navigation:"Main CI/view course coverage"
                
            }
        ,()=>this.store())
        
        //localStorage.setItem('ci',JSON.stringify(this.state));
    }
    HandleViewAssi(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"view assignment",
                navigation:"Main CI/view slot assignment"
            }
            ,()=>this.store())
        
        //localStorage.setItem('ci',JSON.stringify(this.state));
    }
    HandleStaffdept(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"staff in dept",
                navigation:"Main CI/view staff in department"
            }
            ,()=>this.store() )
        
        //localStorage.setItem('ci',JSON.stringify(this.state));
    }
    HandleStaffCourse(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"staff in course",
                navigation:"Main CI/staff in course"
            }
            ,()=>this.store())
        this.store()
        //localStorage.setItem('ci',JSON.stringify(this.state));
    }
    HandleSlotAssi(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"slot assign",
                navigation:"Main CI/assign academic member to slot"
            }
            ,()=>this.store())
        
        //localStorage.setItem('ci',JSON.stringify(this.state));
    }
    HandleSlotRepl(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"slot replace",
                navigation:"Main CI/replace members in slot"
            }
            ,()=>this.store())
        
       // localStorage.setItem('ci',JSON.stringify(this.state));
    }
    HandleSlotDel(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"slot delete",
                navigation:"Main CI/delet slot assignment"
            }
            ,()=>this.store())
        
       // localStorage.setItem('ci',JSON.stringify(this.state));
    }
    HandleCourseRem(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"course remove",
                navigation:"Main CI/remove member from course"
            }
            ,()=>this.store())
        
       // localStorage.setItem('ci',JSON.stringify(this.state));
    }
    HandleCc(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"CC",
                navigation:"Main CI/assign course coordinator"
            }
            ,()=>this.store())
        
        //localStorage.setItem('ci',JSON.stringify(this.state));
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
    HandleHome(event)
    {
        //event.preventDefault()
        this.setState(
            {
                current:"main",
                navigation:"Main CI",
                
            }
            ,()=>this.store())
        
       // localStorage.setItem('ci',JSON.stringify(this.state));
    }
//==============================================================================    
    HandleUpdateProfile(event){
        event.preventDefault()
        this.setState({
            current:"update Profile",
            navigation:"Main CI/Update Profile"
        },()=>this.store())
    }
    HandleResetPassword(event){
        event.preventDefault()
        this.setState({
            current:"Reset Password",
            navigation:"Main CI/Reset Password"
        },()=>this.store())
    }
    HandleViewAttendance(event){
        event.preventDefault()
        this.setState({
            current:"View Attendance",
            navigation:"Main CI/View Attendance"
        },()=>this.store())
    }
    HandleSignIn(event){
        event.preventDefault()
        this.setState({
            current:"Sign In",
            navigation:"Main CI/Sign In"
        },()=>this.store())
    }
    HandleSignOut(event){
        event.preventDefault()
        this.setState({
            current:"Sign Out",
            navigation:"Main CI/Sign Out"
        },()=>this.store())
    }
    HandleViewMissingDays(event){
        event.preventDefault()
        this.setState({
            current:"View Missing Days",
            navigation:"Main CI/View Missing Days"
        },()=>this.store())
    }
    HandleViewHours(event){
        event.preventDefault()
        this.setState({
            current:"View Hours",
            navigation:"Main CI/View Missing and Extra Hours"
        },()=>this.store())
    }
    HandleCI(event){
        event.preventDefault()
        this.setState({
            current:"CI",
            navigation:"Main CI/AM",
            CI:false
        },()=>this.store())
    }

    
    componentDidMount()
  {
      try {
        this.documentData = JSON.parse(localStorage.getItem('ci'));
        this.setState({
            current: this.documentData.current,
            navigation: this.documentData.navigation,
            CI:this.documentData.CI})
      } catch (error) {
        this.setState({
            current:"main",
            navigation:"Main CI",
            CI:true
          })
      }
      
    
  }

    render()
    { 
       // localStorage.setItem('ci',JSON.stringify(this.state));
       if (this.state.CI) {
        let x,y;
        if (this.state.current==="main") {//main
             x=(<Schedule token={this.props.token} userid={this.props.userId}/>)
             y=(<Profile token={this.props.token}/>)
        }
        else{
             y=(null)
            if (this.state.current==="view coverage") {
                 x=(<CoursCoverag token={this.props.token}/>)
               
            }
            if (this.state.current==="NOT") {
                x=(<Notification token={this.props.token}/>)
              
           }
            if (this.state.current==="view assignment") {
                 x=(<SlotAssignment token={this.props.token}/>)
                
            }
            if (this.state.current==="staff in course") {
                 x=(<StaffCourse token={this.props.token}/>)
                
            }
            if (this.state.current==="staff in dept") {
                 x=(<StaffDept token={this.props.token}/>)
               
            }
            if (this.state.current==="slot assign") {
                 x=(<AssignToSlot token={this.props.token}/>)
                
            }
            if (this.state.current==="slot replace") {
                 x=(<UpdateSlot token={this.props.token}/>)
                
            }
            if (this.state.current==="slot delete") {
                 x=(<DeletFromSlot token={this.props.token}/>)
                
            }
            if (this.state.current==="course remove") {
                 x=(<RemoveFromCourse token={this.props.token}/>)
                
            }
            if (this.state.current==="CC") {
                 x=(<CourseCoordinator token={this.props.token}/>)
                
            }
//          ==========================================================  
            if (this.state.current==="update Profile"){
                x=(<UpdateProfile token={this.props.token}/>)
            }
            if(this.state.current==="Reset Password"){
                x=(<ResetPassword token={this.props.token}/>)
            }
            if(this.state.current==="View Attendance"){
                x=(<ViewAttendance token={this.props.token}/>)
            }
            if(this.state.current==="Sign In"){
                x=(<SignIn token={this.props.token}/>)
            }
            if(this.state.current==="Sign Out"){
                x=(<SignOut token={this.props.token}/>)
            }
            if(this.state.current==="View Missing Days"){
                x=(<ViewMissingDays token={this.props.token}/>)
            }
            if(this.state.current==="View Hours"){
                x=(<ViewHours token={this.props.token}/>)
            }
        }
        //console.log(this.props.token)
        return (
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
                        <Button onClick={this.HandleCoverage}>View the coverage of course</Button>
                        <Button onClick={this.HandleViewAssi}>View the slots assignment of course</Button>

                        <DropdownButton as={ButtonGroup} title="View all the staf" id="bg-vertical-dropdown-1">
                            <Dropdown.Item eventKey="1" onClick={this.HandleStaffCourse}>in course</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={this.HandleStaffdept}>in department</Dropdown.Item>
                        </DropdownButton>

                        <DropdownButton as={ButtonGroup} title="Slot Assignment" id="bg-vertical-dropdown-1">
                            <Dropdown.Item eventKey="1" onClick={this.HandleSlotAssi}>Assign Member to slot</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={this.HandleSlotRepl}>Replace Member</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={this.HandleSlotDel}>Delet Member from Slot</Dropdown.Item>
                        </DropdownButton>
                        <Button onClick={this.HandleCourseRem}>remove member from course</Button>
                        <Button onClick={this.HandleCc}>assign course coordinator</Button>
                        <DropdownButton as={ButtonGroup} title="Staff Members Functions" id="bg-vertical-dropdown-1">
                            <Dropdown.Item eventKey = "1" onClick={this.HandleUpdateProfile}>Update Profile</Dropdown.Item>
                            <Dropdown.Item eventKey = "2" onClick={this.HandleResetPassword}>Reset Password</Dropdown.Item>
                            <Dropdown.Item eventKey = "3" onClick={this.HandleViewAttendance}>View Attendendance</Dropdown.Item>
                            <Dropdown.Item eventKey = "4" onClick={this.HandleSignIn}>Sign In</Dropdown.Item>
                            <Dropdown.Item eventKey = "5" onClick={this.HandleSignOut}>Sign Out</Dropdown.Item>
                            <Dropdown.Item eventKey = "6" onClick={this.HandleViewMissingDays}>View Missing Days</Dropdown.Item>
                            <Dropdown.Item eventKey = "6" onClick={this.HandleViewHours}>View Missing And Extra Hours</Dropdown.Item>
                        </DropdownButton>
                        
                        <Button style={{background:"green"}} onClick={this.HandleCI}>academic member function</Button>
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
       } else {
           return(
            <AcademicMem token={this.props.token} userId={this.props.userId} back={this.BACK}/>
        )
           
       }
       
    }
}


export default CourseInstructor




// <div >
//                 <div >

//                 </div>
                
//                 <div >
                        
//                     </div>     
        
//             </div>    
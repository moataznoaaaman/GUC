import React from "react";
import axios from 'axios';

import {Navbar,Button,Nav,ButtonGroup,Dropdown,DropdownButton,Container,Row,Col} from 'react-bootstrap';
import Profile from './Profile'
//import Schedule from './Schedule'
import Notification from './Notification'
import AcademicMem from "../AM/AcademicMem1" 
import Respond from './Respond'
import ADDCS from './ADDCS' 
import DELCS from './DELCS' 
import UPDCS from './UPDCS' 
//==========================================================
import UpdateProfile from "../ci&hod/UpdateProfile";
import ResetPassword from "../ci&hod/ResetPassword";
import ViewAttendance from "../ci&hod/ViewAttendance";
import SignIn from "../ci&hod/SignIn";
import SignOut from "../ci&hod/SignOut";
import ViewMissingDays from "../ci&hod/ViewMissingDays";
import ViewHours from "../ci&hod/ViewHours";
export default class Coordinator extends React.Component
{
    constructor()
    {
        super()

        this.state=
        {
         current:"main",
         navigation:"Main CC",
         CI:true
        }
        this.HandleUPDCS = this.HandleUPDCS.bind(this)
         this.HandelADDCS = this.HandelADDCS.bind(this)
         this.HandleDELCS = this.HandleDELCS.bind(this)
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
        this.HandleRespond= this.HandleRespond.bind(this);
    }

    store()
    {
        localStorage.setItem('CC',JSON.stringify(this.state));
    }
    BACK(){
        
        this.setState({
            current:"main",
            navigation:"Main CC",
            CI:true
        },()=>{this.store();console.log(this.state)})
    }

    HandelADDCS(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"ADDCS",
                navigation:"Main CC/Add course to slot",
                
            }
        ,()=>this.store())
        
        //localStorage.setItem('ci',JSON.stringify(this.state));
    }
    HandleUPDCS(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"UPDCS",
                navigation:"Main CC/Update course slot",
                
            }
        ,()=>this.store())
        
        //localStorage.setItem('ci',JSON.stringify(this.state));
    }

    HandleDELCS(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"DELCS",
                navigation:"Main CC/Delet course to slot",
                
            }
        ,()=>this.store())
        
        //localStorage.setItem('ci',JSON.stringify(this.state));
    }
    HandleNOT(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"NOT",
                navigation:"Main CC/Notifications",
                
            }
        ,()=>this.store())
        
        //localStorage.setItem('ci',JSON.stringify(this.state));
    }
   
    HandleRespond(event){
        event.preventDefault() ;
       this.setState(
           {
               current:"RESP",
               navigation:"Main CC/Slot linking request",
           },()=>this.store()
       )
        
    }
    
    
    HandleHome(event)
    {
        //event.preventDefault()
        this.setState(
            {
                current:"main",
                navigation:"Main CC",
                
            }
            ,()=>this.store())
        
       // localStorage.setItem('ci',JSON.stringify(this.state));
    }
//==============================================================================    
    HandleUpdateProfile(event){
        event.preventDefault()
        this.setState({
            current:"update Profile",
            navigation:"Main CC/Update Profile"
        },()=>this.store())
    }
    HandleResetPassword(event){
        event.preventDefault()
        this.setState({
            current:"Reset Password",
            navigation:"Main CC/Reset Password"
        },()=>this.store())
    }
    HandleViewAttendance(event){
        event.preventDefault()
        this.setState({
            current:"View Attendance",
            navigation:"Main CC/View Attendance"
        },()=>this.store())
    }
    HandleSignIn(event){
        event.preventDefault()
        this.setState({
            current:"Sign In",
            navigation:"Main CC/Sign In"
        },()=>this.store())
    }
    HandleSignOut(event){
        event.preventDefault()
        this.setState({
            current:"Sign Out",
            navigation:"Main CC/Sign Out"
        },()=>this.store())
    }
    HandleViewMissingDays(event){
        event.preventDefault()
        this.setState({
            current:"View Missing Days",
            navigation:"Main CC/View Missing Days"
        },()=>this.store())
    }
    HandleViewHours(event){
        event.preventDefault()
        this.setState({
            current:"View Hours",
            navigation:"Main CC/View Missing and Extra Hours"
        },()=>this.store())
    }
    HandleCI(event){
        event.preventDefault()
        this.setState({
            current:"CI",
            navigation:"Main CC/AM",
            CI:false
        },()=>this.store())
    }

    HandleLogOut(token){
                   
        axios.post('http://localhost:4000/authentication/logout',{headers:{
            'token':token
        }})

        .then(res=>
            { localStorage.clear();
                window.location.reload();
               
            })
            .catch(err=>
                {
                    console.log(err)
                })
    }
    componentDidMount()
  {
      try {
        this.documentData = JSON.parse(localStorage.getItem('CC'));
        this.setState({
            current: this.documentData.current,
            navigation: this.documentData.navigation,
            CI:this.documentData.CI})
      } catch (error) {
        this.setState({
            current:"main",
            navigation:"Main CC",
            CI:true
          })
      }
      
    
  }
  HandleCI(event){
    event.preventDefault()
    this.setState({
        current:"CI",
        navigation:"Main CI/AM",
        CI:false
    },()=>this.store())
}

    render()
    { 
       // localStorage.setItem('ci',JSON.stringify(this.state));
       if (this.state.CI) {
        let x;
        if (this.state.current==="main") {//main
             x=(<Profile token={this.props.token}/>)}
        if (this.state.current==="NOT") {//main
             x=(<Notification token={this.props.token}/>)}
        if (this.state.current==="ADDCS") {//main
             x=(<ADDCS token={this.props.token}/>)} 
         if (this.state.current==="UPDCS") {//main
             x=(<UPDCS token={this.props.token}/>)}          
        if (this.state.current==="DELCS") {//main
             x=(<DELCS token={this.props.token}/>)}     
//          ==========================================================  
            if (this.state.current==="RESP"){
                x=(<Respond token={this.props.token}/>)
            }
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
                                    
                                    <DropdownButton as={ButtonGroup} title="course slot" id="bg-vertical-dropdown-1">
                                        <Dropdown.Item eventKey="1" onClick={this.HandelADDCS}>Add slot to course</Dropdown.Item>
                                        <Dropdown.Item eventKey="2" onClick={this.HandleUPDCS}>Update course slot</Dropdown.Item>
                                        <Dropdown.Item eventKey="2" onClick={this.HandleDELCS}>Delete slot from course</Dropdown.Item>
                                    </DropdownButton>
            
                                    <Button onClick={this.HandleRespond}>Slot Linking request</Button>
                                    
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







// <div >
//                 <div >

//                 </div>
                
//                 <div >
                        
//                     </div>     
        
//             </div>    
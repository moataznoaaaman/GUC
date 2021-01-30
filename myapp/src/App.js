
//makingsure
import React from "react";
//import axios from 'axios';
import LogIn from "./LogIn"
import CourseInstructor from "./components/ci&hod/CourseInstructor"
import HeadOfDepartment from "./components/ci&hod/HeadOfDepartment"
import AcademicMem from "./components/AM/AcademicMem"
import Coordinator  from "./components/CC/Coordinator"

var key = 'el5atir';  
let payload;
const jwt=require('jsonwebtoken');
class App extends React.Component {
  constructor() {
      super()
      this.state = {
          
          current:"login",
          message:"please enter your guc email and corresponding password",
          token:"",
          userId:"",
          userType:""
      }
      this.login = this.login.bind(this)
  }
  
  // Remove all keys
  //localStorage.clear()

  login(token)
  { 
    try {
      payload = jwt.verify(token, key);
        //req.id = payload.id;
        //req.userType = payload.userType;
        //console.log(payload.userType)
      this.setState(
        {
          current:payload.userType,
          message:"welcome back",
            token:token,
            userId:payload.id,
            userType:payload.userType
        })
        localStorage.setItem('document',JSON.stringify(this.state));
        //console.log(this.state)
    } catch (error) {
      
    }
        
    
    
  }

  componentDidMount()
  {
    this.documentData = JSON.parse(localStorage.getItem('document'));
    //localStorage.clear()
    if (localStorage.getItem('document')) {
        this.setState({
          current: this.documentData.current,
          message: this.documentData.message,
          token: this.documentData.token,
          userId: this.documentData.userId,
          userType: this.documentData.userType
    })
     }
     else {
      this.setState({
        current:"login",
        message:"please enter your guc email and corresponding password",
        token:"",
        userId:"",
        userType:""
      })
  }
  }

  
  
  render() {
    
    let x;
    if (this.state.current==="login") {
       x= (
        <div>
           <LogIn  confirm={this.login}/>
        </div>
    )    
    }
    else if (this.state.current==="ci")
    {
     // console.log('here')
      x= (
        <div>
           <CourseInstructor token={this.state.token} userId={this.state.userId}/>
        </div>
    )    
    }
    else if (this.state.current==="hod")
    {
     // console.log('here')
      x= (
        <div>
           <HeadOfDepartment token={this.state.token} userId={this.state.userId}/>
        </div>
    )    
    }
    else if (this.state.current==="am")
    {
     // console.log('here')
      x= (
        <div>
           <AcademicMem token={this.state.token} userId={this.state.userId}/>
        </div>
    )      
    }
    else if (this.state.current==="cc")
    {
     // console.log('here')
      x= (
        <div>
           <Coordinator token={this.state.token} userId={this.state.userId}/>
        </div>
    )      
    }

    return (
      //  <h1 className="navbar">{this.state.message}</h1>
      <div>
      {x}</div>
       
    )
    
    
    
  }
}
export default App
//<LogIn info={this.state.message}  clicko={this.submit}/>
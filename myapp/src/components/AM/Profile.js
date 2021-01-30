import React from "react";
import axios from 'axios';
import {Card,Spinner} from 'react-bootstrap';
class Profile extends React.Component
{  
    constructor()
    {
        super()

        this.state=
        {
           info:"loading....."
        }
    }

    async componentDidMount() 
    {
        this.setState(
            {
                info:<Spinner animation="border" variant="warning" />
            }
        )
                await axios.post('http://localhost:4000/authentication/profile',{ id:this.props.userid }, {
        headers: {
            'token': this.props.token
        }
        })

        .then(res=>
             {  // let reso=res.data
                const reso=
                "Hi "+res.data.name+"\n"+
                "Day Off: "+res.data.dayoff+"\n"+
                "Hours per month: "+res.data.hourspermonth+"\n"+
                "Annual Leave Balance: "+res.data.annualleavebalance+"\n"+
                "Gender: "+res.data.gender+"\n"+
                "Missing Days: "+res.data.missingdays+"\n"+
                "Missing Hours: "+res.data.missinghours+"\n"+
                "Extra Hours: "+res.data.extrahours+"\n"+
                "Worked Hours: "+res.data.workedhours+"\n"+
                "ID: "+res.data.id+"\n"+
                "Email: "+res.data.email+"\n"+
                "Salary: "+res.data.salary+"\n"+
                "Office: "+res.data.office+"\n"+
                "Department: "+res.data.department
                this.setState(//{ dayoff: 'monday', hourspermonth: 164.8, annualleavebalance: -6, gender: 'male', notifications: [ 'request :rfrf is accepted ' ], missingdays: 0, missinghours: 0, extrahours: 0, workedhours: 0, name: 'ci1', id: 'am-1', salary: 60, office: 'req.body.office', userType: 'ci', department: 'cs', __v: 0 }
                    {
                        info:<Card style={{ width: '30rem',height:'30rem' }}>
                        <Card.Body>
                        <Card.Title>Profile</Card.Title>
                        <Card.Text>
                        {reso.split("\n").map((i,key) => {
                                return <div key={key}>{i}</div>;
                            })}</Card.Text>
                        </Card.Body>
                     </Card>
                    }
                )
                
            })


            .catch(err=>
                {
                    console.log(err)
                })
    }
    render()
    {
        return (this.state.info)
    }
}

export default Profile
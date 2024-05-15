import taskFields from "./taskFields"

const validateMobile = (val="") => {
    if(val.length < 10)
        return true
    return false
}

let services = Object.keys(taskFields).map(a => (taskFields[a].name))
// let services = Object.keys(taskFields).map(a => ([a, taskFields[a].name]))
services.unshift("")
services.push('Consultation', 'Package A', 'Package B', 'Package C', 'Package D')
// services.unshift(["", ""])

const statusOptions = [
    "", 
    "Not Connected",
    "Invalid", 
    "Not Answered", 
    "Not Interested", 
    "Cold Lead", 
    "Hot Lead", 
    "Wrong Number", 
    "Call Back Later", 
]

// Project Location 	Project Plot Area 	Quoted Amount 	RERA Number 	Mobile Number 	Office Number 	Email ID 	Sales Rating (Multiple Option - 1/2/3/4/5)	Sales Source (Whatsapp/ Inbound Calls/ Existing Customer/ Reference/ Outbound Calls/ Website / Enquiries / Others)		Sales Responsibility 	Status (Multiple option - Profile Sent / Quotation Sent / Awaiting response/ Follow up require 	Follow up date 	Remarks 

export default {
    all: {
        name:"All",
        texts:[

            {label:"Sales ID", id:"salesID", isHidden:true},
            {label:"Project Name", id:"projectName", isRequired:true},
            {label:"Promoter Name", id:"promoterName", isRequired:true},
            // {label:"Members Assigned", id:"membersAssigned", isRequired:true},
            {label:"Added By", id:"memberName", isHidden:true},
            {label:"Phone 1", id:"phone1", isRequired:true},
            {label:"Phone 2", id:"phone2", isRequired:false},
            {label:"Status", id: "status", options: statusOptions},
            {label:"Client ID", id:"exClientID", isRequired:true},
            {label:"Village", id:"village"},
            {label:"OC", id:"oc"},
            {label:"District", id:"district"},
            {label:"Completion Date", id:"completionDate", type:"date"},
            {label:"Form 4", id:"form4"},
            {label:"Certificate No", id:"certificateNo"},
            {label:"Certificate Date", id:"certificateDate", type:"date"},
            {label:"Rating", id:"rating", options:['',1,2,3,4,5]},
            {label:"Remarks", id:"remarks", isHidden:false},           
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Calling Date", id:"callingDate", type:"date"},
            {label:"Meeting Date", id:"meetingDate", type:"date"},

        ],
        checkboxes:[
        ]
    },
}

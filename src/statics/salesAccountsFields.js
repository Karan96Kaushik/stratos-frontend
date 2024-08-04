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
    "Warm Lead", 
    "Hot Lead", 
    "Wrong Number", 
    "Call Back Later", 
    "Confirmed",
    "Converted",
    "Existing Client",
    "Retainer Client ",
    "Pricing Issue",
    "Connected",
    "Busy",
    "Irrelevant ",
    "Follow Up",
    "Switched Off",
    "Later Follow Up",
]

// Project Location 	Project Plot Area 	Quoted Amount 	RERA Number 	Mobile Number 	Office Number 	Email ID 	Sales Rating (Multiple Option - 1/2/3/4/5)	Sales Source (Whatsapp/ Inbound Calls/ Existing Customer/ Reference/ Outbound Calls/ Website / Enquiries / Others)		Sales Responsibility 	Status (Multiple option - Profile Sent / Quotation Sent / Awaiting response/ Follow up require 	Follow up date 	Remarks 

export default {
    all: {
        name:"All",
        texts:[

            {label:"Certificate No", id:"certificateNo"},

            {label:"Client ID", id:"exClientID",},  
            // {label:"Calling Date", id:"callingDate", type:"date", isRequired: true},

            {label:"Sales ID", id:"salesID", isHidden:true},
            {label:"Project Name", id:"projectName", isRequired:true},
            {label:"Promoter Name", id:"promoterName", isRequired:true},
            {label:"Phone 1", id:"phone1", isRequired:true},
            {label:"Phone 2", id:"phone2", isRequired:false},
            {label:"Village", id:"village"},
            {label:"District", id:"district"},
            {label:"Form 4", id:"form4", options:['', 'Y', 'N']},
            {label:"OC", id:"oc", options:['', 'Y', 'N']},

            {label:"Certificate Date", id:"certificateDate", type:"date"},
            {label:"Completion Date", id:"completionDate", type:"date"},

            // {label:"Status", id: "status", options: statusOptions},
            {label:"Rating", id:"rating", options:['',1,2,3,4,5]},
            // {label:"FollowUp Date", id:"followUpDate", type:"date"},
            // {label:"Meeting Date", id:"meetingDate", type:"date"},
            // {label:"Confirmed Amount", id:"confirmedAmount", type:"number"},
            {label:"Remarks", id:"remarks", isHidden:false, type:'array'}, 
            
            // {label:"Members Assigned", id:"membersAssigned", isRequired:true},
            
            {label:"Added By", id:"memberName", isHidden:true},

        ],
        checkboxes:[
        ]
    },
    item: {
        texts:[
            {label:"Service", id:"service", options:services},
            {label:"Quoted Amount", id:"quotedAmount", type:"number"},
            {label:"Confirmed Amount", id:"confirmedAmount", type:"number"},
            // {label:"Govt Fees", id:"govtFees", type:"number"},
            {label:"Note", id:"note"},
        ],
        checkboxes:[
        ]
    },
}

export {statusOptions}
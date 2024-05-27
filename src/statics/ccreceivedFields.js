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

            {label:"Data ID", id:"dataID"},
            {label:"Certificate No", id:"certNo", isRequired:true},
            {label:"Member Details", id:"memberInformation", isRequired:true},
            {label:"Promoter Name", id:"promoterName", isRequired:true},
            {label:"Village", id:"village"},
            {label:"District", id:"district"},

        ],
        checkboxes:[
        ]
    },
}

export {statusOptions}

const statuses = [
    "", 
    "New Task", 
    "In Progress", 
    "On Hold", 
    "Awaiting Documents from client", 
    "Awaiting Accounts", 
    "Completed", 
    "Desk 1", 
    "Desk 2", 
    "Desk 3", 
    "Desk 4", 
    "Accepted - 4", 
    "Under Scrutiny", 
    "Certificate Generated"
] 

const actions = [
    "", 
    "Awaiting Accounts Confirmation", 
    "Accounts Confirmation", 
    "Email Documents", 
    "Client File Prepared", 
    "Client File Given", 
    "Query raised by client", 
    "Query Solved"
]

export default {
    "Agent Registration": {
        name:"Agent Registration",
        texts:[
            {label:"Priority", id:"priority", type:"number"},
            {label:"Remarks", id:"remarks"},
            {label:"Notes", id:"notes"},
            {label:"Deadline", id:"deadline", type:"date", default:new Date().toISOString().split("T")[0]},
            {label:"Status", id:"status", options:statuses},
        ],
        checkboxes:[
            {label:"Letterhead", id:"letterHead"},
            {label:"Receipt Format", id:"receiptFormat"},
            {label:"ITR", id:"itr"},
        ]
    },
    "Project Registration": {
        name:"Project Registration",
        texts:[
            {label:"Priority", id:"priority", type:"number"},
            {label:"Remarks", id:"remarks"},
            {label:"Notes", id:"notes"},
            {label:"Deadline", id:"deadline", type:"date", default:new Date().toISOString().split("T")[0]},
            {label:"Status", id:"status", options:statuses},
        ],
        checkboxes:[
            {label:"Form 3", id:"form3"},
            {label:"Form 2", id:"form2"},
            {label:"Title Certificate", id:"titleCertificate"},
            {label:"Agreement Draft", id:"agreementDraft"},
        ]
    }
}
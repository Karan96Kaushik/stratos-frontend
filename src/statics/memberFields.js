import taskFields from "./taskFields"

const validateMobile = (val="") => {
    if(val.length < 10)
        return true
    return false
}

let departments = [
    '',
    'Administration', 
    'Compliance', 
    'Registration',
    'Registration 2',
    'Finance',
    'Client Retention',
    'Business Development',
    'Human Resource',
    'Marketing',
    'Legal',
    'EN Advisory',
    'Advisory',
]

const memberFields = {all:{
        texts:[
            {label:"Name", id:"userName", isRequired:true},
            {label:"Username", id:"email", isRequired:true},
            {label:"Password", id:"password", hideEdit:false, isRequired:true},
            {label:"Mobile", id:"phone", isRequired:true, validation:[validateMobile]},
            {label:"Designation", id:"designation", isRequired:true},
            {label:"Department", id:"department", isRequired:true, options: departments},
            {label:"Address", id:"address", isRequired:true},
            {label:"Emergency Contact", id:"emergencyContact", isRequired:true, validation:[validateMobile]},
            {label:"Blood Group", id:"bloodGroup", isRequired:true},
            {label:"Branch", id:"branch", options:['','Mumbai','Pune']},
            {label:"Start Date", id:"startDate", type:"date", isRequired:true},
            {label:"End Date", id:"endDate", type:"date"},
            {label:"Files", id:"files", type:"file"},
            {label:"Remarks", id:"remarks"},
        ],
        checkboxes:[
        ]
    }}

const pagePermissionFields = [
    "Members R",
    "Members W",
    "Clients R",
    "Clients W",
    "Leads R",
    "Leads W",
    "Quotations R",
    "Quotations W",
    "Invoices R",
    "Invoices W",
    "Tasks R",
    "Tasks W",
    "Payments R",
    "Payments W",
	"Packages R",
	"Packages W",
	"Packages Services W",
	"Packages Services R",
	"Packages Accounts W",
	"Packages Accounts R",
	"Assigned Task Accounts R",
    "Leads R Servicewise",
	"Tickets R",
	"Tickets W",
	"Sales R",
	"Sales W",
	"Approve Meetings",
	"CC Received R",
	"CC Received W",
	"Procurements R",
	"Procurements W",
]

const systemPermissionFields = [
    "View RERA Passwords",
    "Update Admin Settings",
    "Remote Access",
    "Approve Procurements",
    "Manage Procurements",
]

const servicePermissionFields = Object.keys(taskFields)

const notificationTypes = [
    // "New Assigned Task",
    "Assigned Task - Added Payments",
    "Package RM - Added Payments",
]

export {
    pagePermissionFields,
    servicePermissionFields,
    memberFields,
    notificationTypes,
    systemPermissionFields
}
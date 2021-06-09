const memberFields = {
        texts:[
            {label:"Name", id:"userName"},
            {label:"Email", id:"email"},
            {label:"Password", id:"password", hideEdit:true},
            {label:"Mobile", id:"phone"},
            {label:"Designation", id:"designation"},
            {label:"Department", id:"department"},
            {label:"Address", id:"address"},
            {label:"Emergency Contact", id:"emergencyContact"},
            {label:"Blood Group", id:"bloodGroup"},
            {label:"Start Date", id:"startDate", type:"date", default:new Date().toISOString().split("T")[0]},
            {label:"End Date", id:"startDate", type:"date"},
            {label:"Remarks", id:"remarks"},
        ],
        checkboxes:[
        ]
    }

const pagePermissionFields = [
    "Members R",
    "Members W",
    "Clients R",
    "Clients W",
    "Leads R",
    "Leads W",
]

const servicePermissionFields = [
    "Agent Registration",
    "Project Registration",
]

export {
    pagePermissionFields,
    servicePermissionFields,
    memberFields
}
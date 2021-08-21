
const statuses = [
    "", 
    "New Task", 
    "In Progress", 
    "On Hold", 
    "Awaiting Documents from client", 
    "Awaiting Accounts Confirmation",
] 

const statusSet1 = [
    "Completed", 
    "Desk 1", 
    "Desk 2", 
    "Desk 3", 
    "Desk 4", 
    "Accepted - 4", 
    "Under Scrutiny", 
    "Certificate Generated"
]

const statusSet2 = [
    "For Certification",  "Completed" 
]

const statusSet3 = [
    "Awaiting Hearing Date", "Hearing Date Schedule" 
]

const statusSet4 = [
    "Notice Sent", "Period Completed", "Reply Received", "Completed" 
]

const statusSet5 = [
    "Appointment Done", "Completed" 
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

let commonTextFields = [
    {label:"Priority", id:"priority", options:["", "High", "Medium", "Low"]},
    {label:"Remarks", id:"remarks"},
    {label:"Deadline", id:"deadline", type:"date"},
    {label:"Notes", id:"notes"},
    {label:"Bill Amount", id:"billAmount", type:"number"},
    {label:"GST", id:"gst", type:"number"},
    {label:"Files", id:"files", type:"file"},
]

export default {
    "Agent Registration": {
        name:"Agent Registration",
        texts:[
            ...commonTextFields,
            {label:"Status", id:"status", options:[...statuses, ...statusSet1]},
            {label:"Government Fees", id:"govtFees", type:"number"},
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
            ...commonTextFields,
            {label:"Status", id:"status", options:[...statuses, ...statusSet1]},
            {label:"Government Fees", id:"govtFees", type:"number"},
            {label:"SRO Fees", id:"sroFees", type:"number"},
        ],
        checkboxes:[
            {label:"Form 3", id:"form3"},
            {label:"Form 2", id:"form2"},
            {label:"Title Certificate", id:"titleCertificate"},
            {label:"Agreement Draft", id:"agreementDraft"},
            {label:"Allotment Letter", id:"allotmentLetter"},
            {label:"SRO", id:"sro"},
        ]
    },


    "Extension": {
        name:"Extension",
        texts:[
            {label:"Under Section", id:"section", options:["", "Section 6", "Section 7(3)"]},
            {label:"Curr Completion Date", id:"currCompletionDate", type:"date"},
            {label:"To Be Extended Date", id:"extenstionDate", type:"date"},
            ...commonTextFields,
            {label:"Status", id:"status", options:[...statuses, ...statusSet1]},
            {label:"Government Fees", id:"govtFees", type:"number"},
            {label:"SRO Fees", id:"sroFees", type:"number"},
        ],
        checkboxes:[
        ]
    },
    "Correction": {
        name:"Correction",
        texts:[
            {label:"Correction Details", id:"correctionDetails"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet1]},
            ...commonTextFields,
        ],
        checkboxes:[
            {label:"Consent Required", id:"consentReq"},
        ]
    },
    "Form 5 - Audit": {
        name:"Form 5 - Audit",
        texts:[
            {label:"Date of Certification", id:"dateOfCert", type:"date"},
            {label:"Period", id:"period", isRequired:true},
            {label:"CA Assigned", id:"ca"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet2]},
            ...commonTextFields,
        ],
        checkboxes:[
        ]
    },
    "Form 2A": {
        name:"Form 2A",
        texts:[
            {label:"Date of Certification", id:"dateOfCert", type:"date"},
            {label:"Period", id:"period", isRequired:true},
            {label:"Engineer Assigned", id:"engineer"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet2]},
            ...commonTextFields,
        ],
        checkboxes:[
        ]
    },
    "Updation": {
        name:"Updation",
        texts:[
            {label:"Work Status", id:"workStatus"},
            {label:"Booked Flats", id:"bookedFlats", type:"number"},
            {label:"Chabges to be Made", id:"changesReq"},
            {label:"Documents to be Uploaded", id:"docsReq"},
            {label:"As On Date", id:"asOnDate", type:"date", isRequired:true},
            {label:"Date of Certification", id:"dateOfCert", type:"date"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet2]},
            ...commonTextFields,
        ],
        checkboxes:[
        ]
    },
    "Form 1": {
        name:"Form 1",
        texts:[
            {label:"Architect Assigned", id:"architect"},
            {label:"As On Date", id:"asOnDate", type:"date", isRequired:true},
            {label:"Date of Certification", id:"dateOfCert", type:"date"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet2]},
            ...commonTextFields
        ],
        checkboxes:[
        ]
    },
    "Form 2": {
        name:"Form 2",
        texts:[
            {label:"CA Assigned", id:"ca"},
            {label:"As On Date", id:"asOnDate", type:"date", isRequired:true},
            {label:"Date of Certification", id:"dateOfCert", type:"date"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet2]},
            ...commonTextFields
        ],
        checkboxes:[
        ]
    },
    "Form 3": {
        name:"Form 3",
        texts:[
            {label:"Engineer Assigned", id:"engineer"},
            {label:"As On Date", id:"asOnDate", type:"date", isRequired:true},
            {label:"Date of Certification", id:"dateOfCert", type:"date"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet2]},
            ...commonTextFields
        ],
        checkboxes:[
        ]
    },
    "Others - Tech": {
        name:"Others - Tech",
        texts:[
            {label:"Service Requested", id:"serviceReq"},
            {label:"Service Description", id:"serviceDesc"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet2]},
            ...commonTextFields
        ],
        checkboxes:[
        ]
    },


    "Title Certificate": {
        name:"Title Certificate",
        texts:[
            {label:"Project Type", id:"projectType"},
            {label:"Search (in yrs)", id:"search", type:"number"},
            {label:"Paper Notice", id:"paperNotice"},
            {label:"Title Status", id:"titleStatus"},
            {label:"Prepared By", id:"preparedBy"},
            {label:"Checked By", id:"checkedBy"},
            {label:"Signed By", id:"signedBy"},
            {label:"Date of Certification", id:"dateOfCertification", type:"date"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet2]},
            ...commonTextFields
        ],
        checkboxes:[
        ]
    },
    "Agreement for Sale Draft": {
        name:"Agreement for Sale Draft",
        texts:[
            {label:"Project Type", id:"projectType"},
            {label:"Prepared By", id:"preparedBy"},
            {label:"Checked By", id:"checkedBy"},
            {label:"Status", id:"status", options:[...statuses, ...["Completed"]]},
            ...commonTextFields
        ],
        checkboxes:[
        ]
    },
    "Litigation": {
        name:"Litigation",
        texts:[
            {label:"Client Type", id:"clientType", options:["", "Developer", "Agent", "Litigation"]},
            {label:"Username", id:"username"},
            {label:"Password", id:"password"},
            {label:"Respondent Name", id:"respondentName"},
            {label:"Respondent Type", id:"respondentType"},
            {label:"Court", id:"court"},
            {label:"Project Name", id:"projectName"},
            {label:"RERA Number", id:"reraNumber"},
            {label:"Complaint", id:"complaint"},
            {label:"Hearing Date", id:"hearingDate", type:"date"},
            {label:"Package Description", id:"packageDesc"},
            {label:"Status", id:"status"},
            {label:"Result", id:"result"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet3]},
            ...commonTextFields
        ],
        checkboxes:[
        ]
    },
    "Hourly Package": {
        name:"Hourly Package",
        texts:[
            {label:"Bill Amount", id:"billAmount", type:"number"},
            {label:"GST", id:"gst", type:"number"},
        ],
        checkboxes:[
        ]
    },
    "Legal Notice": {
        name:"Legal Notice",
        texts:[
            {label:"Respondent Name", id:"respondentName"},
            {label:"Respondent Type", id:"respondentType"},
            {label:"Project Name", id:"projectName"},
            {label:"RERA Number", id:"reraNumber"},
            {label:"Case Brief", id:"caseBrief"},
            {label:"Dispatch Date", id:"dispatchDate", type:"date"},
            {label:"Status", id:"status"},
            {label:"Reply Status", id:"replyStatus"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet4]},

        ],
        checkboxes:[
        ]
    },
    "Registration": {
        name:"Registration",
        texts:[
            {label:"Type of Agreement", id:"typeOfAgreement"},
            {label:"Other Party Name", id:"otherPartyName"},
            {label:"Flat Number", id:"flatNumber"},
            {label:"Wing", id:"wing"},
            {label:"Carpet Area", id:"carpetArea", type:"number"},
            {label:"Consideration Value", id:"considerationValue", type:"number"},
            {label:"Drafting Done By", id:"draftingBy"},
            {label:"Registration Done By", id:"registrationBy"},
            {label:"Date Of Registration", id:"dateOfRegistration", type:"date"},
            {label:"Stamp Duty", id:"stampDuty", type:"number"},
            {label:"Registration", id:"registration"},
            {label:"DHC Charges", id:"dhcCharges", type:"number"},
            {label:"Total", id:"total", type:"number"},
            {label:"Status", id:"status", options:[...statuses, ...statusSet5]},
        ],
        checkboxes:[
        ]
    },
    "Drafting of Documents": {
        name:"Drafting of Documents",
        texts:[
            {label:"Document Type", id:"documentType"},
            {label:"Prepared By", id:"preparedBy"},
            {label:"Checked By", id:"checkedBy"},
            {label:"Status", id:"status", options:[...statuses, ...["Completed"]]},
        ],
        checkboxes:[
        ]
    },
    "Others - Legal": {
        name:"Others - Legal",
        texts:[
            {label:"Service Required", id:"serviceRequired"},
            {label:"Service Description", id:"serviceDescription"},
            {label:"Prepared By", id:"preparedBy"},
            {label:"Checked By", id:"checkedBy"},
            {label:"Status", id:"status", options:[...statuses, ...["Completed"]]},

        ],
        checkboxes:[
        ]
    },
}
import taskFields from "./taskFields"

let services = Object.keys(taskFields).map(a => (taskFields[a].name))
// let services = Object.keys(taskFields).map(a => ([a, taskFields[a].name]))
services.unshift("")
services.push('Consultation', 'Package A', 'Package B', 'Package C', 'Package D')
// services.unshift(["", ""])

const leadSourceOptions = ["","Whatsapp","Inbound Calls","Existing Customer","Reference","Outbound Calls","Website","Enquiries","Others", "Comission Agent"]
const closureStatusOptions = ["","On hold","Pricing issue","Undecisive","Converted","Confirmed", "Not Interested"]
const statusOptions = ["", "Profile Sent", "Quotation Sent", "Awaiting Response", "Follow up required", "Cold and Not Interested"]

export default {
    developer: {
        name:"Developer",
        texts:[
            {label:"Name", id:"name", isRequired:true},
            {label:"Project Name", id:"projectName"},
            {label:"Location", id:"location"},
            {label:"Plot No", id:"plotNum"},
            {label:"Plot Area", id:"plotArea"},
            {label:"RERA Cert No", id:"certNum"},
            {label:"Service Type", id:"serviceType", options:services},
            {label:"Mobile", id:"mobile", isRequired:true},
            {label:"Office", id:"office"},
            {label:"Email", id:"email"},
            {label:"Quote Remark (Short Answer)", id:"quoteAmount", type:"number"},

            {label:"Lead Rating", id:"leadRating", options: ["", 1,2,3,4,5], type:"number", isRequired:true},
            {label:"Lead Source", id:"leadSource", options:leadSourceOptions},
            {label:"Lead Responsibility", id:"leadResponsibility"},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Remarks", id:"remarks"},
            {label:"Closure Status", id:"closureStatus", options:closureStatusOptions},
            {label:"Status", id: "status", options: statusOptions},

        ],
        checkboxes:[
        ]
    },
    agent: {
        name:"Agent",
        texts:[
            {label:"Name", id:"name", isRequired:true},
            {label:"Mobile", id:"mobile", isRequired:true},
            {label:"Email", id:"email"},

            {label:"Other Services", id:"service", options:["Training", "Legal Documents", "Others"]},
            {label:"Type", id:"type", options:["Individual", "Other than Individual"]},
            {label:"Location", id:"location"},
            {label:"Status", id: "status", options: statusOptions},
            {label:"Service Type", id: "serviceType", option:["", 'RERA Registration', 'Other Services']},

            {label:"Lead Rating", id:"leadRating", options: [1,2,3,4,5], type:"number"},
            {label:"Lead Source", id:"leadSource", options:leadSourceOptions},
            {label:"Lead Responsibility", id:"leadResponsibility"},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Remarks", id:"remarks"},
            {label:"Closure Status", id:"closureStatus", options:closureStatusOptions},

        ],
        checkboxes:[
        ]
    },
    litigation: {
        name:"Litigation",
        texts:[
            {label:"Name", id:"name", isRequired:true},
            {label:"Mobile", id:"mobile", isRequired:true},
            {label:"Email", id:"email"},
            
            {label:"Type", id:"type", options:["Complainant", "Respondant"], isRequired:true},
            {label:"Category", id:"category", options:["Developer", "Buyer"], isRequired:true},
            {label:"Service", id:"service", options:["Package","Indivudal Service","Retainer Service"]},
            {label:"Breif Service Required", id:"breifService"},
            {label:"Breif Case", id:"breifCase"},
            {label:"Related Project Name", id:"projectName"},
            {label:"Related RERA No", id:"reraNum"},

            {label:"Lead Rating", id:"leadRating", options: [1,2,3,4,5], type:"number"},
            {label:"Lead Source", id:"leadSource", options:leadSourceOptions},
            {label:"Lead Responsibility", id:"leadResponsibility"},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Remarks", id:"remarks"},
            {label:"Closure Status", id:"closureStatus", options:closureStatusOptions},

        ],
        checkboxes:[
        ]
    },
}

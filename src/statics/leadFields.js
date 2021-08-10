import taskFields from "./taskFields"

let services = Object.keys(taskFields).map(a => (taskFields[a].name))
// let services = Object.keys(taskFields).map(a => ([a, taskFields[a].name]))
services.unshift("")
services.push('Consultation', 'Package A', 'Package B', 'Package C', 'Package D')
// services.unshift(["", ""])

const leadSourceOptions = ["","Whatsapp","Inbound Calls","Existing Customer","Reference","Outbound Calls","Website","Enquiries", "Commission Agent","Others"]
const closureStatusOptions = ["","On hold","Pricing issue","Undecisive","Converted","Confirmed", "Not Interested"]
const statusOptions = ["", "Profile Sent", "Quotation Sent", "Awaiting Response", "Follow up required", "Cold", "Not Interested"]

// Name, Project Name, Mobile No, Lead Rating, Status, Closure Status, Follow Up Date
export default {
    developer: {
        name:"Developer",
        texts:[
            {label:"Name", id:"name", isRequired:true},
            {label:"Project Name", id:"projectName"},
            {label:"Company Name", id:"companyName", isHidden:true},
            {label:"Location", id:"location", isHidden:true},
            {label:"Plot No", id:"plotNum", isHidden:true},
            {label:"Plot Area", id:"plotArea", isHidden:true},
            {label:"RERA Cert No", id:"certNum", isHidden:true},
            // {label:"Service Type", id:"serviceType", options:services, isHidden:true},
            {label:"Mobile", id:"mobile", isRequired:true},
            {label:"Office", id:"office", isHidden:true},
            {label:"Email", id:"email", isHidden:true},
            {label:"Quote Remark (Short Answer)", id:"quoteAmount", isHidden:true},

            {label:"Lead Rating", id:"leadRating", options: ["", 1,2,3,4,5], type:"number", isRequired:true},
            {label:"Lead Source", id:"leadSource", options:leadSourceOptions, isHidden:true},
            {label:"Lead Responsibility", id:"leadResponsibility", isHidden:true},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Remarks", id:"remarks", isHidden:true},
            {label:"Closure Status", id:"closureStatus", options:closureStatusOptions},
            {label:"Status", id: "status", options: statusOptions},
            {label:"Files", id:"files", type:"file", isHidden:true},

        ],
        checkboxes:[
        ]
    },
    agent: {
        name:"Agent",
        texts:[
            {label:"Name", id:"name", isRequired:true},
            {label:"Mobile", id:"mobile", isRequired:true},
            {label:"Email", id:"email", isHidden:true},

            {label:"Other Services", id:"service", options:["","Training", "Legal Documents", "Others"], isHidden:true},
            {label:"Type", id:"type", options:["","Individual", "Other than Individual"], isHidden:true},
            {label:"Location", id:"location", isHidden:true},
            {label:"Status", id: "status", options: statusOptions},
            {label:"Service Type", id: "serviceType", option:["", 'RERA Registration', 'Other Services'], isHidden:true},

            {label:"Lead Rating", id:"leadRating", options: ["",1,2,3,4,5], type:"number"},
            {label:"Lead Source", id:"leadSource", options:leadSourceOptions, isHidden:true},
            {label:"Lead Responsibility", id:"leadResponsibility", isHidden:true},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Remarks", id:"remarks", isHidden:true},
            {label:"Closure Status", id:"closureStatus", options:closureStatusOptions},
            {label:"Files", id:"files", type:"file", isHidden:true},

        ],
        checkboxes:[
        ]
    },
    litigation: {
        name:"Litigation",
        texts:[
            {label:"Name", id:"name", isRequired:true},
            {label:"Mobile", id:"mobile", isRequired:true},
            {label:"Email", id:"email", isHidden:true},
            
            {label:"Type", id:"type", options:["","Complainant", "Respondant"], isRequired:true, isHidden:true},
            {label:"Category", id:"category", options:["","Developer", "Buyer"], isRequired:true, isHidden:true},
            {label:"Service", id:"service", options:["","Package","Indivudal Service","Retainer Service"], isHidden:true},
            {label:"Breif Service Required", id:"breifService", isHidden:true},
            {label:"Breif Case", id:"breifCase", isHidden:true},
            {label:"Related Project Name", id:"projectName", isHidden:true},
            {label:"Related RERA No", id:"reraNum", isHidden:true},

            {label:"Status", id: "status", options: statusOptions},
            {label:"Lead Rating", id:"leadRating", options: ["",1,2,3,4,5], type:"number"},
            {label:"Lead Source", id:"leadSource", options:leadSourceOptions, isHidden:true},
            {label:"Lead Responsibility", id:"leadResponsibility", isHidden:true},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Remarks", id:"remarks", isHidden:true},
            {label:"Closure Status", id:"closureStatus", options:closureStatusOptions},
            {label:"Files", id:"files", type:"file", isHidden:true},

        ],
        checkboxes:[
        ]
    },
}

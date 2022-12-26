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

const leadSourceOptions = ["","Whatsapp","Inbound Calls","Existing Customer","Reference","Outbound Calls","Website","Enquiries", "Commission Agent","Others"]
const closureStatusOptions = ["","On hold","Pricing issue", "Awaiting Response", "Undecisive", "Converted", "In Progress", "Confirmed", "Not Interested"]
const statusOptions = ["", "Profile Sent", "Quotation Sent", "Awaiting Response", "Follow up required", "Cold", "Not Interested","Others"]

// Project Location 	Project Plot Area 	Quoted Amount 	RERA Number 	Mobile Number 	Office Number 	Email ID 	Lead Rating (Multiple Option - 1/2/3/4/5)	Lead Source (Whatsapp/ Inbound Calls/ Existing Customer/ Reference/ Outbound Calls/ Website / Enquiries / Others)		Lead Responsibility 	Status (Multiple option - Profile Sent / Quotation Sent / Awaiting response/ Follow up require 	Follow up date 	Remarks 

export default {
    // all: {
    //     name:"",
    //     texts:[
    //         {label:"Date Added", id:"createdTime", isRequired:true},
    //         {label:"Lead ID", id:"leadID", isRequired:true},
    //         {label:"Member ID", id:"memberID", isRequired:true},
            
    //         {label:"Name", id:"name", isRequired:true},
    //         {label:"Service Type", id:"serviceType", options:services, isHidden:false},
    //         {label:"Mobile", id:"mobile", isRequired:true},
    //         {label:"Email", id:"email", isHidden:true},

    //         {label:"Lead Rating", id:"leadRating", options: ["", 1,2,3,4,5], type:"number", isRequired:true},
    //         {label:"Lead Source", id:"leadSource", options:leadSourceOptions, isHidden:true},
    //         {label:"Lead Responsibility", id:"leadResponsibility", isHidden:true},
    //         {label:"FollowUp Date", id:"followUpDate", type:"date"},
    //         {label:"Remarks", id:"remarks", isHidden:true},
    //         {label:"Closure Status", id:"closureStatus", options:closureStatusOptions},
    //         {label:"Status", id: "status", options: statusOptions},
    //     ]
    // },
    developer: {
        name:"Developer",
        texts:[
            {label:"Name", id:"name", isRequired:true},
            {label:"Project Name", id:"projectName"},
            {label:"Company Name", id:"companyName", isHidden:false},
            {label:"Location", id:"location", isHidden:false},
            {label:"Plot No", id:"plotNum", isHidden:false},
            {label:"Plot Area", id:"plotArea", isHidden:false},
            {label:"RERA Cert No", id:"certNum", isHidden:false},
            // {label:"Service Type", id:"serviceType", options:services, isHidden:false},
            {label:"Mobile", id:"mobile", isRequired:true, validation:[validateMobile]},
            {label:"Office", id:"office", isHidden:false},
            {label:"Email", id:"email", isHidden:false},
            {label:"Quote Remark (Short Answer)", id:"quoteAmount", isHidden:false},

            {label:"Lead Rating", id:"leadRating", options: ["", 1,2,3,4,5], type:"number", isRequired:true},
            {label:"Lead Source", id:"leadSource", options:leadSourceOptions, isHidden:false},
            {label:"Lead Responsibility", id:"leadResponsibility", isHidden:false},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Closure Status", id:"closureStatus", options:closureStatusOptions},
            {label:"Status", id: "status", options: statusOptions},
            {label:"Files", id:"files", type:"file", isHidden:false},
            {label:"Remarks", id:"remarks", isHidden:false},

        ],
        checkboxes:[
        ]
    },
    agent: {
        name:"Agent",
        texts:[
            {label:"Name", id:"name", isRequired:true},
            {label:"Mobile", id:"mobile", isRequired:true, validation:[validateMobile]},
            {label:"Email", id:"email", isHidden:false},

            {label:"Other Services", id:"service", options:["","Training", "Legal Documents", "Others"], isHidden:false},
            {label:"Type", id:"type", options:["","Individual", "Other than Individual"], isHidden:false},
            {label:"Location", id:"location", isHidden:false},
            {label:"Status", id: "status", options: statusOptions},
            // {label:"Service Type", id:"serviceType", options:services, isHidden:false},
            // {label:"Service Type", id: "serviceType", option:["", 'RERA Registration', 'Other Services'], isHidden:false},

            {label:"Lead Rating", id:"leadRating", options: ["",1,2,3,4,5], type:"number"},
            {label:"Lead Source", id:"leadSource", options:leadSourceOptions, isHidden:false},
            {label:"Lead Responsibility", id:"leadResponsibility", isHidden:false},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Closure Status", id:"closureStatus", options:closureStatusOptions},
            {label:"Files", id:"files", type:"file", isHidden:false},
            {label:"Remarks", id:"remarks", isHidden:false},

        ],
        checkboxes:[
        ]
    },
    litigation: {
        name:"Litigation",
        texts:[
            {label:"Name", id:"name", isRequired:true},
            {label:"Mobile", id:"mobile", isRequired:true, validation:[validateMobile]},
            {label:"Email", id:"email", isHidden:false},
            
            {label:"Type", id:"type", options:["","Complainant", "Respondant"], isRequired:true, isHidden:false},
            {label:"Category", id:"category", options:["","Developer", "Buyer"], isRequired:true, isHidden:false},
            // {label:"Service Type", id:"serviceType", options:services, isHidden:false},
            {label:"Service", id:"service", options:["","Package","Indivudal Service","Retainer Service"], isHidden:false},
            {label:"Breif Service Required", id:"breifService", isHidden:false},
            {label:"Breif Case", id:"breifCase", isHidden:false},
            {label:"Related Project Name", id:"projectName", isHidden:false},
            {label:"Related RERA No", id:"reraNum", isHidden:false},

            {label:"Status", id: "status", options: statusOptions},
            {label:"Lead Rating", id:"leadRating", options: ["",1,2,3,4,5], type:"number"},
            {label:"Lead Source", id:"leadSource", options:leadSourceOptions, isHidden:false},
            {label:"Lead Responsibility", id:"leadResponsibility", isHidden:false},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Closure Status", id:"closureStatus", options:closureStatusOptions},
            {label:"Files", id:"files", type:"file", isHidden:false},
            {label:"Remarks", id:"remarks", isHidden:false},

        ],
        checkboxes:[
        ]
    },
}

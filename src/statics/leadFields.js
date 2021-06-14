import taskFields from "./taskFields"

let services = Object.keys(taskFields).map(a => (taskFields[a].name))
// let services = Object.keys(taskFields).map(a => ([a, taskFields[a].name]))
services.unshift("")
// services.unshift(["", ""])

export default {
    developer: {
        name:"Developer",
        texts:[
            {label:"Name", id:"name"},
            {label:"Project Name", id:"projectName"},
            {label:"Location", id:"location"},
            {label:"Plot No", id:"plotNum"},
            {label:"Plot Area", id:"plotArea"},
            {label:"RERA Cert No", id:"certNum"},
            {label:"Service Type", id:"serviceType", options:services},
            {label:"Mobile", id:"mobile"},
            {label:"Office", id:"office"},
            {label:"Email", id:"email"},
            {label:"Quote Amount", id:"quoteAmount", type:"number"},

            {label:"Lead Rating", id:"leadRating", options: [1,2,3,4,5], type:"number"},
            {label:"Lead Source", id:"leadSource", options:["","Whatsapp","Inbound Calls","Existing Customer","Reference","Outbound Calls","Website","Enquiries","Others"]},
            {label:"Lead Responsibility", id:"leadResponsibility"},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Remarks", id:"remarks"},
            {label:"Closure Status", id:"closureStatus", options:["","On hold","Pricing issue","Undecisive","Converted","Confirmed"]},

        ],
        checkboxes:[
        ]
    },
    agent: {
        name:"Agent",
        texts:[
            {label:"Name", id:"name"},
            {label:"Mobile", id:"mobile"},
            {label:"Email", id:"email"},

            {label:"Other Services", id:"service", options:["Training", "Legal Documents", "Others"]},
            {label:"Type", id:"type", options:["Individual", "Other than Individual"]},
            {label:"Location", id:"location"},
            {label:"Status", id: "status", options: ["Profile Sent", "Quotation Sent", "Awaiting Response", "Follow up required"]},

            {label:"Lead Rating", id:"leadRating", options: [1,2,3,4,5], type:"number"},
            {label:"Lead Source", id:"leadSource", options:["Whatsapp","Inbound Calls","Existing Customer","Reference","Outbound Calls","Website","Enquiries","Others"]},
            {label:"Lead Responsibility", id:"leadResponsibility"},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Remarks", id:"remarks"},
            {label:"Closure Status", id:"closureStatus", options:["","On hold","Pricing issue","Undecisive","Converted","Confirmed"]},

        ],
        checkboxes:[
        ]
    },
    litigation: {
        name:"Litigation",
        texts:[
            {label:"Name", id:"name"},
            {label:"Mobile", id:"mobile"},
            {label:"Email", id:"email"},
            
            {label:"Type", id:"type", options:["Complainant", "Respondant"]},
            {label:"Category", id:"category", options:["Developer", "Buyer"]},
            {label:"Service", id:"service", options:["Package","Indivudal Service","Retainer Service"]},
            {label:"Breif Service Required", id:"breifService"},
            {label:"Breif Case", id:"breifCase"},
            {label:"Related Project Name", id:"projectName"},
            {label:"Related RERA No", id:"reraNum"},

            {label:"Lead Rating", id:"leadRating", options: [1,2,3,4,5], type:"number"},
            {label:"Lead Source", id:"leadSource", options:["Whatsapp","Inbound Calls","Existing Customer","Reference","Outbound Calls","Website","Enquiries","Others"]},
            {label:"Lead Responsibility", id:"leadResponsibility"},
            {label:"FollowUp Date", id:"followUpDate", type:"date"},
            {label:"Remarks", id:"remarks"},
            {label:"Closure Status", id:"closureStatus", options:["","On hold","Pricing issue","Undecisive","Converted","Confirmed"]},

        ],
        checkboxes:[
        ]
    },
}

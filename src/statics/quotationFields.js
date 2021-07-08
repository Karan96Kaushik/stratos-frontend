import taskFields from "./taskFields"

const status = ["None" , "On hold" , "Pricing issue" , "Undecisive" , "Converted" , "Confirmed", "Not Interested"]
const serviceTypes = Object.keys(taskFields)
serviceTypes.unshift("")
serviceTypes.push('Consultation', 'Package A', 'Package B', 'Package C', 'Package D')

const quotationFields = {
    "all": {
        texts:[
            {label:"Service Type", id:"serviceType", options:serviceTypes, isRequired:true},
            {label:"Department", id:"dept", options:["", "Tech", "Legal", "CMS", "Retainer"], isRequired:true},
            {label:"Client Name", id:"clientName", isRequired:true},
            {label:"Related Project Name", id:"relatedProject"},
            {label:"Lead ID", id:"leadID"},
            {label:"Quotation Valid Till", id:"quoteValid", type:"date"},
            {label:"Quotation Desc", id:"quotationDesc"},
            {label:"Quotation Amount", id:"quotationAmount"},
            {label:"Remarks", id:"remarks"},
            {label:"Status", id:"status", options: status},
            {label:"Files", id:"files", type:"file"},
        ],
        checkboxes:[
        ]
    }
}

export default quotationFields

import taskFields from "./taskFields"

const closureStatusOptions = ["","On hold","Pricing issue", "Awaiting Response", "Undecisive", "Converted", "In Progress", "Confirmed", "Not Interested"]
const status = ["", "None" , "On hold" , "Pricing issue" , "Undecisive" , "Converted" , "Confirmed", "Not Interested"]
const serviceTypes = Object.keys(taskFields)
serviceTypes.unshift("")
serviceTypes.push('Consultation', 'Package A', 'Package B', 'Package C', 'Package D')

const validateMobileEnd = (val="") => {
    if(val.length !== 5)
        return true
    return false
}

const quotationFields = {
    "all": {
        texts:[
            // {label:"Service Type", id:"serviceType", options:serviceTypes, isRequired:true},
            {label:"Department", id:"dept", options:["", "Tech", "Legal", "CMS", "Retainer"], isRequired:true},
            {label:"Client Name", id:"clientName", isRequired:true},
            {label:"Related Project Name", id:"relatedProject"},
            {label:"Lead ID", id:"leadID"},
            {label:"Quotation Valid Till", id:"quoteValid", type:"date"},
            {label:"Quotation Desc", id:"quotationDesc"},
            {label:"Quotation Amount", id:"quotationAmount"},
            {label:"Status", id:"status", options: status},
            {label:"Closure Status", id:"closureStatus", options:closureStatusOptions},
            {label:"Files", id:"files", type:"file"},
            {label:"Client Mobile End (5)", id:"mobileEnd", validation:[validateMobileEnd]},
            {label:"Remarks", id:"remarks"},
        ],
        checkboxes:[
        ]
    }
}

const allQuotes = {
    texts: [
        {label:"Department", id:"dept", options:["", "Tech", "Legal", "CMS", "Retainer"], isRequired:true},
        {label:"Client Name", id:"clientName", isRequired:true},
        {label:"Related Project Name", id:"relatedProject"},
        // {label:"Lead ID", id:"leadID"},
        // {label:"Quotation Valid Till", id:"quoteValid", type:"date"},
        {label:"Quotation Desc", id:"quotationDesc"},
        {label:"Quotation Amount", id:"quotationAmount"},
        {label:"Status", id:"status", options: status},
        // {label:"Files", id:"files", type:"file"},
        // {label:"Remarks", id:"remarks"},
    ],
    checkboxes: []
}

export {allQuotes}
export default quotationFields

import taskFields from "./taskFields"

const status = ["None" , "On hold" , "Pricing issue" , "Undecisive" , "Converted" , "Confirmed"]

const invoiceFields = {
        texts:[
            {label:"Service Type", id:"serviceType", options:Object.keys(taskFields), isRequired:true},
            {label:"Department", id:"dept", options:["", "Tech", "Legal", "CMS", "Retainer"], isRequired:true},
            {label:"Client Name", id:"clientName", isRequired:true},
            {label:"Related Project Name", id:"relatedProject"},
            {label:"Lead ID", id:"leadID"},
            {label:"Quotation Valid Till", id:"quoteValid", type:"date"},
            {label:"Quotation Desc", id:"quotationDesc"},
            {label:"Quotation Amount", id:"quotationAmount"},
            {label:"Remarks", id:"remarks"},
            {label:"Status", id:"status", options: status},
        ],
        checkboxes:[
        ]
    }

export default invoiceFields

import { modeOptions } from './paymentFields'
const statusOptions = [
    "",
    "New Procurement",
    "Pending Approval",
    "Approved",
    "Rejected",
    "Cancelled",
    "Completed",
]

export default {
    all: {
        texts: [
            {label:'Vendor Name', id:"vendorName", disableIn: ['accounts']},
            
            {label:'Bill Date', id:"billDate", type:"date", disableIn: ['accounts', 'request']},
            // {label:'Sr No.', id:"srNo", disableIn: ['accounts']},
            // {label:'Date', id:"date", type:"date"},
            {label:'Reference No.', id:"referenceNo", disableIn: ['accounts', 'request']},
            {label:'Department', id:"department", disableIn: ['accounts', 'request']},
            // {label:'Procurement Requisition By', id:"procurementRequisitionBy"},
            // {label:'Procurement Approved By', id:"procurementApprovedBy"},
            // {label:'Last Approver Date', id:"lastApproverDate"},
            {label:'Vendor Code', id:"vendorCode", disableIn: ['accounts', 'request']},
            {label:'Vendor Type', id:"vendorType", disableIn: ['accounts', 'request']},
            {label:'Product Details', id:"productDetails", disableIn: ['accounts', 'request']},
            {label:'Bill No', id:"billNo", disableIn: ['accounts', 'request']},
            {label:'Amount', id:"amount", type: 'number', disableIn: ['accounts', 'request']},
            {label:'GST Amount', id:"gstamount", type: 'number', disableIn: ['accounts', 'request']},
            {label:'TDS Amount', id:"tdsamount", type: 'number', disableIn: ['accounts', 'request']},
            // {label:'Total', id:"total", type: 'number'},
            {label:'Status', id:"status", options: statusOptions, disableIn: ['request']},
            {label:'Paid Amount', id:"paidAmount", type: 'number', disableIn: ['request', 'manage']},
            {label:'Payment Type', id:"paymentType", disableIn: ['request', 'manage']},
            {label:'Payment Reference', id:"paymentReference", disableIn: ['request', 'manage']},
            {label:'Payment Mode', id:"paymentMode", options: modeOptions, disableIn: ['request', 'manage']},
            {label:'Remarks', id:"remarks"},
            // {label:'Payment Month', id:"paymentMonth", },
            // {label:'Payment Date', id:"paymentDate", type:"date"},
            {label:'Asset Tagging Code', id:"assetTaggingCode", disableIn: ['request', 'manage']},
            // {label:'Tat', id:"tat", disableIn: ['request', 'manage']},
            {label:'Files', id:"files", type: 'file'},
        ],
        checkboxes: [
            {label:"Archived", id:"archived"},
        ]
    }
}
export {statusOptions}
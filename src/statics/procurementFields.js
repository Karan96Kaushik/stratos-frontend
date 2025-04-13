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
            
            {label:'Sr No.', id:"srNo", isRequired: true, disableIn: ['accounts']},
            // {label:'Date', id:"date", type:"date"},
            {label:'Reference No.', id:"referenceNo", isRequired: true, disableIn: ['accounts']},
            {label:'Department', id:"department", disableIn: ['accounts']},
            // {label:'Procurement Requisition By', id:"procurementRequisitionBy"},
            // {label:'Procurement Approved By', id:"procurementApprovedBy"},
            // {label:'Last Approver Date', id:"lastApproverDate"},
            {label:'Vendor Name', id:"vendorName", disableIn: ['accounts']},
            {label:'Vendor Code', id:"vendorCode", disableIn: ['accounts']},
            {label:'Vendor Type', id:"vendorType", disableIn: ['accounts']},
            {label:'Product Details', id:"productDetails", disableIn: ['accounts']},
            {label:'Bill No', id:"billNo", disableIn: ['accounts']},
            {label:'Amount', id:"amount", type: 'number', isRequired: true, disableIn: ['accounts']},
            {label:'GST Amount', id:"gstamount", type: 'number', disableIn: ['accounts']},
            {label:'TDS Amount', id:"tdsamount", type: 'number'},
            // {label:'Total', id:"total", type: 'number'},
            {label:'Status', id:"status", options: statusOptions, disableIn: ['request']},
            {label:'Paid Amount', id:"paidAmount", type: 'number', disableIn: ['request', 'manage']},
            {label:'Payment Type', id:"paymentType", disableIn: ['request', 'manage']},
            {label:'Payment Reference', id:"paymentReference", disableIn: ['request', 'manage']},
            {label:'Payment Mode', id:"paymentMode", options: modeOptions, disableIn: ['request', 'manage']},
            {label:'Remarks', id:"remarks"},
            // {label:'Payment Month', id:"paymentMonth", },
            // {label:'Payment Date', id:"paymentDate", type:"date"},
            {label:'Asset Tagging Code', id:"assetTaggingCode"},
            // {label:'Tat', id:"tat", disableIn: ['request', 'manage']},
            {label:'Files', id:"files", type: 'file'},
        ],
        checkboxes: [
            {label:"Archived", id:"archived"},
        ]
    }
}
export {statusOptions}
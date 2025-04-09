
const statusOptions = [
    "",
    "Pending Approval",
    "Approved",
    "Rejected",
    "Cancelled",
    "Completed",
]

export default {
    all: {
        texts: [
            
            {label:'Sr No.', id:"srNo", isRequired: true},
            // {label:'Date', id:"date", type:"date"},
            {label:'Reference No.', id:"referenceNo", isRequired: true },
            {label:'Department', id:"department"},
            // {label:'Procurement Requisition By', id:"procurementRequisitionBy"},
            // {label:'Procurement Approved By', id:"procurementApprovedBy"},
            // {label:'Last Approver Date', id:"lastApproverDate"},
            {label:'Vendor Name', id:"vendorName"},
            {label:'Vendor Code', id:"vendorCode"},
            {label:'Vendor Type', id:"vendorType"},
            {label:'Product Details', id:"productDetails"},
            {label:'Bill No', id:"billNo", isRequired: true},
            {label:'Amount', id:"amount", type: 'number', isRequired: true},
            {label:'GST Amount', id:"gstamount", type: 'number'},
            {label:'TDS Amount', id:"tdsamount", type: 'number'},
            // {label:'Total', id:"total", type: 'number'},
            {label:'Status', id:"status", options: statusOptions},
            {label:'Payment Type', id:"paymentType"},
            {label:'Remarks', id:"remarks"},
            // {label:'Payment Month', id:"paymentMonth", },
            // {label:'Payment Date', id:"paymentDate", type:"date"},
            {label:'Asset Tagging Code', id:"assetTaggingCode"},
            {label:'Tat', id:"tat"},
            {label:'Files', id:"files", type: 'file'},
        ],
        checkboxes: [
            {label:"Archived", id:"archived"},
        ]
    }
}
// export {services, yearlyServices, otherServices, clientSourceOptions}
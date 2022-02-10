
const froms = [
    "",
    "Osha Technologies",
    "RERA Easy",
    "Shantanu Kuchya" ,
    "SDC Legal Services", 
    "Envision Next LLP",
] 

const invoiceFields = {
    all: {
        texts:[
            {label:"Invoice ID", id:"invoiceID"},
            {label:"Invoice From", id:"from", options:froms, isRequired:true},
            {label:"Type", id:"type", options:["", "Proforma Invoice", "Invoice", "Tax Invoice"], isRequired:true},
            {label:"Invoice Date", id:"date", type:"date"},
            {label:"GST Num", id:"gstNum", options:["", "None", "27AAFFO8457Q1ZB"]},
            {label:"Project Name", id:"projectName", isRequired:true},
            {label:"PAN Card No", id:"panNum", options:["", "None", "AAFFO8457Q", "CPAPK0273E"]},
            // {label:"Particulars", id:"particulars"},
            {label:"Bill To", id:"billTo"},
            {label:"Client Address", id:"clientAddress"},
            {label:"Client GST", id:"clientGST"},
            // {label:"Total Bill Amount", id:"billAmount", type:"number"},
            // {label:"Total Tax Amount", id:"taxAmount", type:"number"},
            // {label:"Total Amount", id:"totalAmount", type:"number"},
            // {label:"Govt Fees", id:"govtFees", type:"number"},
            {label:"Paid Amount", id:"paidAmount", type:"number"},
            // {label:"Balance Amount", id:"balanceAmount", type:"number"},
            {label:"Notes", id:"notes"},
            {label:"Special Notes", id:"specialNotes"},
            {label:"Bill Period", id:"billPeriod"},
            {label:"Quotation Date", id:"quotationDate"},
            {label:"Quotation No", id:"quotationNum"},
            {label:"Files", id:"files", type:"file"},
        ],
        checkboxes:[
        ]
    },
    item: {
        texts:[
            {label:"Particulars", id:"particulars"},
            {label:"Bill Amount", id:"billAmount", type:"number"},
            {label:"Tax Amount", id:"taxAmount", type:"number"},
            {label:"Govt Fees", id:"govtFees", type:"number"},
            {label:"Note", id:"note"},
        ],
        checkboxes:[
        ]
    },
}

export default invoiceFields


const froms = [
    "",
    "Osha Technologies",
    "RERA Easy",
    "Shantanu Kuchya" ,
    "SDC Legal Services", 
    "Envision Next LLP",
] 

const invoiceFields = {
        texts:[
            {label:"Invoice From", id:"from", options:froms, isRequired:true},
            {label:"Type", id:"type", options:["", "Proforma Invoice", "Invoice", "Tax Invoice"], isRequired:true},
            {label:"Date", id:"date", type:"date"},
            {label:"GST Num", id:"gstNum", options:["", "None", "27AAFFO8457Q1ZB"]},
            {label:"Bill To", id:"billTo"},
            {label:"Client Addr", id:"clientAddress"},
            {label:"Client GST", id:"clientGST"},
            {label:"Total Bill Amount", id:"billAmount", type:"number"},
            {label:"Total Tax Amount", id:"taxAmount", type:"number"},
            {label:"Total Amount", id:"totalAmount", type:"number"},
            {label:"Paid Amount", id:"paidAmount", type:"number"},
            {label:"Balance Amount", id:"balanceAmount", type:"number"},
        ],
        checkboxes:[
        ]
    }

export default invoiceFields

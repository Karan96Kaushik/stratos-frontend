const froms = {
    "": {},
    "Osha Technologies": {
        gstNum: '27AAFFO8457Q1ZB',
        panNum: 'AAFFO8457Q'
    },
    "RERA Easy": {
        gstNum: 'None',
        panNum: 'CPAPK0273E'
    },
    "Shantanu Kuchya": {
        gstNum: 'None',
        panNum: 'CPAPK0273E'
    },
    "SDC Legal Services": {
        gstNum: 'None',
        panNum: 'CCKPM8294A'
    }, 
    "Envision Next LLP": {
        gstNum: '27AAJFE1796J1ZZ',
        panNum: 'AAJFE1796J'
    },
    "RERA Easy Services": {
        gstNum: 'None',
        panNum: 'GHWPK7836P'
    },
    "REC - Not to Use": {
        gstNum: 'None',
        panNum: 'ABGFR8055D'
    },
    "KC & PARTNERS": {
        gstNum: 'None',
        panNum: 'ABAFK3517F'
    },
    "RERA Easy Legal Advisors": {
        gstNum: '',
        panNum: 'ABJFR9779F'
    },
    "RERA Easy Agents Services": {
        gstNum: '',
        panNum: 'ABJFR9235N'
    },

}

const invoiceFields = {
    all: {
        texts:[
            {label:"Invoice ID", id:"invoiceID"},
            {label:"Invoice From", id:"from", options:Object.keys(froms), isRequired:true},
            {label:"Type", id:"type", options:["", "Proforma Invoice", "Invoice", "Tax Invoice"], isRequired:true},
            {label:"Invoice Date", id:"date", type:"date"},
            {label:"GST Num", id:"gstNum", options:["", "None", "27AAFFO8457Q1ZB","27AAJFE1796J1ZZ"]},
            {label:"Project Name", id:"projectName", isRequired:true},
            {label:"PAN Card No", id:"panNum", options:["", "None", "AAFFO8457Q", "AAJFE1796J", "CCKPM8294A", "GHWPK7836P", "ABGFR8055D", "CPAPK0273E", "ABAFK3517F", "ABJFR9779F", "ABJFR9235N"]},
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

export {froms}
export default invoiceFields

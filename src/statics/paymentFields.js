const modeOptions = [
    "", "Shantanu HDFC", "RERA Easy", "Osha Technologies", "Cash", "Other (please specify)", "TDS", "SDC Legal Services"
]

export default {
    all: {
        texts: [
            {label:"Payment Date", id:"paymentDate", type:"date"},
            {label:"Invoice ID", id:"invoiceID"},
            {label:"Received Amount", id:"receivedAmount", type:"number", isRequired:true},
            {label:"Mode", id:"mode", options:modeOptions, isRequired:true},
            {label:"Rating", id:"rating", type:"number", options: ['',1,2,3,4,5]},
            {label:"Remarks", id:"remarks"},
        ],
        checkboxes: []
    }
}

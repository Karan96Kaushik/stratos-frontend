const modeOptions = [
    "", "Shantanu HDFC", "RERA Easy", "Osha Technologies", "Bad Debt", "Other (please specify)", "TDS", "SDC Legal Services", "RERA Easy Services"
]

export default {
    all: {
        texts: [
            {label:"Payment Date", id:"paymentDate", type:"date"},
            {label:"Invoice ID", id:"invoiceID"},
            {label:"Received Amount", id:"receivedAmount", type:"number", isRequired:true},
            {label:"Mode", id:"mode", options:modeOptions, isRequired:true},
            {label:"Remarks", id:"remarks"},
        ],
        checkboxes: []
    }
}

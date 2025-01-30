const services = [
    // 'Consultation',
    'Site Updation',
    // 'Proof Reading',
    // 'Legal Documents',
    'Form 1',
    'Form 2',
    'Form 2A',
    'Form 3',
    // 'Form 5',
    'Format D',
    'Disclosure of Sold',
    'Cersai Undertaking', 
]

const yearlyServices = [
    'Form 5'
]

const otherServices = [
    'Consultation',
    'Proof Reading',
    'Legal Documents',
    'Other Services',
    'Relationship Manager',
]

export default {
    all: {
        texts: [
            {label:'Yearly Amount', id:"amount", type: 'number', isRequired: true},
            {label:'Government Fees', id:"govtFees", type: 'number', isRequired: false},
            // {label:'GST Amount', id:"gstamount", type: 'number', required: false},
            {label:'Start Date', id:"startDate", type: 'date', isRequired: true},
            {label:'End Date', id:"endDate", type: 'date'},
            {label:'Description', id:"description", isRequired: true},
            {label:'Contact Person', id:"contactPerson"},
            {label:'Edit Fees Applicable', id:"editFeesApplicable", options: ['', 'Yes', 'No'], isRequired: true},
            {label:'Contact No', id:"contactNum"},
            {label:'Owner Name', id:"owner"},
            {label:'Owner Contact No', id:"ownerContact"},
            {label:'RERA Number', id:"reraNumber"},
            {label:'Payment Cycle', id:"paymentCycle", options: ['', 'Yearly', 'Half Yearly', 'Quarterly', 'Monthly', 'Lumpsum'], isRequired: true},
            {label:"Payment Date", id:"paymentDate", type:"date"},
            {label:"FollowUp Date", id:"followupDate", type:"date"},
            // {label:'Due Amount', id:"due", type: 'number'},
            // {label:'Received Amount', id:"receivedAmount", type: 'number', isRequired: true},
            // {label:'Other Services', id:"other"},
            {label:'Period Cycle', id:"periodCycle"},
            {label:"Payment Rating", id:"rating", type:"number", options: ['',1,2,3,4,4.5,5]},
            {label:'Notes', id:"notes"},
            {label:'Remarks', id:"remarks"},
            {label:'Form 4 Accepted', id:"form4Accepted", options: ['', 'Yes', 'No']},
        ],
        checkboxes: [
            {label:'Add GST', id:"gstEnabled", type: 'number', isRequired: false},
            {label:"Archived", id:"archived"},
            // {label:'Relationship Manager', id:"relationshipManager"},
            // {label:'Consultation', id:"Consultation"},
            // {label:'Site Updation', id:"siteUpdation", options: ['N','Y']},
            // {label:'Proof Reading', id:"Proof Reading"},
            // {label:'Legal Documents', id:"Legal Documents"},
            // {label:'Other Services', id:'Other Services'},
            // {label:'Form 1', id:"form1", options: ['N','Y']},
            // {label:'Form 2', id:"form2", options: ['N','Y']},
            // {label:'Form 2A', id:"form2a", options: ['N','Y']},
            // {label:'Form 3', id:"form3", options: ['N','Y']},
            // {label:'Form 5', id:"form5", options: ['N','Y']},
            // {label:'Format D', id:"formatD", options: ['N','Y']},
            // {label:'Disclosure of Sold', id:"disclosure", options: ['N','Y']},
        ]
    }
}
export {services, yearlyServices, otherServices}
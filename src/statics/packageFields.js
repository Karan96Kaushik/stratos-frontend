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

export default {
    all: {
        texts: [
            {label:'Yearly Amount', id:"amount", type: 'number', required: true},
            {label:'GST Amount', id:"gstamount", type: 'number', required: false},
            {label:'Start Date', id:"startDate", type: 'date', required: true},
            {label:'Description', id:"description", required: true},
            {label:'Payment Cycle', id:"paymentCycle", options: ['', 'Yearly', 'Half Yearly', 'Quarterly'], required: true},
            // {label:'Due Amount', id:"due", type: 'number'},
            // {label:'Received Amount', id:"receivedAmount", type: 'number', required: true},
            // {label:'Other Services', id:"other"},
            {label:'Notes', id:"notes"},
            {label:'Remarks', id:"remarks"},
        ],
        checkboxes: [
            {label:'Relationship Manager', id:"relationshipManager"},
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
export {services, yearlyServices}
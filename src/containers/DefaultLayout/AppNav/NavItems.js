// import InspectionIcon from '../../../assets/img/inspection_icon.png';
export const MainNav = [
    {
        icon: 'pe-7s-albums',
        label: 'Inspection',
        content: [
            {
                label: 'New inspection',
                to: '#/dashboards/analytics',
            },
            {
                label: 'List inspections',
                to: '#/dashboards/commerce',
            },
            {
                label: 'Review inspection',
                to: '#/dashboards/sales',
            }
        ],
    },
    {
        icon: 'pe-7s-albums',
        label: 'Invoices',
        content: [
            {
                label: 'Review invoices',
                to: '#/dashboards/analytics',
            },
            {
                label: 'Book invoice',
                to: '#/dashboards/commerce',
            }
        ],
    },
    {
        icon: 'pe-7s-map-marker',
        label: 'Locations',
        content: [
            {
                label: 'New location',
                to: '#/pages/login',
            },
            {
                label: 'List locations',
                to: '#/pages/login-boxed',
            },
            {
                label: 'Organize templates',
                to: '#/pages/register',
            }
        ],
    },
    {
        icon: 'pe-7s-albums',
        label: 'Cost centers',
        content: [
            {
                label: 'Manage cost centers',
                to: '#/dashboards/analytics',
            }
        ],
    },
    {
        icon: 'pe-7s-users',
        label: 'Contacts',
        content: [
            {
                label: 'New contact',
                to: '#/apps/mailbox',
            },
            {
                label: 'List groupings',
                to: '#/apps/chat',
            },
            {
                label: 'List people',
                to: '#/apps/split-layout',
            }
        ],
    },
    {
        icon: 'pe-7s-users',
        label: 'Employees',
        content: [
            {
                label: 'Manage accounts',
                to: '#/apps/mailbox',
            }
        ],
    }
];
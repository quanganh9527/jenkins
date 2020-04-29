// list of roles
// "roles": [
//   {
//       "_id": "5dbf91f7e8cfed4768e85b15",
//       "name": "Administrator",
//       "description": "These users have all access in the project.",
//       "type": "root",
//       "__v": 0,
//       "id": "5dbf91f7e8cfed4768e85b15"
//   },
//   {
//       "_id": "5dc509791c915804c45bc042",
//       "name": "Contact information manager",
//       "description": "",
//       "type": "contact_information_manager",
//       "__v": 0,
//       "id": "5dc509791c915804c45bc042"
//   },
//   {
//       "_id": "5dc509631c915804c45bbecb",
//       "name": "Cost center manager",
//       "description": "",
//       "type": "cost_center_manager",
//       "__v": 0,
//       "id": "5dc509631c915804c45bbecb"
//   },
//   {
//       "_id": "5dc5094f1c915804c45bbd55",
//       "name": "Custom invoice creator",
//       "description": "",
//       "type": "custom_invoice_creator",
//       "__v": 0,
//       "id": "5dc5094f1c915804c45bbd55"
//   },
//   {
//       "_id": "5dc509811c915804c45bc0fd",
//       "name": "Employee account manager",
//       "description": "",
//       "type": "employee_account_manager",
//       "__v": 0,
//       "id": "5dc509811c915804c45bc0fd"
//   },
//   {
//       "_id": "5dc5090f1c915804c45bbbdc",
//       "name": "Inspection planner",
//       "description": "",
//       "type": "inspection_planner",
//       "__v": 0,
//       "id": "5dc5090f1c915804c45bbbdc"
//   },
//   {
//       "_id": "5dc509201c915804c45bbc97",
//       "name": "Inspection reviewer",
//       "description": "",
//       "type": "inspection_reviewer",
//       "__v": 0,
//       "id": "5dc509201c915804c45bbc97"
//   },
//   {
//       "_id": "5dc5098b1c915804c45bc1b8",
//       "name": "Inspection reviewer (all inspections)",
//       "description": "",
//       "type": "inspection_reviewer_all_inspections",
//       "__v": 0,
//       "id": "5dc5098b1c915804c45bc1b8"
//   },
//   {
//       "_id": "5dc509731c915804c45bbf87",
//       "name": "Inspection template manager",
//       "description": "",
//       "type": "inspection_template_manager",
//       "__v": 0,
//       "id": "5dc509731c915804c45bbf87"
//   },
//   {
//       "_id": "5dc5095a1c915804c45bbe10",
//       "name": "Invoice booker",
//       "description": "",
//       "type": "invoice_booker",
//       "__v": 0,
//       "id": "5dc5095a1c915804c45bbe10"
//   },
//   {
//       "_id": "5dc509691c915804c45bbf86",
//       "name": "Location information manager",
//       "description": "",
//       "type": "location_information_manager",
//       "__v": 0,
//       "id": "5dc509691c915804c45bbf86"
//   }
// ]
export const MainNav = [
  {
    icon: "nav-menu-icon nav-icon-inspections",
    label: `Inspections`,
    role: "",
    content: [
      {
        label: "New inspection",
        to: "#/inspections/new",
        role: "inspection_planner",
      },
      {
        label: "List inspections",
        to: "#/inspections",
        role: "inspection_reviewer_all_inspections",
      },
      {
        label: "Inspection templates",
        to: "#/inspections/inspection-templates",
        role: "inspection_template_manager",
      },
    ],
  },
  {
    icon: "nav-menu-icon nav-icon-invoices",
    label: "Invoices",
    role: "",
    content: [
      {
        label: "Review invoices",
        to: "#/invoices",
        role: "custom_invoice_creator",
      },
      // {
      //   label: "Book invoice",
      //   to: "#/invoices/book",
      //   role: "invoice_booker",
      // },
      {
        label: "Custom cost lines",
        to: "#/invoices/custom-cost-lines",
        role: "inspection_planner",
      },
      {
        label: "Manage cost centers",
        to: "#/invoices/cost-centers",
        role: "cost_center_manager",
      },
      {
        label: "Manage cost types",
        to: "#/invoices/cost-types",
        role: "cost_center_manager",
      },
    ],
  },
  {
    icon: "nav-menu-icon nav-icon-locations",
    label: "Locations",
    role: "",
    content: [
      {
        label: "New location",
        to: "#/locations/new",
        role: "location_information_manager",
      },
      {
        label: "List locations",
        to: "#/locations",
        role: "location_information_manager",
      },
    ],
  },
  {
    icon: "nav-menu-icon nav-icon-contacts",
    label: "Contacts",
    role: "",
    content: [
      // {
      //   label: "New contact",
      //   to: "#/contacts/new",
      //   role: 'contact_information_manager'
      // },
      {
        label: "List groupings",
        to: "#/contacts/group",
        role: "contact_information_manager",
      },
      {
        label: "List people",
        to: "#/contacts/people",
        role: "contact_information_manager",
      },
      {
        label: "Debtor contact settings",
        to: "#/contacts/debtor-settings",
      },
    ],
  },
  {
    icon: "pe-7s-users",
    label: "Employees",
    role: "",
    content: [
      {
        label: "Manage accounts",
        to: "#/employees",
        role: "employee_account_manager",
      },
    ],
  },
];

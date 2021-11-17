// local
export const BASE_URL = "http://localhost:9000/";

// dev
// export const BASE_URL = "http://api.verd.com.au/";
//export const BASE_URL = "/api";
export const EXPENSE_TYPES = [
  "Advertising & Marketing",
  "Ask My Accountant",
  "Bank Charges & Fees",
  "Car & Truck",
  "Contractors",
  "Insurance",
  "Interest Paid",
  "Job Supplies",
  "Legal & Professional Services",
  "Meals & Entertainment",
  "Office Supplies & Software",
  "Other Business Expenses",
  "Reimbursable Expenses",
  "Rent & Lease",
  "Repairs & Maintenance",
  "Taxes & Licenses",
  "Travel",
  "Uncategorized Expense",
  "Utilities",
];
export const TASk_ACCOUNT_TYPES = [
  "Airfare & Related Costs",
  "Gas",
  "Lodging",
  "Meals & Entertainment",
  "Mileage",
  "Parking",
  "Phone/Fax",
  "Transportation",
];
export const EXPENSE_ACCOUNT_TYPES = [
  "Accounts Payable",
  "Accounts Receivable",
  "Bank",
  "Cost Of Goods Sold",
  "Equity",
  "Expense",
  "Fixed Assets",
  "Income",
  "Loan",
  "Long Term Liability",
  "Non-Posting",
  "Other Asset",
  "Other Current Asset",
  "Other Current Liability",
  "Other Expense",
  "Other Income",
];

export const AWS_URL = "https://s3.amazonaws.com/verd-dev/";

export const EXPENSE_STATUS = [
  { value: "on-hold", label: "With Employee" },
  { value: "employer", label: "With Approver" },
  { value: "submitted", label: "Pending Download" },
  { value: "archived", label: "Archive" },
];

export const TIMESHEET_STATUS = [
  { value: "WithEmployee", label: "With Employee" },
  { value: "WithApprover", label: "With Approver" },
  { value: "Approved", label: "Pending Download" },
  { value: "Archived", label: "Archive" },
];

export const USER_TABLE_COLUMNS = [
  "NAME",
  "EMAIL",
  "PHONE",
  "ACTIVE",
  "USER ROLE",
];

const APPROVAL_STATUS = {
  WITH_EMPLOYEE: "WithEmployee",
  WITH_APPROVER: "WithApprover",
  APPROVED: "Approved",
  ARCHIVED: "Archived",
  PENDING_APPROVAL: "PendingArroval",
  REJECTED: "Rejected",
};

export const TIMESHEET_APPROVAL_STATUS = [
  { value: "pendingApproval", label: "Pending Approval" },
  { value: "Approved", label: "Approved" },
];

Object.freeze(APPROVAL_STATUS);

export { APPROVAL_STATUS };

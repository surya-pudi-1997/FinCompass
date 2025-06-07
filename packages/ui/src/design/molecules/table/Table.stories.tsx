import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Box,
  Chip,
  Avatar,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import {
  Edit,
  Trash2,
  Eye,
  Star,
  User,
  Building,
  Download,
  Plus,
} from "lucide-react";
import { Table } from "./Table";
import {
  TableProps,
  TableColumn,
  TableRow,
  TableSort,
  TableFilter,
} from "./table.types";

const meta: Meta<typeof Table> = {
  title: "Design System/Molecules/Table",
  component: Table,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A comprehensive table component built on top of MUI Table with advanced features like sorting, filtering, pagination, selection, row actions, and expansion.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Show loading state with skeleton rows",
    },
    dense: {
      control: "boolean",
      description: "Use dense padding for compact display",
    },
    striped: {
      control: "boolean",
      description: "Alternate row background colors",
    },
    hover: {
      control: "boolean",
      description: "Enable hover effects on rows",
    },
    bordered: {
      control: "boolean",
      description: "Add borders between columns",
    },
    stickyHeader: {
      control: "boolean",
      description: "Make header sticky during scroll",
    },
    maxHeight: {
      control: "text",
      description: "Maximum height of the table container",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  avatar?: string;
  department: string;
  salary: number;
  projects: number;
  lastLogin: string;
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Frontend Developer",
    status: "active",
    joinDate: "2023-01-15",
    department: "Engineering",
    salary: 75000,
    projects: 8,
    lastLogin: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Product Manager",
    status: "active",
    joinDate: "2022-08-20",
    department: "Product",
    salary: 95000,
    projects: 12,
    lastLogin: "2024-01-14T16:45:00Z",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Backend Developer",
    status: "pending",
    joinDate: "2023-11-01",
    department: "Engineering",
    salary: 80000,
    projects: 3,
    lastLogin: "2024-01-10T09:15:00Z",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice.brown@example.com",
    role: "UX Designer",
    status: "active",
    joinDate: "2023-03-10",
    department: "Design",
    salary: 70000,
    projects: 6,
    lastLogin: "2024-01-15T14:20:00Z",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    role: "DevOps Engineer",
    status: "inactive",
    joinDate: "2022-12-05",
    department: "Engineering",
    salary: 85000,
    projects: 4,
    lastLogin: "2024-01-05T11:00:00Z",
  },
];

const userColumns: TableColumn<User>[] = [
  {
    id: "avatar",
    label: "",
    accessor: "name",
    sortable: false,
    width: 60,
    format: (value, row) => (
      <Avatar sx={{ width: 32, height: 32 }}>{row.name.charAt(0)}</Avatar>
    ),
  },
  {
    id: "name",
    label: "Name",
    accessor: "name",
    sortable: true,
    minWidth: 150,
    format: (value, row) => (
      <Box>
        <Typography variant="body2" fontWeight="medium">
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.email}
        </Typography>
      </Box>
    ),
  },
  {
    id: "role",
    label: "Role",
    accessor: "role",
    sortable: true,
    minWidth: 120,
  },
  {
    id: "department",
    label: "Department",
    accessor: "department",
    sortable: true,
    format: (value) => (
      <Chip
        label={value}
        size="small"
        icon={
          value === "Engineering" ? <Building size={14} /> : <User size={14} />
        }
        variant="outlined"
      />
    ),
  },
  {
    id: "status",
    label: "Status",
    accessor: "status",
    sortable: true,
    format: (value) => (
      <Chip
        label={value}
        size="small"
        color={
          value === "active"
            ? "success"
            : value === "pending"
              ? "warning"
              : "error"
        }
        variant="filled"
      />
    ),
  },
  {
    id: "salary",
    label: "Salary",
    accessor: "salary",
    sortable: true,
    align: "right",
    format: (value) => `$${value.toLocaleString()}`,
  },
  {
    id: "projects",
    label: "Projects",
    accessor: "projects",
    sortable: true,
    align: "center",
  },
  {
    id: "joinDate",
    label: "Join Date",
    accessor: "joinDate",
    sortable: true,
    format: (value) => new Date(value).toLocaleDateString(),
  },
];

const createTableRows = (users: User[]): TableRow<User>[] =>
  users.map((user) => ({
    id: user.id,
    data: user,
    expandedContent: (
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Additional Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last Login: {new Date(user.lastLogin).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Employee ID: EMP-{user.id.toString().padStart(4, "0")}
        </Typography>{" "}
        <Box mt={2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Edit size={16} />}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>
    ),
  }));

// Interactive wrapper component for stateful stories
const InteractiveTable = (props: Partial<TableProps<User>>) => {
  const [sort, setSort] = useState<TableSort>({
    column: "name",
    direction: "asc",
  });
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [expandedRows, setExpandedRows] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const tableRows = createTableRows(sampleUsers);

  return (
    <Table
      columns={userColumns}
      rows={tableRows}
      sort={sort}
      onSortChange={setSort}
      selection={{
        type: "multiple",
        selectedRows,
        onSelectionChange: setSelectedRows,
      }}
      searchable
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      expandable
      expandedRows={expandedRows}
      onExpandedRowsChange={setExpandedRows}
      pagination={{
        page,
        rowsPerPage,
        totalRows: sampleUsers.length,
        rowsPerPageOptions: [5, 10, 25],
      }}
      onPageChange={setPage}
      onRowsPerPageChange={(newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0);
      }}
      actions={[
        {
          id: "download",
          label: "Download",
          icon: <Download size={16} />,
          onClick: () => console.log("Download action"),
        },
        {
          id: "add",
          label: "Add User",
          icon: <Plus size={16} />,
          onClick: () => console.log("Add user action"),
          variant: "contained",
          color: "primary",
        },
        {
          id: "delete",
          label: "Delete Selected",
          icon: <Trash2 size={16} />,
          onClick: (selectedIds, selectedData) => {
            console.log("Delete selected:", selectedIds, selectedData);
          },
          color: "error",
          requiresSelection: true,
          confirmMessage: "Are you sure you want to delete the selected users?",
        },
      ]}
      rowActions={[
        {
          id: "view",
          label: "View",
          icon: <Eye size={16} />,
          onClick: (ids, data) => console.log("View:", data[0]),
        },
        {
          id: "edit",
          label: "Edit",
          icon: <Edit size={16} />,
          onClick: (ids, data) => console.log("Edit:", data[0]),
        },
        {
          id: "delete",
          label: "Delete",
          icon: <Trash2 size={16} />,
          onClick: (ids, data) => console.log("Delete:", data[0]),
          color: "error",
          confirmMessage: "Are you sure you want to delete this user?",
        },
      ]}
      onRowClick={(row) => console.log("Row clicked:", row)}
      hover
      {...props}
    />
  );
};

// Basic Story
export const Basic: Story = {
  render: () => (
    <Table
      columns={userColumns.slice(1, 5)} // Simplified columns
      rows={createTableRows(sampleUsers.slice(0, 3))}
    />
  ),
};

// With All Features
export const WithAllFeatures: Story = {
  render: () => <InteractiveTable />,
};

// Loading State
export const Loading: Story = {
  render: () => (
    <Table columns={userColumns} rows={[]} loading loadingRows={8} />
  ),
};

// Empty State
export const EmptyState: Story = {
  render: () => (
    <Table
      columns={userColumns}
      rows={[]}
      emptyStateText="No users found"
      emptyStateIcon={<User size={48} color="gray" />}
      emptyStateAction={
        <Button variant="contained" startIcon={<Plus size={16} />}>
          Add First User
        </Button>
      }
    />
  ),
};

// Dense and Striped
export const DenseAndStriped: Story = {
  render: () => <InteractiveTable dense striped bordered />,
};

// Sticky Header with Max Height
export const StickyHeader: Story = {
  render: () => <InteractiveTable stickyHeader maxHeight={400} />,
};

// Selection Only
export const WithSelection: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

    return (
      <Table
        columns={userColumns.slice(1, 6)}
        rows={createTableRows(sampleUsers)}
        selection={{
          type: "multiple",
          selectedRows,
          onSelectionChange: setSelectedRows,
        }}
        actions={[
          {
            id: "bulk-edit",
            label: "Bulk Edit",
            icon: <Edit size={16} />,
            onClick: (ids, data) => console.log("Bulk edit:", data),
            requiresSelection: true,
          },
        ]}
      />
    );
  },
};

// Custom Cell Formatting
export const CustomFormatting: Story = {
  render: () => {
    const customColumns: TableColumn<User>[] = [
      {
        id: "name",
        label: "Employee",
        accessor: "name",
        format: (value, row) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 24, height: 24 }}>{value.charAt(0)}</Avatar>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {row.id}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        id: "performance",
        label: "Performance",
        accessor: "projects",
        format: (value) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={14}
                fill={index < Math.floor(value / 3) ? "#fbbf24" : "none"}
                color={index < Math.floor(value / 3) ? "#fbbf24" : "#d1d5db"}
              />
            ))}
            <Typography variant="caption" color="text.secondary" ml={1}>
              ({value} projects)
            </Typography>
          </Box>
        ),
      },
      {
        id: "salary",
        label: "Compensation",
        accessor: "salary",
        format: (value) => (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              ${value.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Annual
            </Typography>
          </Box>
        ),
      },
    ];

    return (
      <Table
        columns={customColumns}
        rows={createTableRows(sampleUsers)}
        hover
      />
    );
  },
};

// Expandable Rows
export const ExpandableRows: Story = {
  render: () => {
    const [expandedRows, setExpandedRows] = useState<(string | number)[]>([1]);

    return (
      <Table
        columns={userColumns.slice(1, 6)}
        rows={createTableRows(sampleUsers)}
        expandable
        expandedRows={expandedRows}
        onExpandedRowsChange={setExpandedRows}
      />
    );
  },
};

// Row Actions
export const WithRowActions: Story = {
  render: () => (
    <Table
      columns={userColumns.slice(1, 5)}
      rows={createTableRows(sampleUsers)}
      rowActions={[
        {
          id: "view",
          label: "View Details",
          icon: <Eye size={16} />,
          onClick: (ids, data) => console.log("View:", data[0]),
        },
        {
          id: "edit",
          label: "Edit User",
          icon: <Edit size={16} />,
          onClick: (ids, data) => console.log("Edit:", data[0]),
          color: "primary",
        },
        {
          id: "delete",
          label: "Delete User",
          icon: <Trash2 size={16} />,
          onClick: (ids, data) => console.log("Delete:", data[0]),
          color: "error",
          confirmMessage: "Are you sure you want to delete this user?",
        },
      ]}
      onRowClick={(row) => console.log("Row clicked:", row.data)}
    />
  ),
};

// Searchable and Filterable
export const SearchableAndFilterable: Story = {
  render: () => <InteractiveTable searchable filterable />,
};

// Minimal Configuration
export const Minimal: Story = {
  render: () => {
    const minimalColumns: TableColumn<User>[] = [
      {
        id: "name",
        label: "Name",
        accessor: "name",
      },
      {
        id: "email",
        label: "Email",
        accessor: "email",
      },
      {
        id: "role",
        label: "Role",
        accessor: "role",
      },
    ];

    return (
      <Table
        columns={minimalColumns}
        rows={createTableRows(sampleUsers.slice(0, 5))}
      />
    );
  },
};

# Table Component

A comprehensive table component built on top of MUI Table with advanced features like sorting, filtering, pagination, selection, row actions, and expansion.

## Features

- ✅ **Sorting**: Click column headers to sort data
- ✅ **Filtering**: Filter data by column values
- ✅ **Search**: Global search across all columns
- ✅ **Pagination**: Navigate through large datasets
- ✅ **Selection**: Single or multiple row selection
- ✅ **Row Actions**: Custom actions for individual rows
- ✅ **Bulk Actions**: Actions for selected rows
- ✅ **Expandable Rows**: Show additional content in expanded rows
- ✅ **Loading States**: Skeleton loading and custom loading states
- ✅ **Empty States**: Customizable empty state with actions
- ✅ **Export**: Built-in CSV/JSON export functionality
- ✅ **Responsive**: Works on mobile and desktop
- ✅ **Accessible**: Full keyboard navigation and screen reader support
- ✅ **Customizable**: Extensive styling and theming options

## Basic Usage

```tsx
import { Table } from "@fin-compass/ui";
import type { TableColumn, TableRow } from "@fin-compass/ui";

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: TableColumn<User>[] = [
  {
    id: "name",
    label: "Name",
    accessor: "name",
    sortable: true,
  },
  {
    id: "email",
    label: "Email",
    accessor: "email",
    sortable: true,
  },
];

const rows: TableRow<User>[] = [
  {
    id: 1,
    data: { id: 1, name: "John Doe", email: "john@example.com" },
  },
  {
    id: 2,
    data: { id: 2, name: "Jane Smith", email: "jane@example.com" },
  },
];

function MyTable() {
  return <Table columns={columns} rows={rows} />;
}
```

## Advanced Usage

### With Sorting and Pagination

```tsx
function AdvancedTable() {
  const [sort, setSort] = useState({ column: "name", direction: "asc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <Table
      columns={columns}
      rows={rows}
      sort={sort}
      onSortChange={setSort}
      pagination={{
        page,
        rowsPerPage,
        totalRows: 100,
      }}
      onPageChange={setPage}
      onRowsPerPageChange={setRowsPerPage}
    />
  );
}
```

### With Selection and Actions

```tsx
function SelectableTable() {
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <Table
      columns={columns}
      rows={rows}
      selection={{
        type: "multiple",
        selectedRows,
        onSelectionChange: setSelectedRows,
      }}
      actions={[
        {
          id: "delete",
          label: "Delete Selected",
          icon: <Trash2 size={16} />,
          onClick: (ids, data) => console.log("Delete:", data),
          color: "error",
          requiresSelection: true,
        },
      ]}
      rowActions={[
        {
          id: "edit",
          label: "Edit",
          icon: <Edit size={16} />,
          onClick: (ids, data) => console.log("Edit:", data[0]),
        },
      ]}
    />
  );
}
```

### Custom Cell Formatting

```tsx
const columns: TableColumn<User>[] = [
  {
    id: "avatar",
    label: "",
    accessor: "name",
    format: (value, row) => <Avatar>{value.charAt(0)}</Avatar>,
  },
  {
    id: "status",
    label: "Status",
    accessor: "status",
    format: (value) => (
      <Chip label={value} color={value === "active" ? "success" : "error"} />
    ),
  },
];
```

## Props

### TableProps

| Prop           | Type               | Default | Description              |
| -------------- | ------------------ | ------- | ------------------------ |
| `columns`      | `TableColumn[]`    | -       | Column definitions       |
| `rows`         | `TableRow[]`       | -       | Row data                 |
| `loading`      | `boolean`          | `false` | Show loading state       |
| `dense`        | `boolean`          | `false` | Use dense padding        |
| `striped`      | `boolean`          | `false` | Alternate row colors     |
| `hover`        | `boolean`          | `true`  | Enable hover effects     |
| `stickyHeader` | `boolean`          | `false` | Make header sticky       |
| `maxHeight`    | `string \| number` | -       | Maximum container height |

### TableColumn

| Prop       | Type                            | Description              |
| ---------- | ------------------------------- | ------------------------ |
| `id`       | `string`                        | Unique column identifier |
| `label`    | `ReactNode`                     | Column header label      |
| `accessor` | `keyof T \| function`           | Data accessor            |
| `sortable` | `boolean`                       | Enable sorting           |
| `format`   | `function`                      | Custom cell formatter    |
| `width`    | `string \| number`              | Column width             |
| `align`    | `'left' \| 'center' \| 'right'` | Text alignment           |

### TableRow

| Prop              | Type               | Description                   |
| ----------------- | ------------------ | ----------------------------- |
| `id`              | `string \| number` | Unique row identifier         |
| `data`            | `T`                | Row data object               |
| `selectable`      | `boolean`          | Allow selection               |
| `expandable`      | `boolean`          | Allow expansion               |
| `expandedContent` | `ReactNode`        | Content to show when expanded |

## Storybook

View all examples and interact with the component in Storybook:

- **Basic**: Simple table with minimal configuration
- **With All Features**: Complete example with all features enabled
- **Loading State**: Shows skeleton loading
- **Empty State**: Custom empty state with actions
- **Selection**: Row selection examples
- **Custom Formatting**: Advanced cell formatting
- **Expandable Rows**: Rows with expandable content

## Accessibility

The table component includes:

- Full keyboard navigation support
- Screen reader compatibility
- ARIA labels and descriptions
- Focus management
- High contrast support

## Performance

For large datasets, consider:

- Using pagination to limit rendered rows
- Implementing server-side sorting and filtering
- Using the `virtualized` prop for very large datasets
- Memoizing cell formatters and event handlers

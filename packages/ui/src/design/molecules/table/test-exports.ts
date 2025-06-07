// Simple test to verify Table component exports
import { Table } from "./Table";
import type {
  TableProps,
  TableColumn,
  TableRow,
  TableRef,
} from "./table.types";

// This file helps verify our exports work correctly
export { Table };
export type { TableProps, TableColumn, TableRow, TableRef };

console.log("Table component exports are working correctly");

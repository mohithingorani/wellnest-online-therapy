import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, keyExtractor, onRowClick, emptyMessage = "No data available" }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400 font-nunito">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1f1f1f]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-nunito"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1f1f1f]">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? "cursor-pointer hover:bg-[#1a1a1a] transition-colors" : ""}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3.5 text-sm text-gray-300 font-nunito">
                  {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React, { useMemo, useState } from "react";
import {
	SortDirection,
	SortKey,
	type SortableThProps,
	type DataTableProps,
} from "./DataTableTypes";
import "./DataTable.css";

const formatWeight = (value: number): string => {
	return value.toFixed(4);
};

// Render the table head component (sorting included)
const SortableTh: React.FC<SortableThProps> = ({
	label,
	active,
	direction,
	onClick,
}) => {
	return (
		<th onClick={onClick} className="table-head">
			{label}{" "}
			{active ? (direction === SortDirection.Asc ? "↑" : "↓") : ""}
		</th>
	);
};

const DataTable: React.FC<DataTableProps> = ({ tableData }) => {
	const [sortKey, setSortKey] = useState<SortKey>(
		SortKey.Constituent
	);
	const [sortDirection, setSortDirection] =
		useState<SortDirection>(SortDirection.Asc);

	const sortedRows = useMemo(() => {
		const copied = [...tableData];

		// sort the table rows based on the sorting key state and direction state
		copied.sort((a, b) => {
			let result = 0;

			if (sortKey === SortKey.Constituent) {
				result = a.name.localeCompare(b.name);
			} else if (sortKey === SortKey.Weight) {
				result = a.weight - b.weight;
			} else {
				result = a.latestClosePrice - b.latestClosePrice;
			}

			return sortDirection === SortDirection.Asc
				? result
				: -result;
		});

		return copied;
	}, [tableData, sortKey, sortDirection]);

	// Update sort state accordingly when user clicks the column header
	const handleSort = (nextKey: SortKey) => {
		if (sortKey === nextKey) {
			setSortDirection((prev: SortDirection) =>
				prev === SortDirection.Asc
					? SortDirection.Desc
					: SortDirection.Asc
			);
			return;
		}

		setSortKey(nextKey);
		setSortDirection(
			nextKey === SortKey.Constituent
				? SortDirection.Asc
				: SortDirection.Desc
		);
	};

	// When no ETF file uploaded
	if (sortedRows.length === 0) {
		return (
			<div className="table-empty">
				No data yet. Upload a CSV file to begin.
			</div>
		);
	}

	return (
		<div className="table-container">
			<div className="table-header">
				<h2>Holdings Table</h2>
			</div>

			<div className="table-wrapper">
				<table className="table">
					<thead>
						<tr>
							{/* Sortable columns */}
							<SortableTh
								label="Constituent"
								active={sortKey === SortKey.Constituent}
								direction={sortDirection}
								onClick={() =>
									handleSort(SortKey.Constituent)
								}
							/>
							<SortableTh
								label="Weight"
								active={sortKey === SortKey.Weight}
								direction={sortDirection}
								onClick={() => handleSort(SortKey.Weight)}
							/>
							<SortableTh
								label="Most Recent Close Price"
								active={sortKey === SortKey.LatestClose}
								direction={sortDirection}
								onClick={() =>
									handleSort(SortKey.LatestClose)
								}
							/>
						</tr>
					</thead>

					<tbody>
						{/* Data rows */}
						{sortedRows.map((row, index) => (
							<tr key={`${row.name}-${index}`}>
								<td className="table-cell">{row.name}</td>
								<td className="table-cell">
									{formatWeight(row.weight)}
								</td>
								<td className="table-cell">
									{row.latestClosePrice}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default DataTable;
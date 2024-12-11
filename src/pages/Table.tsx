import React, { useState, useEffect } from "react";
import "../css/table.css";
import { ITable } from "../model/table";
import { getTable,createTable,updateTable,deleteTable } from "../service/TableR";

const Table = () => {
  const [tables, setTables] = useState<ITable[]>([]);
  const [editTable, setEditTable] = useState<{ id: number; field: keyof ITable } | null>(null);
  const [inputValues, setInputValues] = useState<{ [key: number]: { [field: string]: string } }>({});

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const data = await getTable();
        if (Array.isArray(data)) {
          setTables(data);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch table data:", error);
      }
    };

    fetchTables();
  }, []);

  const handleAddNew = async () => {
    const newTable: ITable = {
      id: 0,
      tableNumber: tables.length + 1,
      countChairs: 4,
      status: "Available",
    };
  
    try {
      const createdTable = await createTable(newTable);
      setTables([createdTable, ...tables]);
    } catch (error) {
      console.error("Failed to add new table:", error);
    }
  };
  

  const handleEdit = (id: number, field: keyof ITable) => {
    setEditTable({ id, field });
  };

  const handleInputChange = (id: number, field: keyof ITable, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id: number, field: keyof ITable) => {
    // Get the updated value from input or fallback to current table data
    const updatedValue = inputValues[id]?.[field] ?? tables.find((item) => item.id === id)?.[field];
  
    if (updatedValue === undefined) {
      console.warn(`Field ${field} is undefined for table ID ${id}`);
      return;
    }
  
    const updatedTables = tables.map((item) =>
      item.id === id ? { ...item, [field]: field === "countChairs" ? +updatedValue : updatedValue } : item
    );
  
    setTables(updatedTables);
  
    const tableToUpdate = updatedTables.find((item) => item.id === id);
  
    if (tableToUpdate) {
      try {
        await updateTable(id, tableToUpdate);
        console.log(`Table with id ${id} successfully updated.`);
      } catch (error) {
        console.error("Failed to update table on server:", error);
        setTables(tables); // Rollback to previous state
      }
    }
  
    setEditTable(null);
    setInputValues((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        delete updated[id][field];
        if (Object.keys(updated[id]).length === 0) delete updated[id];
      }
      return updated;
    });
  };
  

  const handleDelete = async (id: number) => {
    try {
      await deleteTable(id);
      setTables(tables.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete table:", error);
    }
  };

  return (
    <div className="MyWorkspace">
      <div className="description">
        <h3>Welcome to Workspace</h3>
      </div>
  
      <div className="tiles-container">
        <div className="tile add-new-tile" onClick={handleAddNew}>
          <span className="plus-icon">+</span>
          <p>Add New Table</p>
        </div>
  
        {tables.map((item) => (
          <div key={item.id} className="tile">
            <h3>
              {editTable?.id === item.id && editTable.field === "tableNumber" ? (
                <input
                  type="number"
                  value={inputValues[item.id]?.tableNumber ?? (item.tableNumber || '')}
                  onChange={(e) => handleInputChange(item.id, "tableNumber", e.target.value)}
                  onBlur={() => handleSave(item.id, "tableNumber")}
                  autoFocus
                />
              ) : (
                <span onClick={() => handleEdit(item.id, "tableNumber")}>
                  Table #{item.tableNumber}
                </span>
              )}
            </h3>
            
            <p>
              {editTable?.id === item.id && editTable.field === "countChairs" ? (
                <input
                  type="number"
                  value={inputValues[item.id]?.countChairs ?? (item.countChairs || '')}
                  onChange={(e) => handleInputChange(item.id, "countChairs", e.target.value)}
                  onBlur={() => handleSave(item.id, "countChairs")}
                  autoFocus
                />
              ) : (
                <span onClick={() => handleEdit(item.id, "countChairs")}>
                  Count Chairs: {item.countChairs}
                </span>
              )}
            </p>

            <p>
              {editTable?.id === item.id && editTable.field === "status" ? (
                <select
                  value={inputValues[item.id]?.status ?? item.status}
                  onChange={(e) => handleInputChange(item.id, "status", e.target.value)}
                  onBlur={() => handleSave(item.id, "status")}
                  autoFocus
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                </select>
              ) : (
                <span onClick={() => handleEdit(item.id, "status")}>
                  Status: {item.status}
                </span>
              )}
            </p>
  
            <button className="delete-button" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Table;

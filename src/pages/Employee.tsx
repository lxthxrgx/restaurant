import React, { useState, useEffect } from "react";
import "../css/employee.css";
import { IEmployee } from "../model/employee";
import { getEmployee, createEmployee, updateEmployee, deleteEmployee } from "../service/EmployeeR"; // Ensure this is updated for employee API

const EmployeeTable = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [editEmployee, setEditEmployee] = useState<{ id: number; field: keyof IEmployee } | null>(null);
  const [inputValues, setInputValues] = useState<{ [key: number]: { [field: string]: string } }>({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployee();
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddNew = async () => {
    const newEmployee: IEmployee = {
      id: 0,
      name: "Name",
      surname: "Surname",
      position: "Position",
    };

    try {
      const createdEmployee = await createEmployee(newEmployee);
      setEmployees([createdEmployee, ...employees]);
    } catch (error) {
      console.error("Failed to add new employee:", error);
    }
  };

  const handleEdit = (id: number, field: keyof IEmployee) => {
    setEditEmployee({ id, field });
  };

  const handleInputChange = (id: number, field: keyof IEmployee, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id: number, field: keyof IEmployee) => {
    // Get the updated value from input or fallback to current employee data
    const updatedValue = inputValues[id]?.[field] ?? employees.find((item) => item.id === id)?.[field];

    if (updatedValue === undefined) {
      console.warn(`Field ${field} is undefined for employee ID ${id}`);
      return;
    }

    const updatedEmployees = employees.map((item) =>
      item.id === id ? { ...item, [field]: updatedValue } : item
    );

    setEmployees(updatedEmployees);

    const employeeToUpdate = updatedEmployees.find((item) => item.id === id);

    if (employeeToUpdate) {
      try {
        await updateEmployee(id, employeeToUpdate);
        console.log(`Employee with id ${id} successfully updated.`);
      } catch (error) {
        console.error("Failed to update employee on server:", error);
        setEmployees(employees);
      }
    }

    setEditEmployee(null);
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
      await deleteEmployee(id);
      setEmployees(employees.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  return (
    <div className="MyWorkspace">
      <div className="description">
        <h3>Welcome to Employee Management</h3>
      </div>

      <div className="tiles-container">
        <div className="tile add-new-tile" onClick={handleAddNew}>
          <span className="plus-icon">+</span>
          <p>Add New Employee</p>
        </div>

        {employees.map((item) => (
          <div key={item.id || `temp-${Math.random()}`} className="tile">
            <p>
            {editEmployee?.id === item.id && editEmployee?.field === "name" ? (
                <input
                  type="text"
                  value={inputValues[item.id]?.name ?? item.name}
                  onChange={(e) => handleInputChange(item.id, "name", e.target.value)}
                  onBlur={() => handleSave(item.id, "name")}
                  autoFocus
                />
              ) : (
                <span onClick={() => handleEdit(item.id, "name")}>
                  Name: {item.name}
                </span>
              )}
            </p>

            <p>
            {editEmployee && editEmployee.id === item.id && editEmployee.field === "surname" ? (
                <input
                    type="text"
                    value={inputValues[item.id]?.surname ?? item.surname}
                    onChange={(e) => handleInputChange(item.id, "surname", e.target.value)}
                    onBlur={() => handleSave(item.id, "surname")}
                    autoFocus
                />
                ) : (
                <span onClick={() => handleEdit(item.id, "surname")}>
                    Surname: {item.surname}
                </span>
                )}
            </p>

            <p>
            {editEmployee && editEmployee.id === item.id && editEmployee.field === "position" ? (
                <select
                    value={inputValues[item.id]?.position ?? item.position}
                    onChange={(e) => handleInputChange(item.id, "position", e.target.value)}
                    onBlur={() => handleSave(item.id, "position")}
                    autoFocus
                >
                    <option value="Chef">Chef</option>
                    <option value="Sous Chef">Sous Chef</option>
                    <option value="Waiter">Waiter</option>
                    <option value="Bartender">Bartender</option>
                    <option value="Host">Host</option>
                    <option value="Busser">Busser</option>
                    <option value="Dishwasher">Dishwasher</option>
                    <option value="Restaurant Manager">Restaurant Manager</option>
                    <option value="Line Cook">Line Cook</option>
                    <option value="Sommelier">Sommelier</option>
                    <option value="Barista">Barista</option>

                </select>
                ) : (
                <span onClick={() => handleEdit(item.id, "position")}>
                    Position: {item.position}
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

export default EmployeeTable;

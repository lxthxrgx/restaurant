import React, { useState, useEffect } from "react";
import "../css/menu.css";
import { IMenu } from "../model/menu";
import { getMenu, createMenu, deleteMenu, updateMenu } from "../service/MenuR";

const Menu = () => {
  const [menu, setMenu] = useState<IMenu[]>([]);
  const [editMenu, setEditMenu] = useState<{ id: number; field: string } | null>(null);
  const [inputValues, setInputValues] = useState<{ [key: number]: { [field: string]: string } }>({});
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        if (Array.isArray(data)) {
          setMenu(data);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
      }
    };

    fetchMenu();
  }, []);

    const handleAddNew = async () => {
      const newMenu: IMenu = {
        id: 0,
        dishName: "New Dish",
        description: "New description",
        price: 1,
      };
    
      try {
        const createdTable = await createMenu(newMenu);
        setMenu((prevMenu) => [createdTable, ...prevMenu]);
      } catch (error) {
        console.error("Failed to add new table:", error);
      }
    };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewImageFile(event.target.files[0]);
    }
  };

  const handleEdit = (id: number, field: string) => {
    setEditMenu({ id, field });
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id: number, field: keyof IMenu) => {
    const updatedValue =
      inputValues[id]?.[field]?.trim() ||
      menu.find((item) => item.id === id)?.[field] ||
      "";

    const updatedMenu = menu.map((item) =>
      item.id === id ? { ...item, [field]: updatedValue } : item
    );

    setMenu(updatedMenu);

    const menuToUpdate = updatedMenu.find((item) => item.id === id);

    if (menuToUpdate) {
      try {
        await updateMenu(id, menuToUpdate);
        console.log(`Menu with id ${id} successfully updated.`);
      } catch (error) {
        console.error("Failed to update dish on server:", error);
        setMenu(menu);
      }
    }

    setEditMenu(null);
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
      await deleteMenu(id);
      setMenu(menu.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete dish:", error);
    }
  };

  const handleImagePreview = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setMenu(
        menu.map((item) =>
          item.id === id ? { ...item, image: reader.result as string } : item
        )
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="MyWorkspace">
      <div className="description">
        <h3>Welcome to Workspace</h3>
      </div>

      <div className="tiles-container">
        <div className="tile add-new-tile" onClick={handleAddNew}>
          <span className="plus-icon">+</span>
          <p>Add New Dish</p>
        </div>

        {menu.map((item) => (
          <div key={item.id} className="tile">

            {editMenu?.id === item.id && editMenu.field === "dishName" ? (
              <input
                type="text"
                value={inputValues[item.id]?.dishName ?? item.dishName}
                onChange={(e) => handleInputChange(item.id, "dishName", e.target.value)}
                onBlur={() => handleSave(item.id, "dishName")}
                autoFocus
              />
            ) : (
              <h3 onClick={() => handleEdit(item.id, "dishName")}>
                {item.dishName || "Unnamed Dish"}
              </h3>
            )}

            {editMenu?.id === item.id && editMenu.field === "description" ? (
              <textarea
                value={inputValues[item.id]?.description ?? item.description}
                onChange={(e) => handleInputChange(item.id, "description", e.target.value)}
                onBlur={() => handleSave(item.id, "description")}
                autoFocus
              />
            ) : (
              <p onClick={() => handleEdit(item.id, "description")}>
                {item.description || "No description available."}
              </p>
            )}

            {editMenu?.id === item.id && editMenu.field === "price" ? (
              <input
                type="number"
                value={inputValues[item.id]?.price ?? item.price}
                onChange={(e) => handleInputChange(item.id, "price", e.target.value)}
                onBlur={() => handleSave(item.id, "price")}
                autoFocus
              />
            ) : (
              <p onClick={() => handleEdit(item.id, "price")}>
                {item.price ? `$${item.price}` : "Set a price"}
              </p>
            )}

            <button className="delete-button" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;

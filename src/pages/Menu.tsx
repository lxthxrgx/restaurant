import React, { useState } from 'react';
import "../css/menu.css";
import { IMenu } from '../model/menu';

const initialTaskList: IMenu[] = [
  {
    id: 1,
    dishName: "Dish 1",
    description: "Description of Dish 1",
    price: 100,
    image: "/ཐིཋྀ.jfif",
  },
  {
    id: 2,
    dishName: "Dish 2",
    description: "Description of Dish 2",
    price: 200,
    image: "/загружено.jfif",
  },
  {
    id: 3,
    dishName: "Dish 3",
    description: "Description of Dish 3",
    price: 200,
    image: "/3.jfif",
  }
];

function Menu() {
  const [menu, setMenu] = useState<IMenu[]>(initialTaskList);
  const [editMenu, setEditMenu] = useState<{ id: number; field: string } | null>(null);
  const [inputValues, setInputValues] = useState<{ [key: number]: { [field: string]: string } }>({});

  const handleAddNew = () => {
    const newDish: IMenu = {
      id: menu.length + 1,
      dishName: `New Dish ${menu.length + 1}`,
      description: "This is a new description.",
      price: 0,
      image: "https://via.placeholder.com/100",
    };
    setMenu([newDish, ...menu]);
  };

  const handleEdit = (id: number, field: string) => {
    setEditMenu({ id, field });
  };

  const handleInputChange = (id: number, field: string, value: string | number) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: typeof value === "number" ? value.toString() : value,
      },
    }));
  };
  

  const handleSave = (id: number, field: keyof IMenu) => {
    const updatedValue = inputValues[id]?.[field]?.trim() || menu.find((item) => item.id === id)?.[field] || "";
    setMenu(menu.map((item) =>
      item.id === id ? { ...item, [field]: updatedValue } : item
    ));
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
  
  

  const handleImageChange = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setMenu(menu.map((item) => 
        item.id === id ? { ...item, image: reader.result as string } : item
      ));
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
          <div className="image-container">
            <img src={item.image} alt={item.dishName} className="dish-image" />
            {!item.image && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleImageChange(item.id, e.target.files[0])}
              />
            )}
          </div>
        
          {editMenu?.id === item.id && editMenu.field === "dishName" ? (
  <input
    type="text"
    value={inputValues[item.id]?.dishName ?? item.dishName}
    onChange={(e) => handleInputChange(item.id, "dishName", e.target.value)}
    onBlur={() => handleSave(item.id, "dishName")}
    autoFocus
  />
) : (
  <h3 onClick={() => handleEdit(item.id, "dishName")}>{item.dishName || "Unnamed Dish"}</h3>
)}

{editMenu?.id === item.id && editMenu.field === "description" ? (
  <textarea
    value={inputValues[item.id]?.description ?? item.description}
    onChange={(e) => handleInputChange(item.id, "description", e.target.value)}
    onBlur={() => handleSave(item.id, "description")}
    autoFocus
  />
) : (
  <p onClick={() => handleEdit(item.id, "description")}>{item.description || "No description available."}</p>
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

        </div>
        
        ))}
      </div>
    </div>
  );
}

export default Menu;
